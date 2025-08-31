
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import OnboardingQuiz from './components/OnboardingQuiz';
import Dashboard from './components/Dashboard';
import { UserProfile, FitnessPlan, DietPlan } from './types';
import { generateFitnessPlan, generateDietPlan } from './services/geminiService';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Homepage from './components/Homepage';


type GenerationScreenProps = {
    profile: UserProfile;
    onComplete: (fitnessPlan: FitnessPlan, dietPlan: DietPlan) => void;
};

function GenerationScreen({ profile, onComplete }: GenerationScreenProps) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { text: 'Analisando seus dados...' },
        { text: 'Montando seu plano de treino...' },
        { text: 'Elaborando sua dieta personalizada...' },
        { text: 'Finalizando recomendações...' }
    ];

    React.useEffect(() => {
        const generate = async () => {
            const generationPromise = Promise.all([
                generateFitnessPlan(profile),
                generateDietPlan(profile)
            ]);

            const stepDurations = [1500, 2000, 2000, 1500];

            for (let i = 0; i < steps.length; i++) {
                setCurrentStep(i);
                setProgress(0); // Reset progress for the new step
                await new Promise(res => setTimeout(res, 50));
                setProgress(100);
                await new Promise(res => setTimeout(res, stepDurations[i]));
            }

            const [fitnessPlan, dietPlan] = await generationPromise;
            
            setCurrentStep(steps.length); // Mark all as complete
            onComplete(fitnessPlan, dietPlan);
        };
        generate();
    }, [profile, onComplete]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg text-center animate-fadeIn">
                <h2 className="text-3xl font-bold text-primary mb-2">Só um momento...</h2>
                <p className="text-text-secondary mb-10">Nossa IA está criando seu plano personalizado.</p>
                <div className="space-y-6">
                    {steps.map((s, index) => (
                        <div key={index} className="transition-opacity duration-500">
                             <div className="flex items-center justify-between mb-2">
                                <p className="text-left font-semibold text-text-primary">{s.text}</p>
                                {currentStep > index && <CheckCircleIcon className="w-6 h-6 text-primary animate-scaleIn"/>}
                             </div>
                            <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="bg-primary h-2.5 rounded-full transition-all duration-[1500ms] ease-out"
                                    style={{ width: `${currentStep > index ? 100 : (currentStep === index ? progress : 0)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


function AppContent() {
    const { currentUser, updateUser, isLoading } = useAuth();
    const [view, setView] = useState<'homepage' | 'login' | 'signup'>('homepage');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleOnboardingComplete = (profile: UserProfile) => {
        setIsGenerating(true);
        updateUser({ ...currentUser!, profile });
    };

    const handleGenerationComplete = (fitnessPlan: FitnessPlan, dietPlan: DietPlan) => {
        updateUser({ ...currentUser!, fitnessPlan, dietPlan });
        setIsGenerating(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (currentUser) {
        if (!currentUser.profile) {
            return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
        }
        if (isGenerating || (!currentUser.fitnessPlan && !currentUser.dietPlan)) {
             return <GenerationScreen profile={currentUser.profile} onComplete={handleGenerationComplete} />;
        }
        return <Dashboard />;
    }

    switch (view) {
        case 'login':
            return <Login onNavigateToSignUp={() => setView('signup')} onNavigateToHome={() => setView('homepage')} />;
        case 'signup':
            return <SignUp onNavigateToLogin={() => setView('login')} onNavigateToHome={() => setView('homepage')} />;
        default:
            return <Homepage onNavigateToLogin={() => setView('login')} onNavigateToSignUp={() => setView('signup')} />;
    }
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
