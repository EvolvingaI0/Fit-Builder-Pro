
import React, { useState } from 'react';
import { UserProfile } from '../types';
import Button from './common/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';


interface OnboardingQuizProps {
  onComplete: (profile: UserProfile) => void;
}

const initialProfile: UserProfile = {
    name: '',
    age: 25,
    gender: 'male',
    height: 175,
    currentWeight: 70,
    targetWeight: 65,
    mainGoal: 'lose_weight',
    healthConditions: [],
    experienceLevel: 'beginner',
    exerciseFrequency: '1-2_per_week',
    hadStructuredProgram: false,
    trainingLocation: 'gym',
    trainingStyle: 'mixed',
    trainingDurationPreference: 'short_intense',
    equipmentAvailable: true,
    highImpactAccepted: true,
    daysPerWeek: '3-4',
    timePerSession: '40-60',
    preferredTime: 'flexible',
    mealsPerDay: '3',
    cookingHabit: 'mixed',
    trackMacros: true,
    supplements: [],
    dietaryRestrictions: [],
    motivationLevel: 'medium',
    goalTimeline: 'medium_term',
    openToChallenges: true,
    extraFocus: 'fat_loss',
    workoutStructure: 'individual',
    visualTracking: true,
    notificationsEnabled: true,
    sleepQuality: 'good',
    stressLevel: 'low',
    budget: 'moderate',
    dislikedFoods: '',
};

type ChoiceButtonProps = {onClick: () => void, isActive: boolean, children: React.ReactNode, className?: string};

