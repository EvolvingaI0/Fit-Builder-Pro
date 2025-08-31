
import React, { useState, useRef } from 'react';
import { MealAnalysis } from '../types';
import { analyzeMealImage } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { CameraIcon, FireIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { CubeIcon, ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';


type MacroInfoProps = {
    label: string;
    value: number;
    unit: string;
    color: string;
};

function MacroInfo({ label, value, unit, color }: MacroInfoProps) {
    return (
        <div className={`flex-1 p-4 rounded-lg bg-background text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-sm font-semibold text-text-secondary">{label} ({unit})</p>
        </div>
    );
}

function FoodScanner() {
  const { currentUser } = useAuth();
  const userProfile = currentUser?.profile;
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = (reader.result as string).split(',')[1];
      resolve(result);
    };
    reader.onerror = error => reject(error);
  });


  const handleAnalyze = async () => {
    if (!imageFile || !userProfile) return;
    setIsLoading(true);
    setError(null);
    try {
      const base64Image = await toBase64(imageFile);
      const result = await analyzeMealImage(base64Image, imageFile.type, userProfile);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(`Falha ao analisar a refeição: ${errorMessage}. A imagem pode não estar nítida ou ocorreu um erro na API. Por favor, tente novamente.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setImage(null);
    setImageFile(null);
    setAnalysis(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const getRecommendationStyle = () => {
    if (!analysis) return { bg: 'bg-background', text: 'text-text-primary', border: 'border-border' };
    const recommendationText = analysis.recommendation.toLowerCase();
    if (recommendationText.includes('recomendada')) {
        return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' };
    }
    if (recommendationText.includes('aceitável com moderação')) {
        return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    }
    if (recommendationText.includes('não recomendada')) {
        return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' };
    }
    return { bg: 'bg-background', text: 'text-text-primary', border: 'border-border' };
  };
  const recommendationStyle = getRecommendationStyle();


  if (!userProfile) {
    return <Card>Carregando perfil do usuário...</Card>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Scanner de Alimentos</h1>
        <p className="text-text-secondary mt-1">Nossa IA analisa sua refeição e dá um feedback instantâneo!</p>
      </div>
      <Card>
        {!image && (
          <div className="text-center p-8 border-2 border-dashed border-border rounded-lg bg-background hover:border-primary transition-colors">
            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
              <CameraIcon className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-text-primary">Analise Sua Refeição</h2>
            <p className="text-text-secondary mb-6">Envie ou tire uma foto da sua comida para obter uma análise nutricional.</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
              id="file-upload"
            />
            <Button onClick={() => fileInputRef.current?.click()} className="px-6 py-3">
               <ArrowUpTrayIcon className="w-5 h-5 mr-2"/> Enviar Imagem
            </Button>
          </div>
        )}

        {image && (
          <div className="space-y-6">
            <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-lg shadow-lg border border-border">
              <img src={image} alt="Refeição" className="w-full h-auto" />
              {isLoading && (
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                    <div className="absolute top-0 w-12 h-full bg-white/30 -skew-x-12 animate-scan"></div>
                    <Spinner/>
                    <p className="mt-4 text-white font-semibold animate-pulse">Analisando...</p>
                  </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
                <Button onClick={handleAnalyze} isLoading={isLoading} disabled={isLoading} className="px-6 py-3">
                  <CpuChipIcon className="w-5 h-5 mr-2"/> Analisar Refeição
                </Button>
                <Button onClick={handleReset} variant="secondary" disabled={isLoading} className="px-6 py-3">
                  <ArrowPathIcon className="w-5 h-5 mr-2"/> Nova Imagem
                </Button>
            </div>
          </div>
        )}

        {error && <p className="mt-6 text-center text-red-500 font-semibold p-4 bg-red-50 rounded-lg">{error}</p>}

        {analysis && !isLoading && (
          <div className="mt-8 pt-6 border-t border-border animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">Análise da FitBuilder Pro</h2>
            <Card className="bg-background">
                <h3 className="font-bold text-lg text-text-primary mb-3">Alimentos Identificados:</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    {analysis.foodItems.map(item => <span key={item} className="bg-secondary/50 text-secondary-content text-sm font-semibold px-3 py-1 rounded-full">{item}</span>)}
                </div>

                <h3 className="font-bold text-lg text-text-primary mb-3">Estimativa Nutricional:</h3>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                     <MacroInfo label="Calorias" value={analysis.calories} unit="kcal" color="text-primary"/>
                     <MacroInfo label="Proteínas" value={analysis.protein} unit="g" color="text-blue-500"/>
                     <MacroInfo label="Carbos" value={analysis.carbs} unit="g" color="text-amber-500"/>
                     <MacroInfo label="Gorduras" value={analysis.fats} unit="g" color="text-red-500"/>
                </div>

                <h3 className="font-bold text-lg text-text-primary mb-3">Recomendação Personalizada:</h3>
                <div className={`p-4 rounded-lg border-2 ${recommendationStyle.bg} ${recommendationStyle.border}`}>
                    <p className={`${recommendationStyle.text}`}>{analysis.recommendation}</p>
                </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FoodScanner;
