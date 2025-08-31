
import React from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import { CheckIcon } from '@heroicons/react/24/solid';

export const predefinedHabits = [
    { id: 'sleep', name: 'Dormir 7-8 horas' },
    { id: 'water', name: 'Beber 2L de água' },
    { id: 'steps', name: 'Fazer 10.000 passos' },
    { id: 'workout', name: 'Fazer o treino do dia' },
    { id: 'no_sugar', name: 'Evitar açúcar refinado' },
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const getWeekId = () => {
    const now = new Date();
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
    return firstDay.toISOString().split('T')[0];
}

const ProgressRing = ({ percentage }: { percentage: number }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-14 h-14">
            <svg className="w-full h-full" viewBox="0 0 50 50">
                <circle className="text-border" strokeWidth="5" stroke="currentColor" fill="transparent" r={radius} cx="25" cy="25" />
                <circle
                    className="text-primary"
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="25"
                    cy="25"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
                {Math.round(percentage)}%
            </span>
        </div>
    );
};


function HabitTracker() {
    const { currentUser } = useAuth();
    const weekId = getWeekId();
    const storageKey = currentUser ? `fitBuilderProHabitLog_${currentUser.email}` : '';

    const [habitsLog, setHabitsLog] = useLocalStorage<Record<string, Record<string, boolean[]>>>(
        storageKey,
        {}
    );

    const currentWeekLog = habitsLog[weekId] || {};

    const toggleHabit = (habitId: string, dayIndex: number) => {
        const newLog = { ...habitsLog };
        if (!newLog[weekId]) {
            newLog[weekId] = {};
        }
        if (!newLog[weekId][habitId]) {
            newLog[weekId][habitId] = Array(7).fill(false);
        }
        newLog[weekId][habitId][dayIndex] = !newLog[weekId][habitId][dayIndex];
        setHabitsLog(newLog);
    };

    const getConsistency = (habitId: string): number => {
        const habitLog = currentWeekLog[habitId] || [];
        const completedDays = habitLog.filter(Boolean).length;
        const todayIndex = new Date().getDay();
        const daysPassed = todayIndex + 1;
        return daysPassed > 0 ? (completedDays / daysPassed) * 100 : 0;
    };
    
    const todayIndex = new Date().getDay();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">Checklist de Hábitos</h1>
            <p className="text-text-secondary">Marque seus hábitos diários para construir uma rotina saudável e consistente.</p>
            <div className="space-y-4">
                {predefinedHabits.map(habit => (
                    <Card key={habit.id} className="p-4">
                        <div className="flex items-center justify-between gap-4">
                             <div className="flex items-center gap-4">
                                <ProgressRing percentage={getConsistency(habit.id)} />
                                <div>
                                    <p className="font-bold text-text-primary text-lg">{habit.name}</p>
                                    <p className="text-sm text-text-secondary">Consistência nesta semana</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center justify-center gap-2">
                                {weekDays.map((day, dayIndex) => (
                                    <button
                                        key={dayIndex}
                                        onClick={() => toggleHabit(habit.id, dayIndex)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border-2
                                            ${currentWeekLog[habit.id]?.[dayIndex] ? 'bg-primary border-primary text-white' : 'bg-surface border-border hover:bg-primary/10'}
                                            ${dayIndex === todayIndex ? 'ring-2 ring-primary ring-offset-2' : ''}
                                            disabled:opacity-50
                                        `}
                                        disabled={dayIndex > todayIndex}
                                    >
                                        <span className="font-bold text-sm">{day}</span>
                                        {currentWeekLog[habit.id]?.[dayIndex] && <CheckIcon className="w-5 h-5 absolute"/>}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div className="sm:hidden flex items-center justify-center gap-2 mt-4">
                                {weekDays.map((day, dayIndex) => (
                                    <button
                                        key={dayIndex}
                                        onClick={() => toggleHabit(habit.id, dayIndex)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border-2
                                            ${currentWeekLog[habit.id]?.[dayIndex] ? 'bg-primary border-primary text-white' : 'bg-surface border-border hover:bg-primary/10'}
                                            ${dayIndex === todayIndex ? 'ring-2 ring-primary ring-offset-2' : ''}
                                            disabled:opacity-50
                                        `}
                                        disabled={dayIndex > todayIndex}
                                    >
                                        <span className="font-bold text-sm">{day}</span>
                                        {currentWeekLog[habit.id]?.[dayIndex] && <CheckIcon className="w-5 h-5 absolute"/>}
                                    </button>
                                ))}
                         </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default HabitTracker;
