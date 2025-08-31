
import React from 'react';
import Card from './common/Card';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRightIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/solid';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';
import { HydrationLog, ProgressEntry } from '../types';
import { predefinedHabits } from './tools/HabitTracker';
import Button from './common/Button';

interface HomeProps {
    setActiveView: (view: 'fitness' | 'diet' | 'scanner' | 'tools' | 'settings') => void;
}

const motivationalQuotes = [
    "A força não vem da capacidade física. Vem de uma vontade indomável.",
    "O corpo alcança o que a mente acredita.",
    "A dor que você sente hoje será a força que você sentirá amanhã.",
    "Não se trata de ser o melhor. Trata-se de ser melhor do que você era ontem.",
    "O sucesso no treino é a soma de pequenos esforços repetidos dia após dia."
];

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
};

function Home({ setActiveView }: HomeProps) {
    const { currentUser } = useAuth();
    const user = currentUser;
    
    // Data hooks
    const [hydrationLog] = useLocalStorage<HydrationLog[]>(`fitBuilderProHydration_${user?.email || ''}`, []);
    const [progressLog] = useLocalStorage<ProgressEntry[]>(`fitBuilderProProgress_${user?.email || ''}`, []);
    const [habitsLog] = useLocalStorage<Record<string, Record<string, boolean[]>>>(`fitBuilderProHabitLog_${user?.email || ''}`, {});

    if (!user || !user.profile) {
        return <p>Carregando...</p>;
    }
    
    const plan = user?.fitnessPlan;
    const dietPlan = user?.dietPlan;
    const today = new Date();

    // Data processing for charts and stats
    const getWeekId = (d: Date) => {
        const date = new Date(d);
        date.setHours(0,0,0,0);
        date.setDate(date.getDate() - date.getDay());
        return date.toISOString().split('T')[0];
    }

    const calculateStreak = () => {
        let streak = 0;
        let currentDate = new Date();
        
        const areAllHabitsDoneForDate = (date: Date) => {
            const weekId = getWeekId(date);
            const dayIndex = date.getDay();
            const weekLog = habitsLog[weekId];
            if (!weekLog) return false;
            return predefinedHabits.every(habit => weekLog[habit.id]?.[dayIndex] === true);
        };
        
        while(areAllHabitsDoneForDate(currentDate)){
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        return streak;
    }
    const habitStreak = calculateStreak();

    const currentWeekId = getWeekId(today);
    const currentWeekHabitLog = habitsLog[currentWeekId] || {};

    const weeklyHabitConsistency = predefinedHabits.map(habit => {
        const log = currentWeekHabitLog[habit.id] || [];
        const completed = log.filter(Boolean).length;
        return { name: habit.name.split(' ')[0], completed };
    });

    const weeklyWaterIntake = Array(7).fill(0).map((_, i) => {
        const day = new Date(today);
        day.setDate(day.getDate() - (today.getDay() - i));
        const dayStr = day.toISOString().split('T')[0];
        const log = hydrationLog.find(l => l.date === dayStr);
        return { name: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i], glasses: log?.glasses || 0 };
    });

    const weightData = progressLog.slice(-10).map(p => ({
        name: new Date(p.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        peso: p.weight
    }));

    const workoutForToday = (!plan || !plan.workouts || plan.workouts.length === 0) ? null : plan.workouts.find(w => ((today.getDay() || 7) - 1) % plan.workouts.length === w.day - 1);
    
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const todayDayName = dayNames[today.getDay()];
    const dietForToday = dietPlan?.weeklyDiet.find(d => d.dayOfWeek.toLowerCase() === todayDayName.toLowerCase());

    const todaysMacros = dietForToday 
        ? {
            calories: dietForToday.totalCalories,
            protein: dietForToday.totalProtein,
            carbs: dietForToday.totalCarbs,
            fats: dietForToday.totalFats
        } 
        : dietPlan?.weeklyAverage;

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    
    const { currentWeight, targetWeight } = user.profile;
    const initialWeight = progressLog.length > 0 ? progressLog[0].weight : currentWeight;
    
    const weightLost = initialWeight - currentWeight;
    const totalToLose = initialWeight - targetWeight;
    let weightProgress = totalToLose !== 0 ? Math.max(0, Math.min(100, (weightLost / totalToLose) * 100)) : (currentWeight === targetWeight ? 100 : 0);
    if(targetWeight > initialWeight) { // Gain muscle case
        const totalToGain = targetWeight - initialWeight;
        const weightGained = currentWeight - initialWeight;
        weightProgress = totalToGain !== 0 ? Math.max(0, Math.min(100, (weightGained / totalToGain) * 100)) : (currentWeight === targetWeight ? 100 : 0);
    }


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-text-primary">{getGreeting()}, <span className="text-primary">{user.profile.name}!</span></h1>
                <p className="text-text-secondary mt-1">Aqui está um resumo da sua jornada hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="font-semibold text-text-secondary mb-2">Progresso da Meta de Peso</h3>
                    <div className="flex justify-between text-sm font-bold mb-1">
                        <span className="text-text-primary">{initialWeight} kg</span>
                        <span className="text-primary">{targetWeight} kg</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full transition-all duration-1000" style={{ width: `${weightProgress}%` }}></div>
                    </div>
                     <p className="text-center text-sm mt-2 font-semibold text-text-secondary">Você está a <span className="text-primary">{Math.abs(currentWeight - targetWeight).toFixed(1)} kg</span> da sua meta.</p>
                </Card>
                <Card className="flex flex-col items-center justify-center text-center">
                    <p className="text-5xl font-extrabold text-orange-500">{habitStreak}</p>
                    <p className="font-semibold text-text-secondary mt-1">Dias de Sequência 🔥</p>
                </Card>
                 <Card className="flex flex-col items-center justify-center text-center">
                    <p className="text-5xl font-extrabold text-blue-500">{weeklyWaterIntake[today.getDay()].glasses}</p>
                    <p className="font-semibold text-text-secondary mt-1">Copos de Água Hoje</p>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-2xl font-bold mb-4 text-text-primary">Foco do Dia</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-background rounded-lg">
                                <h3 className="font-bold text-text-primary mb-3">Treino de Hoje</h3>
                                {workoutForToday ? (
                                    <>
                                        <p className="font-semibold text-primary text-lg">{workoutForToday.focus}</p>
                                        <p className="text-sm text-text-secondary">{workoutForToday.exercises.length} exercícios planejados</p>
                                        <Button onClick={() => setActiveView('fitness')} className="mt-4 w-full justify-between">Ver Treino <ArrowRightIcon className="w-4 h-4"/></Button>
                                    </>
                                ) : (
                                    <p className="text-text-secondary">Dia de descanso ou nenhum plano de treino ativo.</p>
                                )}
                            </div>
                            <div className="p-4 bg-background rounded-lg">
                                <h3 className="font-bold text-text-primary mb-3">Hábitos de Hoje</h3>
                                <div className="space-y-2">
                                    {predefinedHabits.slice(0, 4).map(habit => {
                                        const isDone = currentWeekHabitLog[habit.id]?.[today.getDay()];
                                        return (
                                            <div key={habit.id} className="flex items-center text-sm">
                                                {isDone ? <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> : <XCircleIcon className="w-5 h-5 text-gray-300 mr-2"/>}
                                                <span className={isDone ? 'text-text-secondary line-through' : 'text-text-primary'}>{habit.name}</span>
                                            </div>
                                        )
                                    })}
                                    <button onClick={() => setActiveView('tools')} className="text-sm font-semibold text-primary hover:underline mt-2">Ver todos &rarr;</button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                         <h2 className="text-2xl font-bold mb-4 text-text-primary">Resumo Semanal</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
                             <div>
                                <h3 className="font-semibold text-text-secondary text-center text-sm mb-2">Consistência de Hábitos</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyHabitConsistency} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip cursor={{fill: 'rgba(109, 40, 217, 0.1)'}}/>
                                        <Bar dataKey="completed" name="Dias Concluídos" fill="#6d28d9" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                             <div>
                                <h3 className="font-semibold text-text-secondary text-center text-sm mb-2">Ingestão de Água (copos)</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyWaterIntake} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false}/>
                                        <YAxis />
                                        <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}/>
                                        <Bar dataKey="glasses" name="Copos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                         </div>
                    </Card>

                    {weightData.length > 1 && (
                        <Card>
                            <h2 className="text-2xl font-bold mb-4 text-text-primary">Evolução do Peso</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                     <LineChart data={weightData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis domain={['dataMin - 2', 'dataMax + 2']}/>
                                        <Tooltip />
                                        <Line type="monotone" dataKey="peso" stroke="#6d28d9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Side Column */}
                <div className="space-y-6">
                    {dietPlan && todaysMacros && (
                        <Card>
                            <h2 className="text-xl font-bold mb-4 text-text-primary">Plano de Dieta de Hoje</h2>
                             <div className="h-48 w-full flex items-center justify-center">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie 
                                            data={[
                                                {name: 'Proteínas', value: todaysMacros.protein},
                                                {name: 'Carboidratos', value: todaysMacros.carbs},
                                                {name: 'Gorduras', value: todaysMacros.fats}
                                            ]} 
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={50} 
                                            outerRadius={70} 
                                            labelLine={false}
                                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            <Cell fill="#3b82f6" />
                                            <Cell fill="#f59e0b" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value}g`}/>
                                    </PieChart>
                                </ResponsiveContainer>
                             </div>
                             <p className="text-center text-3xl font-bold text-primary">{todaysMacros.calories}<span className="text-lg text-text-secondary"> kcal</span></p>
                             <Button onClick={() => setActiveView('diet')} className="mt-4 w-full">Ver Dieta Detalhada</Button>
                        </Card>
                    )}
                    <Card className="bg-primary text-primary-content">
                        <div className="flex items-center space-x-3 mb-3">
                            <SparklesIcon className="w-6 h-6"/>
                            <h2 className="text-xl font-bold">Dica Rápida</h2>
                        </div>
                        <p className="text-primary-content/90">{randomQuote}</p>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold mb-4 text-text-primary">Ações Rápidas</h2>
                        <div className="space-y-3">
                            <button onClick={() => setActiveView('scanner')} className="group w-full flex justify-between items-center p-3 bg-background rounded-lg hover:bg-primary/10 transition-colors">
                                <span className="font-semibold text-text-primary">Analisar Refeição</span>
                                <ArrowRightIcon className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors"/>
                            </button>
                            <button onClick={() => setActiveView('tools')} className="group w-full flex justify-between items-center p-3 bg-background rounded-lg hover:bg-primary/10 transition-colors">
                                <span className="font-semibold text-text-primary">Ver todas as Ferramentas</span>
                                <ArrowRightIcon className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors"/>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Home;
