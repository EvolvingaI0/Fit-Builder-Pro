
import React from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { HydrationLog } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

function GlassIcon({ filled, onClick }: { filled: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} className="relative transform hover:-translate-y-1 transition-transform duration-200">
            <svg className="w-16 h-16" viewBox="0 0 100 125">
            <path d="M10 10 L20 110 L80 110 L90 10 Z" stroke="#e5e7eb" strokeWidth="4" fill="transparent" />
            <foreignObject x="0" y="0" width="100" height="125">
                <div 
                className="w-full h-full transition-all duration-500 origin-bottom" 
                style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.6)', 
                    transform: `scaleY(${filled ? 1 : 0})`,
                    clipPath: 'polygon(10% 8.5%, 90% 8.5%, 80% 95%, 20% 95%)'
                }} 
                />
            </foreignObject>
            </svg>
        </button>
    );
}


function HydrationTracker() {
  const { currentUser } = useAuth();
  const storageKey = currentUser ? `fitBuilderProHydration_${currentUser.email}` : '';
  const todayStr = new Date().toISOString().split('T')[0];
  const [hydrationLog, setHydrationLog] = useLocalStorage<HydrationLog[]>(storageKey, []);
  
  const todayHydration = hydrationLog.find(log => log.date === todayStr) || { date: todayStr, glasses: 0 };
  const waterGoal = 8; // Meta geral de 8 copos (aprox 2L)

  const handleSetGlasses = (count: number) => {
    const newCount = Math.max(0, count);
    const updatedLog = { ...todayHydration, glasses: newCount };
    const otherLogs = hydrationLog.filter(log => log.date !== todayStr);
    setHydrationLog([...otherLogs, updatedLog].sort((a,b) => a.date.localeCompare(b.date)));
  };

  const progress = Math.min(100, (todayHydration.glasses / waterGoal) * 100);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">Controle de Hidratação</h1>
      <Card>
        <div className="flex flex-col items-center">
            <p className="font-semibold text-text-secondary">Hoje você bebeu</p>
            <p className="text-7xl font-extrabold my-2 text-blue-500">{todayHydration.glasses}<span className="text-4xl font-semibold text-text-secondary">/{waterGoal}</span></p>
            <p className="font-semibold text-text-secondary">copos (250ml)</p>
             <div className="flex justify-center items-center space-x-4 mt-6">
                <Button onClick={() => handleSetGlasses(todayHydration.glasses - 1)} disabled={todayHydration.glasses === 0} variant="secondary" className="!p-3 rounded-full">
                  <MinusIcon className="w-6 h-6"/>
                </Button>
                <Button onClick={() => handleSetGlasses(todayHydration.glasses + 1)} className="!p-3 rounded-full">
                  <PlusIcon className="w-6 h-6"/>
                </Button>
            </div>
        </div>
        <div className="p-4 bg-background rounded-lg mt-8">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {Array.from({ length: waterGoal }).map((_, i) => (
                    <GlassIcon key={i} filled={i < todayHydration.glasses} onClick={() => handleSetGlasses(i + 1)} />
                ))}
            </div>
        </div>
        <div className="w-full bg-border rounded-full h-2.5 mt-8">
            <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </Card>
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Dica de Hidratação</h2>
        <p className="text-text-secondary">
            Manter-se hidratado é crucial para a função muscular, níveis de energia e saúde geral. Tente beber um copo de água ao acordar, um antes de cada refeição e um antes de dormir para criar um hábito consistente.
        </p>
      </Card>
    </div>
  );
};

export default HydrationTracker;
