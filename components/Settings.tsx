
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Card from './common/Card';
import Button from './common/Button';

function Settings() {
  const { currentUser, updateUser } = useAuth();
  const profile = currentUser?.profile;
  const [isSaved, setIsSaved] = useState(false);

  if (!profile) {
    return <Card>Nenhum perfil de usuário encontrado. Por favor, complete o processo de integração.</Card>;
  }

  const [editableProfile, setEditableProfile] = useState<UserProfile>(profile);
  
  const inputClasses = "w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none";
  const labelClasses = "block mb-1 font-medium text-text-secondary";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: Number(value) }));
  }
  
  const handleDietaryRestrictionChange = (restriction: 'vegetarian' | 'vegan' | 'gluten_free' | 'lactose_free') => {
    setEditableProfile(prev => {
        const currentRestrictions = prev.dietaryRestrictions || [];
        const newRestrictions = currentRestrictions.includes(restriction)
            ? currentRestrictions.filter(r => r !== restriction)
            : [...currentRestrictions, restriction];
        return { ...prev, dietaryRestrictions: newRestrictions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ ...currentUser!, profile: editableProfile });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">Configurações e Perfil</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Nome</label>
              <input type="text" name="name" value={editableProfile.name} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Idade</label>
              <input type="number" name="age" value={editableProfile.age} onChange={handleNumericChange} className={inputClasses} />
            </div>
             <div>
              <label className={labelClasses}>Gênero</label>
              <select name="gender" value={editableProfile.gender} onChange={handleChange} className={inputClasses}>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
                <label className={labelClasses}>Objetivo Principal</label>
                <select name="mainGoal" value={editableProfile.mainGoal} onChange={handleChange} className={inputClasses}>
                    <option value="lose_weight">Perder Peso</option>
                    <option value="gain_muscle">Ganhar Massa Muscular</option>
                    <option value="maintain_fitness">Manter a Forma</option>
                    <option value="improve_conditioning">Melhorar Condicionamento</option>
                    <option value="other">Outro</option>
                </select>
            </div>
            <div>
              <label className={labelClasses}>Altura (cm)</label>
              <input type="number" name="height" value={editableProfile.height} onChange={handleNumericChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Peso Atual (kg)</label>
              <input type="number" name="currentWeight" value={editableProfile.currentWeight} onChange={handleNumericChange} className={inputClasses} />
            </div>
             <div>
              <label className={labelClasses}>Peso Alvo (kg)</label>
              <input type="number" name="targetWeight" value={editableProfile.targetWeight} onChange={handleNumericChange} className={inputClasses} />
            </div>
             <div className="md:col-span-2">
                <label className={labelClasses}>Restrições/Preferências Alimentares</label>
                <div className="space-y-2 mt-2">
                    {(['vegetarian', 'vegan', 'gluten_free', 'lactose_free'] as const).map(item => (
                        <label key={item} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={editableProfile.dietaryRestrictions.includes(item)}
                                onChange={() => handleDietaryRestrictionChange(item)}
                                className="h-4 w-4 rounded text-primary focus:ring-primary border-gray-300"
                            />
                            <span className="ml-2 text-text-primary capitalize">{item.replace('_', ' ')}</span>
                        </label>
                    ))}
                </div>
            </div>
             <div className="md:col-span-2">
                <label className={labelClasses}>Outras Restrições Alimentares</label>
                <input
                    type="text"
                    name="otherDietaryRestrictions"
                    value={editableProfile.otherDietaryRestrictions || ''}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Ex: Alergia a amendoim"
                />
            </div>
            <div className="md:col-span-2">
                <label className={labelClasses}>Alimentos que você não gosta</label>
                <textarea name="dislikedFoods" value={editableProfile.dislikedFoods} onChange={handleChange} className={inputClasses + " h-24"} />
            </div>
          </div>
          <div className="flex items-center space-x-4 pt-4 border-t border-border">
            <Button type="submit" className="py-3 px-6">Salvar Alterações</Button>
            {isSaved && <p className="text-green-600 font-semibold animate-fadeIn">Perfil atualizado com sucesso!</p>}
          </div>
        </form>
      </Card>
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Páginas Informativas</h2>
        <div className="space-y-2 text-primary font-medium">
            <p className="hover:underline cursor-pointer">Como Funciona</p>
            <p className="hover:underline cursor-pointer">Termos de Uso</p>
            <p className="hover:underline cursor-pointer">Política de Privacidade</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
