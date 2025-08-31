
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import { CheckIcon, FireIcon } from '@heroicons/react/24/solid';

const challenges = [
    { id: 'squat30', name: '30 Dias de Agachamento', duration: 30, icon: FireIcon, gradient: 'from-orange-500 to-red-600' },
    { id: 'noSoda7', name: '7 Dias Sem Refrigerante', duration: 7, icon: FireIcon, gradient: 'from-sky-400 to-blue-600' },
    { id: 'plank30', name: '30 Dias de Prancha', duration: 30, icon: FireIcon, gradient: 'from-emerald-400 to-teal-600' },
];

function Challenges() {
    const { currentUser, updateUser } = useAuth();
    const user = currentUser;

    const toggleDay = (challengeId: string, dayIndex: number) => {
        if (!user) return;
        const currentProgress = user.challengeProgress || {};
        const challengeLog = currentProgress[challengeId] || Array(challenges.find(c => c.id === challengeId)!.duration).fill(false);
        
        const newChallengeLog = [...challengeLog];
        newChallengeLog[dayIndex] = !newChallengeLog[dayIndex];
        
        const newProgress = { ...currentProgress, [challengeId]: newChallengeLog };
        updateUser({ ...user, challengeProgress: newProgress });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">Desafios</h1>
            <p className="text-text-secondary">Participe de desafios para construir hábitos e se manter motivado.</p>
            <div className="space-y-6">
                {challenges.map(challenge => {
                    const progress = user?.challengeProgress?.[challenge.id] || [];
                    const completedDays = progress.filter(Boolean).length;
                    const progressPercent = (completedDays / challenge.duration) * 100;

                    return (
                        <Card key={challenge.id} className="overflow-hidden">
                            <div className={`p-6 bg-gradient-to-br ${challenge.gradient} text-white`}>
                                <div className="flex items-center space-x-4">
                                    <challenge.icon className="w-8 h-8"/>
                                    <div>
                                        <h2 className="text-xl font-bold">{challenge.name}</h2>
                                        <p className="text-sm font-semibold opacity-80">{completedDays} / {challenge.duration} dias completos</p>
                                    </div>
                                </div>
                                 <div className="w-full bg-white/30 rounded-full h-2.5 mt-4">
                                    <div className="bg-white h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>
                            <div className="p-4 bg-background">
                                <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
                                    {Array.from({ length: challenge.duration }).map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => toggleDay(challenge.id, i)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all
                                                ${progress[i] ? 'bg-primary border-primary text-white' : 'bg-surface border-border hover:bg-primary/10'}
                                            `}
                                        >
                                            {i + 1}
                                            {progress[i] && <CheckIcon className="w-5 h-5 absolute"/>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Challenges;