function ChoiceButton({ onClick, isActive, children, className}: ChoiceButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left p-4 border rounded-xl transition-all duration-200 text-text-primary ${isActive ? 'bg-primary text-white border-primary-focus ring-2 ring-primary' : 'bg-surface hover:bg-violet-50 hover:border-violet-300 border-border'} ${className}`}
        >
            {children}
        </button>
    );
}

type CheckboxButtonProps = {onClick: () => void, isChecked: boolean, children: React.ReactNode};

function CheckboxButton({ onClick, isChecked, children }: CheckboxButtonProps) {
    return (
        <label className={`flex items-center w-full text-left p-4 border rounded-xl transition-all duration-200 text-text-primary cursor-pointer ${isChecked ? 'bg-primary/10 border-primary' : 'bg-surface hover:bg-violet-50 hover:border-violet-300 border-border'}`}>
            <input type="checkbox" checked={isChecked} onChange={onClick} className="h-5 w-5 rounded text-primary focus:ring-primary border-gray-300" />
            <span className="ml-3 font-medium">{children}</span>
        </label>
    );
}


function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [error, setError] = useState('');
  const totalSteps = 10;

  const setProfileValue = <K extends keyof UserProfile>(name: K, value: UserProfile[K]) => {
      setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMultiSelect = (field: keyof UserProfile, value: string) => {
    const currentValues = (profile[field] as string[]) || [];
    const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
    setProfileValue(field, newValues as any);
  };

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const validateAndProceed = () => {
    // Validação pode ser adicionada aqui por etapa se necessário
    setError('');
    if (step === 2 && profile.name.trim().length < 2) {
        setError('Por favor, insira um nome válido.');
        return;
    }
    handleNext();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name.trim().length < 2) {
        setError('Por favor, insira um nome válido.');
        setStep(2);
        return;
    }
    onComplete(profile);
  };
  
  const renderStep = () => {
    const inputClasses = "w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-colors";
    const labelClasses = "block mb-2 font-semibold text-text-primary";
    const headerClasses = "text-3xl font-bold mb-2 text-text-primary";
    const subheaderClasses = "text-text-secondary mb-8";

    switch (step) {
      case 1: return (<div>
          <h2 className={headerClasses}>Qual é seu principal objetivo?</h2>
          <p className={subheaderClasses}>Isso nos ajuda a focar no que é mais importante para você.</p>
          <div className="space-y-3">
              <ChoiceButton onClick={() => setProfileValue('mainGoal', 'lose_weight')} isActive={profile.mainGoal === 'lose_weight'}>Emagrecimento</ChoiceButton>
              <ChoiceButton onClick={() => setProfileValue('mainGoal', 'gain_muscle')} isActive={profile.mainGoal === 'gain_muscle'}>Ganho de massa muscular</ChoiceButton>
              <ChoiceButton onClick={() => setProfileValue('mainGoal', 'maintain_fitness')} isActive={profile.mainGoal === 'maintain_fitness'}>Manutenção de peso</ChoiceButton>
              <ChoiceButton onClick={() => setProfileValue('mainGoal', 'improve_conditioning')} isActive={profile.mainGoal === 'improve_conditioning'}>Melhora de condicionamento físico</ChoiceButton>
              <ChoiceButton onClick={() => setProfileValue('mainGoal', 'other')} isActive={profile.mainGoal === 'other'}>Outro</ChoiceButton>
              {profile.mainGoal === 'other' && <input type="text" value={profile.otherGoal} onChange={(e) => setProfileValue('otherGoal', e.target.value)} className={inputClasses + ' mt-3'} placeholder="Descreva seu outro objetivo" />}
          </div>
      </div>);
      case 2: return (<div>
        <h2 className={headerClasses}>Dados Pessoais</h2>
        <p className={subheaderClasses}>Informações básicas para personalizar seus planos.</p>
        <div className="space-y-6">
          <div><label className={labelClasses}>Seu nome</label><input type="text" value={profile.name} onChange={(e) => setProfileValue('name', e.target.value)} className={inputClasses} placeholder="Seu Nome" required /></div>
          <div><label className={labelClasses}>Idade</label><input type="number" value={profile.age} onChange={(e) => setProfileValue('age', Number(e.target.value))} className={inputClasses} /></div>
          <div><label className={labelClasses}>Sexo</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('gender', 'male')} isActive={profile.gender === 'male'}>Masculino</ChoiceButton><ChoiceButton onClick={() => setProfileValue('gender', 'female')} isActive={profile.gender === 'female'}>Feminino</ChoiceButton><ChoiceButton onClick={() => setProfileValue('gender', 'other')} isActive={profile.gender === 'other'}>Prefiro não informar</ChoiceButton></div></div>
          <div><label className={labelClasses}>Altura (cm)</label><input type="number" value={profile.height} onChange={(e) => setProfileValue('height', Number(e.target.value))} className={inputClasses} /></div>
          <div><label className={labelClasses}>Peso Atual (kg)</label><input type="number" value={profile.currentWeight} onChange={(e) => setProfileValue('currentWeight', Number(e.target.value))} className={inputClasses} /></div>
          <div><label className={labelClasses}>Peso Alvo (kg)</label><input type="number" value={profile.targetWeight} onChange={(e) => setProfileValue('targetWeight', Number(e.target.value))} className={inputClasses} /></div>
        </div>
      </div>);
      case 3: return (<div>
          <h2 className={headerClasses}>Saúde e Condições Médicas</h2>
          <p className={subheaderClasses}>Marque tudo que se aplica a você. Isso é crucial para sua segurança.</p>
          <div className="space-y-3">
              {['Diabetes', 'Hipertensão', 'Problemas cardíacos', 'Problemas nos joelhos', 'Lesões na coluna', 'Asma', 'Problemas nos ombros', 'Osteoporose', 'Problemas digestivos', 'Alergias alimentares'].map(item => (
                  <CheckboxButton key={item} isChecked={profile.healthConditions.includes(item)} onClick={() => handleMultiSelect('healthConditions', item)}>{item}</CheckboxButton>
              ))}
              <input type="text" value={profile.otherHealthConditions} onChange={(e) => setProfileValue('otherHealthConditions', e.target.value)} className={inputClasses} placeholder="Outras condições..."/>
          </div>
      </div>);
       case 4: return (<div>
          <h2 className={headerClasses}>Experiência Física</h2>
          <p className={subheaderClasses}>Como é sua rotina de exercícios?</p>
          <div className="space-y-6">
              <div><label className={labelClasses}>Seu nível de experiência</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('experienceLevel', 'beginner')} isActive={profile.experienceLevel === 'beginner'}>Iniciante</ChoiceButton><ChoiceButton onClick={() => setProfileValue('experienceLevel', 'intermediate')} isActive={profile.experienceLevel === 'intermediate'}>Intermediário</ChoiceButton><ChoiceButton onClick={() => setProfileValue('experienceLevel', 'advanced')} isActive={profile.experienceLevel === 'advanced'}>Avançado</ChoiceButton></div></div>
              <div><label className={labelClasses}>Frequência atual de exercícios</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('exerciseFrequency', 'none')} isActive={profile.exerciseFrequency === 'none'}>Nenhuma</ChoiceButton><ChoiceButton onClick={() => setProfileValue('exerciseFrequency', '1-2_per_week')} isActive={profile.exerciseFrequency === '1-2_per_week'}>1-2x por semana</ChoiceButton><ChoiceButton onClick={() => setProfileValue('exerciseFrequency', '3-4_per_week')} isActive={profile.exerciseFrequency === '3-4_per_week'}>3-4x por semana</ChoiceButton><ChoiceButton onClick={() => setProfileValue('exerciseFrequency', '5+_per_week')} isActive={profile.exerciseFrequency === '5+_per_week'}>5x ou mais</ChoiceButton></div></div>
              <div><label className={labelClasses}>Já fez algum programa de treino estruturado antes?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('hadStructuredProgram', true)} isActive={profile.hadStructuredProgram}>Sim</ChoiceButton><ChoiceButton onClick={() => setProfileValue('hadStructuredProgram', false)} isActive={!profile.hadStructuredProgram}>Não</ChoiceButton></div></div>
          </div>
      </div>);
      case 5: return (<div>
        <h2 className={headerClasses}>Preferências de Treino</h2>
        <p className={subheaderClasses}>Como você gosta de se exercitar?</p>
        <div className="space-y-6">
          <div><label className={labelClasses}>Onde prefere treinar?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('trainingLocation', 'home')} isActive={profile.trainingLocation === 'home'}>Casa</ChoiceButton><ChoiceButton onClick={() => setProfileValue('trainingLocation', 'gym')} isActive={profile.trainingLocation === 'gym'}>Academia</ChoiceButton><ChoiceButton onClick={() => setProfileValue('trainingLocation', 'outdoors')} isActive={profile.trainingLocation === 'outdoors'}>Ao ar livre</ChoiceButton></div></div>
          <div><label className={labelClasses}>Que tipo de treino gosta mais?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('trainingStyle', 'strength')} isActive={profile.trainingStyle === 'strength'}>Musculação / força</ChoiceButton><ChoiceButton onClick={() => setProfileValue('trainingStyle', 'cardio')} isActive={profile.trainingStyle === 'cardio'}>Cardio / corrida / HIIT</ChoiceButton><ChoiceButton onClick={() => setProfileValue('trainingStyle', 'stretching')} isActive={profile.trainingStyle === 'stretching'}>Alongamento</ChoiceButton><ChoiceButton onClick={() => setProfileValue('trainingStyle', 'yoga_pilates')} isActive={profile.trainingStyle === 'yoga_pilates'}>Yoga / Pilates</ChoiceButton><ChoiceButton onClick={() => setProfileValue('trainingStyle', 'mixed')} isActive={profile.trainingStyle === 'mixed'}>Mistos</ChoiceButton></div></div>
          <div><label className={labelClasses}>Prefere treinos curtos e intensos ou mais longos e leves?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('trainingDurationPreference', 'short_intense')} isActive={profile.trainingDurationPreference === 'short_intense'}>Curtos e intensos</ChoiceButton><ChoiceButton onClick={() => setProfileValue('trainingDurationPreference', 'long_light')} isActive={profile.trainingDurationPreference === 'long_light'}>Longos e leves</ChoiceButton></div></div>
          <div><label className={labelClasses}>Quer treinar com equipamentos?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('equipmentAvailable', true)} isActive={profile.equipmentAvailable}>Sim</ChoiceButton><ChoiceButton onClick={() => setProfileValue('equipmentAvailable', false)} isActive={!profile.equipmentAvailable}>Não</ChoiceButton></div></div>
          <div><label className={labelClasses}>Aceita exercícios de alto impacto?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('highImpactAccepted', true)} isActive={profile.highImpactAccepted}>Sim</ChoiceButton><ChoiceButton onClick={() => setProfileValue('highImpactAccepted', false)} isActive={!profile.highImpactAccepted}>Não</ChoiceButton></div></div>
        </div>
      </div>);
       case 6: return (<div>
        <h2 className={headerClasses}>Sua Disponibilidade</h2>
        <p className={subheaderClasses}>Vamos encaixar o treino na sua rotina.</p>
        <div className="space-y-6">
          <div><label className={labelClasses}>Quantos dias por semana você pode treinar?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('daysPerWeek', '1-2')} isActive={profile.daysPerWeek === '1-2'}>1-2</ChoiceButton><ChoiceButton onClick={() => setProfileValue('daysPerWeek', '3-4')} isActive={profile.daysPerWeek === '3-4'}>3-4</ChoiceButton><ChoiceButton onClick={() => setProfileValue('daysPerWeek', '5-6')} isActive={profile.daysPerWeek === '5-6'}>5-6</ChoiceButton><ChoiceButton onClick={() => setProfileValue('daysPerWeek', 'every_day')} isActive={profile.daysPerWeek === 'every_day'}>Todos os dias</ChoiceButton></div></div>
          <div><label className={labelClasses}>Quanto tempo por dia você pode dedicar ao treino?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('timePerSession', 'under_20')} isActive={profile.timePerSession === 'under_20'}>Menos de 20 min</ChoiceButton><ChoiceButton onClick={() => setProfileValue('timePerSession', '20-40')} isActive={profile.timePerSession === '20-40'}>20-40 min</ChoiceButton><ChoiceButton onClick={() => setProfileValue('timePerSession', '40-60')} isActive={profile.timePerSession === '40-60'}>40-60 min</ChoiceButton><ChoiceButton onClick={() => setProfileValue('timePerSession', 'over_60')} isActive={profile.timePerSession === 'over_60'}>Mais de 60 min</ChoiceButton></div></div>
          <div><label className={labelClasses}>Qual horário prefere treinar?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('preferredTime', 'morning')} isActive={profile.preferredTime === 'morning'}>Manhã</ChoiceButton><ChoiceButton onClick={() => setProfileValue('preferredTime', 'afternoon')} isActive={profile.preferredTime === 'afternoon'}>Tarde</ChoiceButton><ChoiceButton onClick={() => setProfileValue('preferredTime', 'night')} isActive={profile.preferredTime === 'night'}>Noite</ChoiceButton><ChoiceButton onClick={() => setProfileValue('preferredTime', 'flexible')} isActive={profile.preferredTime === 'flexible'}>Flexível</ChoiceButton></div></div>
        </div>
      </div>);
      case 7: return (<div>
        <h2 className={headerClasses}>Nutrição e Hábitos Alimentares</h2>
        <p className={subheaderClasses}>Conte-nos sobre sua alimentação.</p>
        <div className="space-y-6">
          <div><label className={labelClasses}>Quantas refeições faz por dia?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('mealsPerDay', '1-2')} isActive={profile.mealsPerDay === '1-2'}>1-2</ChoiceButton><ChoiceButton onClick={() => setProfileValue('mealsPerDay', '3')} isActive={profile.mealsPerDay === '3'}>3</ChoiceButton><ChoiceButton onClick={() => setProfileValue('mealsPerDay', '4-5')} isActive={profile.mealsPerDay === '4-5'}>4-5</ChoiceButton><ChoiceButton onClick={() => setProfileValue('mealsPerDay', '5+')} isActive={profile.mealsPerDay === '5+'}>Mais de 5</ChoiceButton></div></div>
          <div><label className={labelClasses}>Costuma comer fora ou preparar comida em casa?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('cookingHabit', 'mostly_out')} isActive={profile.cookingHabit === 'mostly_out'}>Principalmente fora</ChoiceButton><ChoiceButton onClick={() => setProfileValue('cookingHabit', 'mostly_home')} isActive={profile.cookingHabit === 'mostly_home'}>Principalmente em casa</ChoiceButton><ChoiceButton onClick={() => setProfileValue('cookingHabit', 'mixed')} isActive={profile.cookingHabit === 'mixed'}>Misturado</ChoiceButton></div></div>
          <div><label className={labelClasses}>Quer acompanhamento de calorias/macros?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('trackMacros', true)} isActive={profile.trackMacros}>Sim</ChoiceButton><ChoiceButton onClick={() => setProfileValue('trackMacros', false)} isActive={!profile.trackMacros}>Não</ChoiceButton></div></div>
          <div><label className={labelClasses}>Consome suplementos atualmente?</label><div className="space-y-3"><CheckboxButton isChecked={profile.supplements.includes('Proteína')} onClick={() => handleMultiSelect('supplements', 'Proteína')}>Proteína</CheckboxButton><CheckboxButton isChecked={profile.supplements.includes('Vitaminas')} onClick={() => handleMultiSelect('supplements', 'Vitaminas')}>Vitaminas</CheckboxButton><input type="text" value={profile.otherSupplements} onChange={(e) => setProfileValue('otherSupplements', e.target.value)} className={inputClasses} placeholder="Outros suplementos..."/></div></div>
          <div><label className={labelClasses}>Tem restrições alimentares ou preferências?</label><div className="space-y-3"><CheckboxButton isChecked={profile.dietaryRestrictions.includes('vegetarian')} onClick={() => handleMultiSelect('dietaryRestrictions', 'vegetarian')}>Vegetariano</CheckboxButton><CheckboxButton isChecked={profile.dietaryRestrictions.includes('vegan')} onClick={() => handleMultiSelect('dietaryRestrictions', 'vegan')}>Vegano</ChoiceButton><CheckboxButton isChecked={profile.dietaryRestrictions.includes('gluten_free')} onClick={() => handleMultiSelect('dietaryRestrictions', 'gluten_free')}>Sem glúten</ChoiceButton><CheckboxButton isChecked={profile.dietaryRestrictions.includes('lactose_free')} onClick={() => handleMultiSelect('dietaryRestrictions', 'lactose_free')}>Sem lactose</CheckboxButton><input type="text" value={profile.otherDietaryRestrictions} onChange={(e) => setProfileValue('otherDietaryRestrictions', e.target.value)} className={inputClasses} placeholder="Outras restrições..."/></div></div>
          <div><label className={labelClasses}>Alimentos que você não gosta?</label><textarea value={profile.dislikedFoods} onChange={(e) => setProfileValue('dislikedFoods', e.target.value)} className={inputClasses + ' h-24'} placeholder="Ex: coentro, brócolis..."/></div>
        </div>
      </div>);
      case 8: return (<div>
        <h2 className={headerClasses}>Motivação e Metas</h2>
        <p className={subheaderClasses}>O que te impulsiona?</p>
        <div className="space-y-6">
          <div><label className={labelClasses}>Qual é o seu nível de motivação para mudar hábitos?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('motivationLevel', 'low')} isActive={profile.motivationLevel === 'low'}>Baixo</ChoiceButton><ChoiceButton onClick={() => setProfileValue('motivationLevel', 'medium')} isActive={profile.motivationLevel === 'medium'}>Médio</ChoiceButton><ChoiceButton onClick={() => setProfileValue('motivationLevel', 'high')} isActive={profile.motivationLevel === 'high'}>Alto</ChoiceButton></div></div>
          <div><label className={labelClasses}>Em qual prazo quer atingir seu objetivo?</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('goalTimeline', 'short_term')} isActive={profile.goalTimeline === 'short_term'}>Curto prazo (1-3 meses)</ChoiceButton><ChoiceButton onClick={() => setProfileValue('goalTimeline', 'medium_term')} isActive={profile.goalTimeline === 'medium_term'}>Médio prazo (3-6 meses)</ChoiceButton><ChoiceButton onClick={() => setProfileValue('goalTimeline', 'long_term')} isActive={profile.goalTimeline === 'long_term'}>Longo prazo (6+ meses)</ChoiceButton></div></div>
          <div><label className={labelClasses}>Está aberto a desafios extras semanais?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('openToChallenges', true)} isActive={profile.openToChallenges}>Sim</ChoiceButton><ChoiceButton onClick={() => setProfileValue('openToChallenges', false)} isActive={!profile.openToChallenges}>Não</ChoiceButton></div></div>
        </div>
      </div>);
       case 9: return (<div>
        <h2 className={headerClasses}>Preferências Extras</h2>
        <p className={subheaderClasses}>Ajustes finais para o plano perfeito.</p>
        <div className="space-y-6">
          <div><label className={labelClasses}>Quer foco em:</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('extraFocus', 'strength')} isActive={profile.extraFocus === 'strength'}>Força</ChoiceButton><ChoiceButton onClick={() => setProfileValue('extraFocus', 'endurance')} isActive={profile.extraFocus === 'endurance'}>Resistência</ChoiceButton><ChoiceButton onClick={() => setProfileValue('extraFocus', 'fat_loss')} isActive={profile.extraFocus === 'fat_loss'}>Emagrecimento</ChoiceButton><ChoiceButton onClick={() => setProfileValue('extraFocus', 'specific_performance')} isActive={profile.extraFocus === 'specific_performance'}>Performance Específica</ChoiceButton></div></div>
          <div><label className={labelClasses}>Prefere treinos individuais ou circuitos combinados?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('workoutStructure', 'individual')} isActive={profile.workoutStructure === 'individual'}>Individuais</ChoiceButton><ChoiceButton onClick={() => setProfileValue('workoutStructure', 'circuits')} isActive={profile.workoutStructure === 'circuits'}>Circuitos</ChoiceButton></div></div>
          <div><label className={labelClasses}>Quer acompanhamento visual (fotos de progresso, etc)?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('visualTracking', true)} isActive={profile.visualTracking}>Sim</ChoiceButton><ChoiceButton onClick={() => setProfileValue('visualTracking', false)} isActive={!profile.visualTracking}>Não</ChoiceButton></div></div>
          <div><label className={labelClasses}>Deseja receber notificações e lembretes?</label><div className="flex gap-4"><ChoiceButton onClick={() => setProfileValue('notificationsEnabled', true)} isActive={profile.notificationsEnabled}>Sim</ChoiceButton><ChoiceButton onClick={() => setProfileValue('notificationsEnabled', false)} isActive={!profile.notificationsEnabled}>Não</ChoiceButton></div></div>
        </div>
      </div>);
       case 10: return (<div>
          <h2 className={headerClasses}>Estilo de Vida</h2>
          <p className={subheaderClasses}>Para finalizar, algumas perguntas sobre seus hábitos.</p>
          <div className="space-y-6">
              <div><label className={labelClasses}>Qualidade do seu sono</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('sleepQuality', 'poor')} isActive={profile.sleepQuality === 'poor'}>Ruim</ChoiceButton><ChoiceButton onClick={() => setProfileValue('sleepQuality', 'average')} isActive={profile.sleepQuality === 'average'}>Média</ChoiceButton><ChoiceButton onClick={() => setProfileValue('sleepQuality', 'good')} isActive={profile.sleepQuality === 'good'}>Boa</ChoiceButton></div></div>
              <div><label className={labelClasses}>Nível de estresse diário</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('stressLevel', 'low')} isActive={profile.stressLevel === 'low'}>Baixo</ChoiceButton><ChoiceButton onClick={() => setProfileValue('stressLevel', 'medium')} isActive={profile.stressLevel === 'medium'}>Médio</ChoiceButton><ChoiceButton onClick={() => setProfileValue('stressLevel', 'high')} isActive={profile.stressLevel === 'high'}>Alto</ChoiceButton></div></div>
              <div><label className={labelClasses}>Orçamento para alimentação</label><div className="space-y-3"><ChoiceButton onClick={() => setProfileValue('budget', 'economic')} isActive={profile.budget === 'economic'}>Econômico</ChoiceButton><ChoiceButton onClick={() => setProfileValue('budget', 'moderate')} isActive={profile.budget === 'moderate'}>Moderado</ChoiceButton><ChoiceButton onClick={() => setProfileValue('budget', 'flexible')} isActive={profile.budget === 'flexible'}>Flexível</ChoiceButton></div></div>
          </div>
      </div>);
      default: return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
         <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-primary">Pergunta {step} de {totalSteps}</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>
        </div>
        <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm animate-fadeIn">
            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-500 mb-4 font-semibold text-center">{error}</p>}
              {renderStep()}
              <div className="mt-10 flex justify-between items-center border-t border-border pt-6">
                <Button type="button" variant="secondary" onClick={handleBack} disabled={step === 1} className="flex items-center gap-2">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Voltar
                </Button>
                {step < totalSteps ? (
                  <Button type="button" onClick={validateAndProceed}>Continuar</Button>
                ) : (
                  <Button type="submit">Finalizar e Criar Plano</Button>
                )}
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuiz;
