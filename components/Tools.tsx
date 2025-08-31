
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftIcon, CalculatorIcon, ClockIcon, DocumentTextIcon, FireIcon, ListBulletIcon, BeakerIcon, ChartBarIcon, CalendarDaysIcon, SparklesIcon, CheckBadgeIcon, BookOpenIcon } from '@heroicons/react/24/outline';

import CalorieCalculator from './tools/CalorieCalculator';
import HydrationTracker from './tools/HydrationTracker';
import WeightTracker from './tools/WeightTracker';
import ExerciseTimer from './tools/ExerciseTimer';
import ShoppingList from './tools/ShoppingList';
import HabitTracker from './tools/HabitTracker';
import MealPlanner from './tools/MealPlanner';
import WorkoutSchedule from './tools/WorkoutSchedule';
import ContentLibrary from './tools/ContentLibrary';
import Challenges from './tools/Challenges';

type ToolKey = 'calories' | 'hydration' | 'weight' | 'timer' | 'meals' | 'shopping' | 'schedule' | 'library' | 'challenges' | 'habits';

const toolsList = [
    { id: 'calories', title: 'Calculadora de Calorias', icon: CalculatorIcon, description: 'Calcule suas necessidades diárias de calorias e macros.', component: CalorieCalculator, enabled: true },
    { id: 'hydration', title: 'Controle de Água', icon: BeakerIcon, description: 'Monitore sua ingestão diária de água para se manter hidratado.', component: HydrationTracker, enabled: true },
    { id: 'weight', title: 'Controle de Peso', icon: ChartBarIcon, description: 'Registre seu peso e medidas para ver sua evolução.', component: WeightTracker, enabled: true },
    { id: 'timer', title: 'Cronômetro de Exercícios', icon: ClockIcon, description: 'Use timers para seus treinos, como HIIT e Tabata.', component: ExerciseTimer, enabled: true },
    { id: 'shopping', title: 'Lista de Compras', icon: ListBulletIcon, description: 'Crie e gerencie sua lista de compras de supermercado.', component: ShoppingList, enabled: true },
    { id: 'habits', title: 'Checklist de Hábitos', icon: CheckBadgeIcon, description: 'Acompanhe seus hábitos diários e construa consistência.', component: HabitTracker, enabled: true },
    { id: 'meals', title: 'Planner de Refeições', icon: DocumentTextIcon, description: 'Monte seu próprio cardápio para organizar sua semana.', component: MealPlanner, enabled: true },
    { id: 'schedule', title: 'Agenda de Treinos', icon: CalendarDaysIcon, description: 'Marque seus treinos em um calendário para se organizar.', component: WorkoutSchedule, enabled: true },
    { id: 'library', title: 'Biblioteca de Conteúdo', icon: BookOpenIcon, description: 'Artigos, dicas e vídeos para aprofundar seu conhecimento.', component: ContentLibrary, enabled: true },
    { id: 'challenges', title: 'Desafios', icon: FireIcon, description: 'Participe de desafios fixos para se manter motivado.', component: Challenges, enabled: true },
];

function Tools() {
    const [selectedTool, setSelectedTool] = useState<ToolKey | null>(null);
    const { currentUser } = useAuth();
    
    if(!currentUser || !currentUser.profile) return <p>Carregando...</p>;

    const handleSelectTool = (toolId: ToolKey) => {
        const tool = toolsList.find(t => t.id === toolId);
        if (tool && tool.enabled) {
            setSelectedTool(toolId);
        }
    };

    const handleBack = () => {
        setSelectedTool(null);
    };

    if (selectedTool) {
        const tool = toolsList.find(t => t.id === selectedTool);
        const ToolComponent = tool?.component;

        return (
            <div className="animate-fadeIn">
                <button onClick={handleBack} className="flex items-center space-x-2 font-semibold text-text-secondary hover:text-text-primary transition-colors mb-6">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Voltar para Ferramentas</span>
                </button>
                {ToolComponent ? <ToolComponent userProfile={currentUser.profile} /> : <p>Ferramenta não encontrada.</p>}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Ferramentas</h1>
                <p className="text-text-secondary mt-1">Explore nossas ferramentas para ajudar você a atingir seus objetivos de forma mais eficaz.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolsList.map(tool => (
                    <div key={tool.id} onClick={() => handleSelectTool(tool.id as ToolKey)} className={`group relative p-6 bg-surface border rounded-xl transition-all duration-300 ${tool.enabled ? 'cursor-pointer hover:border-primary hover:shadow-lg hover:-translate-y-1' : 'opacity-60 cursor-not-allowed'}`}>
                        {!tool.enabled && (
                            <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">EM BREVE</div>
                        )}
                        <div className={`mb-4 inline-block p-3 rounded-lg transition-colors ${tool.enabled ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                            <tool.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">{tool.title}</h3>
                        <p className="text-text-secondary text-sm">{tool.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tools;
