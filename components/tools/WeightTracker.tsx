
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ProgressEntry, UserProfile } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { ArrowDownIcon, ArrowUpIcon, FlagIcon, ScaleIcon } from '@heroicons/react/24/solid';

interface WeightTrackerProps {
    userProfile: UserProfile;
}

type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
};

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
    return (
        <Card className="p-4">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white"/>
                </div>
                <div>
                    <p className="text-sm font-medium text-text-secondary">{title}</p>
                    <p className="text-xl font-bold text-text-primary">{value}</p>
                </div>
            </div>
        </Card>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-surface rounded-lg shadow-lg border border-border">
        <p className="font-bold text-text-primary">{label}</p>
        {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.name}: ${pld.value}${pld.unit}`}
            </p>
        ))}
      </div>
    );
  }
  return null;
};

function WeightTracker({ userProfile }: WeightTrackerProps) {
  const { currentUser } = useAuth();
  const storageKey = currentUser ? `fitBuilderProProgress_${currentUser.email}` : '';
  const [progress, setProgress] = useLocalStorage<ProgressEntry[]>(storageKey, []);
  const [newEntry, setNewEntry] = useState({
    weight: userProfile.currentWeight,
    waist: 0,
    chest: 0,
    hip: 0,
  });

  useEffect(() => {
    setNewEntry(prev => ({...prev, weight: userProfile.currentWeight}));
  }, [userProfile.currentWeight]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry({ ...newEntry, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleAddEntry = () => {
    if (newEntry.weight > 0) {
      const date = new Date().toISOString();
      const todayDateStr = date.split('T')[0];
      const updatedProgress = [...progress.filter(p => p.date.split('T')[0] !== todayDateStr), { date, ...newEntry }];
      updatedProgress.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setProgress(updatedProgress);
    }
  };

  const formattedData = progress.map(p => ({
    ...p,
    date: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}),
  }));
  
  const generateReport = () => {
    let report = `FitBuilder Pro - Relatório de Progresso para ${userProfile.name}\n`;
    report += `Gerado em: ${new Date().toLocaleDateString()}\n\n`;
    report += `Objetivo: ${userProfile.mainGoal.replace(/_/g, ' ')}\n`;
    report += `Peso Inicial: ${progress[0]?.weight || 'N/A'} kg\n`;
    report += `Peso Atual: ${progress[progress.length-1]?.weight || 'N/A'} kg\n`;
    report += `Peso Alvo: ${userProfile.targetWeight} kg\n\n`;
    report += '--- Registros ---\n';
    progress.forEach(entry => {
        report += `${new Date(entry.date).toLocaleDateString()}: Peso: ${entry.weight}kg`;
        if (entry.waist) report += `, Cintura: ${entry.waist}cm`;
        if (entry.chest) report += `, Peito: ${entry.chest}cm`;
        if (entry.hip) report += `, Quadril: ${entry.hip}cm`;
        report += '\n';
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'FitBuilderPro_Relatorio.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const inputClasses = "w-full p-2.5 rounded-lg bg-background border border-border mt-1 focus:ring-2 focus:ring-primary focus:outline-none";
  
  const initialWeight = progress.length > 0 ? progress[0].weight : userProfile.currentWeight;
  const currentWeight = progress.length > 0 ? progress[progress.length - 1].weight : userProfile.currentWeight;
  const weightChange = (currentWeight - initialWeight).toFixed(1);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">Controle de Peso e Medidas</h1>
      
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Peso Inicial" value={`${initialWeight} kg`} icon={FlagIcon} color="bg-gray-400"/>
            <StatCard title="Peso Atual" value={`${currentWeight} kg`} icon={ScaleIcon} color="bg-primary"/>
            <StatCard title="Meta de Peso" value={`${userProfile.targetWeight} kg`} icon={FlagIcon} color="bg-green-500"/>
            <StatCard 
                title="Progresso Total" 
                value={`${weightChange} kg`} 
                icon={parseFloat(weightChange) >= 0 ? ArrowUpIcon : ArrowDownIcon}
                color={parseFloat(weightChange) > 0 ? 'bg-red-500' : 'bg-blue-500'}
            />
        </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Adicionar Registro de Hoje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Peso (kg)</label>
                    <input type="number" name="weight" value={newEntry.weight} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Cintura (cm)</label>
                    <input type="number" name="waist" value={newEntry.waist} onChange={handleInputChange} className={inputClasses} />
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Peito (cm)</label>
                    <input type="number" name="chest" value={newEntry.chest} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Quadril (cm)</label>
                    <input type="number" name="hip" value={newEntry.hip} onChange={handleInputChange} className={inputClasses} />
                </div>
            </div>
        </div>
        <Button onClick={handleAddEntry} className="w-full py-3 mt-6">Adicionar Registro</Button>
      </Card>
      
      {progress.length > 1 && <>
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Evolução do Peso</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData}>
             <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6d28d9" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={['dataMin - 2', 'dataMax + 2']}/>
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="weight" stroke="#6d28d9" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" name="Peso" unit="kg"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
       <Card>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Evolução das Medidas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={['dataMin - 5', 'dataMax + 5']}/>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="waist" stroke="#f59e0b" strokeWidth={2} name="Cintura" unit="cm"/>
            <Line type="monotone" dataKey="chest" stroke="#3b82f6" strokeWidth={2} name="Peito" unit="cm"/>
            <Line type="monotone" dataKey="hip" stroke="#ef4444" strokeWidth={2} name="Quadril" unit="cm"/>
          </LineChart>
        </ResponsiveContainer>
      </Card>
      </>}

      {progress.length > 0 && 
       <Card>
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Histórico de Registros</h2>
            <div className="overflow-x-auto relative">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3 px-6">Data</th>
                            <th scope="col" className="py-3 px-6">Peso (kg)</th>
                            <th scope="col" className="py-3 px-6">Cintura (cm)</th>
                            <th scope="col" className="py-3 px-6">Peito (cm)</th>
                            <th scope="col" className="py-3 px-6">Quadril (cm)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {progress.slice().reverse().map((entry) => (
                            <tr key={entry.date} className="bg-white border-b">
                                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                                </th>
                                <td className="py-4 px-6 font-bold text-text-primary">{entry.weight}</td>
                                <td className="py-4 px-6">{entry.waist || 'N/A'}</td>
                                <td className="py-4 px-6">{entry.chest || 'N/A'}</td>
                                <td className="py-4 px-6">{entry.hip || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
       </Card>
      }

       <Card>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Exportar Relatório</h2>
        <p className="text-text-secondary mb-4">Gere um arquivo de texto com seu histórico de progresso completo.</p>
        <Button onClick={generateReport} disabled={progress.length === 0}>Baixar Relatório</Button>
       </Card>
    </div>
  );
};

export default WeightTracker;
