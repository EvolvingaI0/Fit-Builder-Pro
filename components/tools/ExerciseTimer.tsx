
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { PlayIcon, PauseIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface TimerProps {
    userProfile: UserProfile;
}

function ExerciseTimer(_props: TimerProps) {
    const [initialTime, setInitialTime] = useState(0);
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    
    const [isTabata, setIsTabata] = useState(false);
    const [tabataState, setTabataState] = useState<'work' | 'rest' | 'prepare'>('prepare');
    const [round, setRound] = useState(1);
    const totalRounds = 8;

    const intervalRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if ('Audio' in window) {
            audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3'); 
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Error playing sound:", e));
        }
    };
    
    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setTime(prev => {
                    if (prev <= 1) {
                        playSound();
                        if (isTabata) {
                            handleTabataTransition();
                        } else {
                            handleReset();
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, isTabata, tabataState, round]);

    const handleTabataTransition = () => {
        if (tabataState === 'prepare') {
            setTabataState('work');
            setTime(20);
            setInitialTime(20);
        } else if (tabataState === 'work') {
            setTabataState('rest');
            setTime(10);
            setInitialTime(10);
        } else if (tabataState === 'rest') {
            if (round < totalRounds) {
                setRound(r => r + 1);
                setTabataState('work');
                setTime(20);
                setInitialTime(20);
            } else {
                handleReset();
            }
        }
    };

    const handleStartPause = () => setIsActive(!isActive);

    const handleReset = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsActive(false);
        setIsTabata(false);
        setTime(0);
        setInitialTime(0);
        setRound(1);
        setTabataState('prepare');
    };
    
    const setCustomTime = (seconds: number) => {
        handleReset();
        setTime(seconds);
        setInitialTime(seconds);
    }
    
    const startTabata = () => {
        handleReset();
        setIsTabata(true);
        setTabataState('prepare');
        setTime(10);
        setInitialTime(10);
        setIsActive(true);
    }
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progress = initialTime > 0 ? (time / initialTime) * 100 : 0;
    const strokeDashoffset = 283 * (1 - progress / 100);

    const getTabataStyling = () => {
        if(tabataState === 'work') return { color: 'text-red-500', bg: 'bg-red-500/10' };
        if(tabataState === 'rest') return { color: 'text-green-500', bg: 'bg-green-500/10' };
        return { color: 'text-primary', bg: 'bg-primary/10' };
    }
    const tabataStyling = getTabataStyling();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">Cronômetro de Exercícios</h1>
            <Card className={isTabata ? `transition-colors ${tabataStyling.bg}` : ''}>
                <div className="flex flex-col items-center justify-center">
                     <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                         <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                             <circle className="text-border" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                             <circle 
                                className={`transform -rotate-90 origin-center transition-all duration-500 ${isTabata ? tabataStyling.color : 'text-primary'}`} 
                                strokeWidth="7" 
                                strokeDasharray="283" 
                                strokeDashoffset={strokeDashoffset} 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="45" 
                                cx="50" 
                                cy="50" 
                             />
                         </svg>
                         <div className="absolute flex flex-col items-center justify-center w-full h-full">
                            {isTabata && (
                                <div className="text-center">
                                    <p className={`text-2xl sm:text-3xl font-bold uppercase ${tabataStyling.color}`}>
                                        {tabataState === 'prepare' && 'Prepare-se'}
                                        {tabataState === 'work' && 'Treino!'}
                                        {tabataState === 'rest' && 'Descanso'}
                                    </p>
                                    <p className="text-text-secondary font-semibold text-sm sm:text-base">Round {round}/{totalRounds}</p>
                                </div>
                            )}
                            <p className="text-5xl sm:text-6xl font-mono font-bold text-text-primary mt-2">{formatTime(time)}</p>
                         </div>
                     </div>
                     <div className="flex justify-center items-center space-x-4 mt-8">
                        <Button onClick={handleStartPause} disabled={initialTime === 0} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full !p-0">
                            {isActive ? <PauseIcon className="w-8 h-8 sm:w-10 sm:h-10"/> : <PlayIcon className="w-8 h-8 sm:w-10 sm:h-10"/>}
                        </Button>
                        <Button onClick={handleReset} variant="secondary" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full !p-0">
                            <ArrowPathIcon className="w-8 h-8 sm:w-10 sm:h-10"/>
                        </Button>
                    </div>
                </div>
            </Card>
            <Card>
                <h2 className="text-xl font-bold text-text-primary mb-4">Presets</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="secondary" onClick={() => setCustomTime(30)}>30 Seg</Button>
                    <Button variant="secondary" onClick={() => setCustomTime(60)}>1 Min</Button>
                    <Button variant="secondary" onClick={() => setCustomTime(180)}>3 Min</Button>
                    <Button variant="secondary" onClick={() => setCustomTime(300)}>5 Min</Button>
                </div>
                 <div className="mt-6 pt-6 border-t border-border">
                     <h3 className="text-lg font-bold text-text-primary mb-2">Treino Tabata</h3>
                     <p className="text-text-secondary mb-4 text-sm">8 rounds de 20 segundos de treino intenso e 10 segundos de descanso.</p>
                     <Button onClick={startTabata}>Iniciar Tabata</Button>
                 </div>
            </Card>
        </div>
    );
};

export default ExerciseTimer;
