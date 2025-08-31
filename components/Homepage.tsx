
import React, { useEffect, useRef } from 'react';
import Logo from './common/Logo';
import Button from './common/Button';
import { FireIcon, BookOpenIcon, CameraIcon, ChartBarIcon, CpuChipIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

interface HomepageProps {
    onNavigateToLogin: () => void;
    onNavigateToSignUp: () => void;
}

type FeatureCardProps = {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
};

function FeatureCard({ icon: Icon, title, children }: FeatureCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-scroll');
                    entry.target.classList.remove('opacity-0');
                }
            },
            {
                threshold: 0.1,
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className="bg-surface p-8 rounded-2xl shadow-lg border border-border opacity-0 transition-all duration-700">
            <div className="bg-primary/10 text-primary rounded-xl p-3 inline-block mb-4">
                <Icon className="w-8 h-8"/>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">{title}</h3>
            <p className="text-text-secondary">{children}</p>
        </div>
    );
};


function Homepage({ onNavigateToLogin, onNavigateToSignUp }: HomepageProps) {
    return (
        <div className="bg-background">
            <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Logo className="w-10 h-10 text-primary" />
                        <span className="text-2xl font-bold text-text-primary">FitBuilder Pro</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Button onClick={onNavigateToLogin} variant="secondary">Login</Button>
                        <Button onClick={onNavigateToSignUp}>Criar Conta</Button>
                    </div>
                </nav>
            </header>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="text-center py-20 md:py-32 px-6">
                    <div className="container mx-auto">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary leading-tight">
                           Parabéns e bem-vindo(a) ao <br className="hidden md:block"/>
                           <span className="text-primary">FitBuilder Pro!</span>
                        </h1>
                        <p className="max-w-2xl mx-auto mt-6 text-lg text-text-secondary">
                            Você deu o passo mais importante para uma transformação real e duradoura. Estamos aqui para fornecer as ferramentas e a inteligência que você precisa para alcançar seus objetivos.
                        </p>
                        <div className="mt-10 flex flex-col items-center">
                            <Button onClick={onNavigateToSignUp} className="py-4 px-10 text-xl">Criar Minha Conta e Começar</Button>
                             <p className="mt-4 text-sm text-text-secondary">
                                Já criou sua conta? <span onClick={onNavigateToLogin} className="font-semibold text-primary cursor-pointer hover:underline">Faça login aqui.</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-surface">
                    <div className="container mx-auto px-6">
                         <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-text-primary">O que você desbloqueou com sua compra</h2>
                            <p className="max-w-xl mx-auto mt-4 text-text-secondary">Explore os benefícios da sua nova plataforma de fitness inteligente.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard icon={CpuChipIcon} title="Seus Planos com IA">
                                Seus planos de treino e dieta personalizados, gerados pela nossa inteligência artificial para maximizar seus resultados.
                            </FeatureCard>
                             <FeatureCard icon={FireIcon} title="Sua Rotina de Treinos">
                                Sua rotina de treinos estruturada com os melhores exercícios para o seu objetivo, seja perder peso ou ganhar massa muscular.
                            </FeatureCard>
                             <FeatureCard icon={BookOpenIcon} title="Sua Nutrição Sob Medida">
                                Sua dieta balanceada que considera suas preferências e restrições alimentares, tornando a alimentação saudável fácil e deliciosa.
                            </FeatureCard>
                             <FeatureCard icon={CameraIcon} title="Seu Scanner de Alimentos">
                                Sua ferramenta de análise nutricional instantânea. Basta uma foto da sua refeição para ajudá-lo a se manter na linha.
                            </FeatureCard>
                            <FeatureCard icon={ChartBarIcon} title="Seu Acompanhamento de Progresso">
                                Suas ferramentas intuitivas para registrar peso, medidas e hábitos. Veja sua evolução em gráficos claros e motivadores.
                            </FeatureCard>
                             <FeatureCard icon={WrenchScrewdriverIcon} title="Suas Ferramentas Essenciais">
                                Seu kit completo de ferramentas, de calculadora de calorias a cronômetro de treinos, para apoiar sua jornada fitness.
                            </FeatureCard>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-text-primary text-primary-content/70">
                <div className="container mx-auto px-6 py-8 text-center">
                   <p>&copy; {new Date().getFullYear()} FitBuilder Pro. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
