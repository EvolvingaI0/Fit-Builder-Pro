
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CalculatorProps {
    userProfile: UserProfile;
}

type CalculatorGoal = 'lose_weight' | 'gain_muscle' | 'maintain_fitness';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

const getInitialGoal = (mainGoal: UserProfile['mainGoal']): CalculatorGoal => {
    const validGoals: CalculatorGoal[] = ['lose_weight', 'gain_muscle', 'maintain_fitness'];
    if (validGoals.includes(mainGoal as CalculatorGoal)) {
        return mainGoal as CalculatorGoal;
    }
    return 'maintain_fitness';
}


function CalorieCalculator({ userProfile }: CalculatorProps) {
    const [details, setDetails] = useState({
        age: userProfile.age,
        gender: userProfile.gender,
        height: userProfile.height,
        weight: userProfile.currentWeight,
        activityLevel: 'moderately_active' as ActivityLevel,
        goal: getInitialGoal(userProfile.mainGoal),
    });
    const [results, setResults] = useState<{ tdee: number; protein: number; carbs: number; fats: number; } | null>(null);
    const [displayTdee, setDisplayTdee] = useState(0);

    useEffect(() => {
        setDetails({
            age: userProfile.age,
            gender: userProfile.gender,
            height: userProfile.height,
            weight: userProfile.currentWeight,
            activityLevel: 'moderately_active' as ActivityLevel,
            goal: getInitialGoal(userProfile.mainGoal),
        });
    }, [userProfile]);
    
    useEffect(() => {
        if (!results) return;

        let startValue = 0;
        const endValue = results.tdee;
        if (startValue === endValue) {
            setDisplayTdee(endValue);
            return;
        }

        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentDisplayValue = Math.floor(progress * (endValue - startValue) + startValue);
            setDisplayTdee(currentDisplayValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayTdee(endValue);
            }
        };

        requestAnimationFrame(animate);

    }, [results]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumber = ['age', 'height', 'weight'].includes(name);
        setDetails(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const calculate = () => {
        const { age, gender, height, weight, activityLevel, goal } = details;

        // Mifflin-St Jeor Equation for BMR
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        if (gender === 'male') bmr += 5;
        else if (gender === 'female') bmr -= 161;

        // TDEE Calculation
        const activityMultipliers: Record<ActivityLevel, number> = {
            sedentary: 1.2,
            lightly_active: 1.375,
            moderately_active: 1.55,
            very_active: 1.725,
        };
        let tdee = bmr * activityMultipliers[activityLevel];

        if (goal === 'lose_weight') tdee -= 500;
        else if (goal === 'gain_muscle') tdee += 300;
        
        const macroSplits: Record<CalculatorGoal, {p: number, c: number, f: number}> = {
            lose_weight: { p: 0.40, c: 0.30, f: 0.30 },
            gain_muscle: { p: 0.35, c: 0.40, f: 0.25 },
            maintain_fitness: { p: 0.30, c: 0.40, f: 0.30 },
        };

        const split = macroSplits[goal];
        const protein = Math.round((tdee * split.p) / 4);
        const carbs = Math.round((tdee * split.c) / 4);
        const fats = Math.round((tdee * split.f) / 9);

        setResults({ tdee: Math.round(tdee), protein, carbs, fats });
    };

    const labelClasses = "block mb-1 font-medium text-text-secondary text-sm";
    const inputClasses = "w-full p-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none";

    const macroData = results ? [
        { name: 'Proteína', value: results.protein, color: '#3b82f6' },
        { name: 'Carboidratos', value: results.carbs, color: '#f59e0b' },
        { name: 'Gorduras', value: results.fats, color: '#ef4444' }
    ] : [];


    return (
        <div className="space-y-8">
             <h1 className="text-3xl font-bold text-text-primary">Calculadora de Calorias</h1>
             <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>Idade</label>
                        <input type="number" name="age" value={details.age} onChange={handleInputChange} className={inputClasses}/>
                    </div>
                     <div>
                        <label className={labelClasses}>Gênero</label>
                        <select name="gender" value={details.gender} onChange={handleInputChange} className={inputClasses}>
                            <option value="male">Masculino</option>
                            <option value="female">Feminino</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>Altura (cm)</label>
                        <input type="number" name="height" value={details.height} onChange={handleInputChange} className={inputClasses}/>
                    </div>
                    <div>
                        <label className={labelClasses}>Peso (kg)</label>
                        <input type="number" name="weight" value={details.weight} onChange={handleInputChange} className={inputClasses}/>
                    </div>
                     <div className="md:col-span-2">
                        <label className={labelClasses}>Nível de Atividade</label>
                        <select name="activityLevel" value={details.activityLevel} onChange={handleInputChange} className={inputClasses}>
                            <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
                            <option value="lightly_active">Levemente Ativo (exercício leve 1-3 dias/semana)</option>
                            <option value="moderately_active">Moderadamente Ativo (exercício moderado 3-5 dias/semana)</option>
                            <option value="very_active">Muito Ativo (exercício intenso 6-7 dias/semana)</option>
                        </select>
                    </div>
                     <div className="md:col-span-2">
                        <label className={labelClasses}>Objetivo</label>
                        <select name="goal" value={details.goal} onChange={handleInputChange} className={inputClasses}>
                            <option value="lose_weight">Perder Peso</option>
                            <option value="gain_muscle">Ganhar Massa Muscular</option>
                            <option value="maintain_fitness">Manter a Forma</option>
                        </select>
                    </div>
                </div>
                 <Button onClick={calculate} className="w-full mt-6 py-3">Calcular</Button>
             </Card>

             {results && (
                 <Card className="animate-fadeIn">
                     <h2 className="text-2xl font-bold mb-4 text-text-primary text-center">Seus Resultados Estimados</h2>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        <div className="text-center p-4">
                            <p className="text-lg text-text-secondary">Calorias para seu Objetivo</p>
                            <p className="text-6xl font-extrabold text-primary animate-countup">{displayTdee.toLocaleString('pt-BR')}</p>
                            <p className="font-semibold text-text-secondary">kcal/dia</p>
                        </div>
                        <div className="w-full h-64">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={macroData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${entry.value}g`}>
                                      {macroData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                                    </Pie>
                                    <Legend />
                                    <Tooltip formatter={(value, name) => [`${value}g (${((Number(value) * (name === 'Gorduras' ? 9 : 4)) / results.tdee * 100).toFixed(0)}%)`, name]}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                     <p className="text-xs text-text-secondary mt-6 text-center italic">
                        *Resultados baseados na fórmula de Mifflin-St Jeor. Estes valores são estimativas e devem servir como ponto de partida.
                     </p>
                 </Card>
             )}
        </div>
    );
};

export default CalorieCalculator;
