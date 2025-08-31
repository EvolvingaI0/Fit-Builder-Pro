
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { UserProfile } from '../../types';

interface MealPlannerProps {
    userProfile: UserProfile;
}

const mealTimes = ['Café da Manhã', 'Lanche Manhã', 'Almoço', 'Lanche Tarde', 'Jantar'];
const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const getWeekId = () => {
    const now = new Date();
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
    return firstDay.toISOString().split('T')[0];
}

function MealPlanner(_props: MealPlannerProps) {
    const { currentUser, updateUser, isSaving } = useAuth();
    const user = currentUser;
    const weekId = getWeekId();
    
    const initialData = user?.mealPlannerData?.[weekId] || Array(weekDays.length * mealTimes.length).fill('');
    const [meals, setMeals] = useState<string[]>(initialData);
    
    useEffect(() => {
        setMeals(user?.mealPlannerData?.[weekId] || Array(weekDays.length * mealTimes.length).fill(''));
    }, [weekId, user?.mealPlannerData]);
    
    const handleMealChange = (dayIndex: number, mealIndex: number, value: string) => {
        const index = dayIndex * mealTimes.length + mealIndex;
        const newMeals = [...meals];
        newMeals[index] = value;
        setMeals(newMeals);
    };

    const handleSaveChanges = () => {
        if (!user) return;
        const newPlannerData = {
            ...(user.mealPlannerData || {}),
            [weekId]: meals
        };
        updateUser({ ...user, mealPlannerData: newPlannerData });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Planner de Refeições</h1>
                    <p className="text-text-secondary mt-1">Organize seu cardápio para a semana.</p>
                </div>
                <Button onClick={handleSaveChanges} isLoading={isSaving} className="px-6 py-2">
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
            <Card className="p-0 overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-6 bg-background sticky top-0 z-10">
                        <div className="col-span-1 p-3 font-semibold text-text-primary text-sm border-b border-r border-border">Refeição</div>
                        {weekDays.map(day => <div key={day} className="p-3 font-semibold text-text-primary text-sm text-center border-b border-r border-border last:border-r-0">{day}</div>)}
                    </div>
                    <div className="divide-y divide-border">
                    {mealTimes.map((mealTime, mealIndex) => (
                        <div key={mealTime} className="grid grid-cols-6 items-stretch">
                            <div className="col-span-1 p-3 font-bold text-text-primary bg-background flex items-center justify-center text-center border-r border-border text-sm">{mealTime}</div>
                            {weekDays.map((_, dayIndex) => (
                                <div key={dayIndex} className="p-1 border-r border-border last:border-r-0">
                                    <textarea
                                        value={meals[dayIndex * mealTimes.length + mealIndex]}
                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, e.target.value)}
                                        className="w-full h-28 p-2 text-sm bg-surface rounded-md border-transparent hover:bg-background focus:bg-background focus:border-primary focus:ring-primary resize-none transition-colors"
                                        placeholder="..."
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MealPlanner;
