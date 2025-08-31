
import React, { useState, useEffect } from 'react';
import { FitnessPlan, WorkoutDay } from '../types';
import { generateFitnessPlan } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDownIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/solid';

const loadingMessages = [
  "Analisando seu perfil de fitness...",
  "Consultando nossos treinadores de IA...",
  "Construindo seu treino personalizado...",
  "Elaborando as séries e repetições perfeitas...",
  "Quase lá, preparando seu plano!"
];

type WorkoutDayCardProps = {
    day: WorkoutDay;
};

function WorkoutDayCard({ day }: WorkoutDayCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <FireIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-left text-primary">Dia {day.day}</h2>
                        <p className="text-left font-semibold text-text-secondary">{day.focus}</p>
                    </div>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen pt-4 mt-4 border-t border-border' : 'max-h-0 pt-0 mt-0'} overflow-hidden`}>
                <ul className="divide-y divide-border">
                  {day.exercises.map((exercise) => (
                    <li key={exercise.name} className="py-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <span className="font-semibold text-text-primary text-lg">{exercise.name}</span>
                        <span className="text-text-secondary font-medium">{exercise.sets} séries de {exercise.reps} repetições</span>
                      </div>
                      {exercise.tip && (
                          <div className="flex items-start space-x-2 text-sm text-primary/80 mt-2 p-2 bg-primary/5 rounded-md">
                            <SparklesIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary"/>
                            <p><strong>Dica:</strong> {exercise.tip}</p>
                          </div>
                      )}
                    </li>
                  ))}
                </ul>
            </div>
        </Card>
    )
}

function FitnessPlanView() {
  const { currentUser, updateUser } = useAuth();
  const plan = currentUser?.fitnessPlan;
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
      const newPlan = await generateFitnessPlan(userProfile);
      updateUser({ ...currentUser!, fitnessPlan: newPlan });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(`Falha ao gerar o plano de treino: ${errorMessage}. Por favor, tente novamente mais tarde.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearPlan = () => {
    if (window.confirm("Tem certeza que deseja apagar seu plano atual e gerar um novo?")) {
        updateUser({ ...currentUser!, fitnessPlan: undefined });
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
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Seu Plano de Treino te Espera</h2>
        <p className="mb-6 text-text-secondary max-w-md mx-auto">Pronto para começar? Gere um novo plano de treino personalizado para seu perfil e objetivos.</p>
        <Button onClick={handleGeneratePlan} isLoading={isLoading} className="py-3 px-6">
          Gerar Meu Plano de Treino
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-text-primary">Seu Plano de Treino</h1>
        <Button onClick={handleClearPlan} variant='secondary'>Gerar Novo Plano</Button>
      </div>
      <div className="space-y-6">
        {plan.workouts.map((day) => (
          <WorkoutDayCard key={day.day} day={day} />
        ))}
      </div>
    </div>
  );
};

export default FitnessPlanView;
