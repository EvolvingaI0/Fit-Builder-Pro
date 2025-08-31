
import React, { useState, useEffect } from 'react';
import { DietPlan, Meal, DailyDiet } from '../types';
import { generateDietPlan } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDownIcon, SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/solid';

const loadingMessages = [
  "Analisando suas necessidades nutricionais...",
  "Consultando nossos nutricionistas de IA...",
  "Balanceando seus macronutrientes para a semana...",
  "Criando refeições deliciosas e econômicas...",
  "Seu plano de dieta semanal está sendo servido!"
];

const getMealIcon = (mealName: string) => {
    const lowerCaseName = mealName.toLowerCase();
    if (lowerCaseName.includes('café') || lowerCaseName.includes('almoço')) {
        return <SunIcon className="w-6 h-6 text-amber-500"/>;
    }
    if (lowerCaseName.includes('lanche')) {
        return <SparklesIcon className="w-6 h-6 text-yellow-500"/>;
    }
    if (lowerCaseName.includes('jantar') || lowerCaseName.includes('ceia')) {
        return <MoonIcon className="w-6 h-6 text-indigo-500"/>
    }
    return <SunIcon className="w-6 h-6 text-amber-500"/>;
}

type MealCardProps = {
    meal: Meal;
};

function MealCard({ meal }: MealCardProps) {
    return (
        <div className="p-4 bg-background rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
                {getMealIcon(meal.name)}
                <h4 className="font-bold text-text-primary">{meal.name} <span className="font-normal text-sm text-text-secondary">- {meal.calories} kcal</span></h4>
            </div>
            <p className="text-sm text-text-secondary mt-1 mb-2 pl-9">{meal.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-text-secondary pl-9">
                <span><span className="font-bold text-blue-500">{meal.protein}</span>g proteína</span>
                <span><span className="font-bold text-amber-500">{meal.carbs}</span>g carboidratos</span>
                <span><span className="font-bold text-red-500">{meal.fats}</span>g gorduras</span>
            </div>
        </div>
    );
};

type DailyDietCardProps = {
    dailyDiet: DailyDiet;
};

function DailyDietCard({ dailyDiet }: DailyDietCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <Card className="overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center">
                <div className="text-left">
                    <h3 className="text-xl font-bold text-primary">{dailyDiet.dayOfWeek}</h3>
                    <p className="text-sm font-medium text-text-secondary">{dailyDiet.totalCalories} kcal</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-text-secondary">
                        <span><span className="font-bold text-blue-500">{dailyDiet.totalProtein}</span>g P</span>
                        <span><span className="font-bold text-amber-500">{dailyDiet.totalCarbs}</span>g C</span>
                        <span><span className="font-bold text-red-500">{dailyDiet.totalFats}</span>g F</span>
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen pt-4 mt-4 border-t border-border' : 'max-h-0 pt-0 mt-0'} overflow-hidden`}>
                <div className="space-y-4">
                    {dailyDiet.meals.map(meal => <MealCard key={meal.name} meal={meal} />)}
                </div>
            </div>
        </Card>
    );
};

function DietPlanView() {
  const { currentUser, updateUser } = useAuth();
  const plan = currentUser?.dietPlan;
  const userProfile = currentUser?.profile;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  
  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setCurrentMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          return loadingMessages[(currentIndex + 1) % loadingMessages.length];
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleGeneratePlan = async () => {
    if (!userProfile) {
        setError("Perfil de usuário não encontrado.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentMessage(loadingMessages[0]);
    try {
      const newPlan = await generateDietPlan(userProfile);
      updateUser({ ...currentUser!, dietPlan: newPlan });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(`Falha ao gerar o plano de dieta: ${errorMessage}. Por favor, tente novamente mais tarde.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearPlan = () => {
     if (window.confirm("Tem certeza que deseja apagar seu plano atual e gerar um novo?")) {
        updateUser({ ...currentUser!, dietPlan: undefined });
     }
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-xl font-semibold text-primary">{currentMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleGeneratePlan}>Tentar Novamente</Button>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="text-center py-12 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Seu Plano de Dieta te Espera</h2>
        <p className="mb-6 text-text-secondary max-w-md mx-auto">Pronto para nutrir seu corpo? Gere um novo plano de dieta semanal personalizado para seu perfil, objetivos e orçamento.</p>
        <Button onClick={handleGeneratePlan} isLoading={isLoading} className="py-3 px-6">
          Gerar Meu Plano de Dieta
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-text-primary">Seu Plano de Dieta Semanal</h1>
        <Button onClick={handleClearPlan} variant='secondary'>Gerar Novo Plano</Button>
      </div>
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Médias Semanais</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
                <p className="text-sm text-text-secondary">Calorias</p>
                <p className="text-2xl font-bold text-primary">{plan.weeklyAverage.calories}</p>
            </div>
             <div>
                <p className="text-sm text-text-secondary">Proteína</p>
                <p className="text-2xl font-bold text-blue-500">{plan.weeklyAverage.protein}g</p>
            </div>
             <div>
                <p className="text-sm text-text-secondary">Carboidratos</p>
                <p className="text-2xl font-bold text-amber-500">{plan.weeklyAverage.carbs}g</p>
            </div>
             <div>
                <p className="text-sm text-text-secondary">Gorduras</p>
                <p className="text-2xl font-bold text-red-500">{plan.weeklyAverage.fats}g</p>
            </div>
        </div>
      </Card>
      <div className="space-y-6">
        {plan.weeklyDiet.map((dailyDiet) => (
          <DailyDietCard key={dailyDiet.dayOfWeek} dailyDiet={dailyDiet} />
        ))}
      </div>
    </div>
  );
};

export default DietPlanView;
