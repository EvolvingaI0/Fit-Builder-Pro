
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile, FitnessPlan, DietPlan, MealAnalysis } from '../types';

// A chave de API é obtida de forma segura a partir das variáveis de ambiente.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const parseJsonResponse = <T,>(text: string, schemaName: string): T => {
    try {
        // Com responseMimeType: "application/json", a propriedade 'text' da resposta é uma string JSON válida.
        return JSON.parse(text) as T;
    } catch (error) {
        console.error(`Erro ao analisar o JSON de ${schemaName} vindo do Gemini. Texto recebido:`, text, error);
        throw new Error(`A resposta da IA para ${schemaName} não estava em um formato JSON válido.`);
    }
};


const fitnessPlanSchema = {
    type: Type.OBJECT,
    properties: {
        geralDescription: {
            type: Type.STRING,
            description: "Uma descrição geral e abrangente do plano de treino, incluindo recomendações sobre aquecimento, desaquecimento, cardio, dias de descanso, hidratação, sono e dicas motivacionais. Deve ser um parágrafo bem escrito."
        },
        workouts: {
            type: Type.ARRAY,
            description: "Uma lista de planos de treino diários, com base nos dias disponíveis.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "O número do dia do treino (ex: 1)." },
                    focus: { type: Type.STRING, description: "O principal grupo muscular ou foco do dia (ex: 'Peito & Tríceps'). Manter curto e direto." },
                    exercises: {
                        type: Type.ARRAY,
                        description: "Uma lista de exercícios para o dia.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Nome do exercício." },
                                sets: { type: Type.INTEGER, description: "Número de séries." },
                                reps: { type: Type.STRING, description: "Faixa de repetições (ex: '8-12')." },
                                tip: { type: Type.STRING, description: "Uma dica curta sobre a forma correta de execução do exercício." }
                            }
                        }
                    }
                }
            }
        }
    }
};


const dietPlanSchema = {
    type: Type.OBJECT,
    properties: {
        weeklyDiet: {
            type: Type.ARRAY,
            description: "Um plano de dieta para 7 dias, de Segunda a Domingo.",
            items: {
                type: Type.OBJECT,
                properties: {
                    dayOfWeek: { type: Type.STRING, description: "O dia da semana (ex: 'Segunda-feira')." },
                    meals: {
                        type: Type.ARRAY,
                        description: "Uma lista de refeições para o dia.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Nome da refeição (ex: 'Café da Manhã')." },
                                description: { type: Type.STRING, description: "Descrição e receita da refeição." },
                                calories: { type: Type.INTEGER },
                                protein: { type: Type.INTEGER },
                                carbs: { type: Type.INTEGER },
                                fats: { type: Type.INTEGER }
                            }
                        }
                    },
                    totalCalories: { type: Type.INTEGER },
                    totalProtein: { type: Type.INTEGER },
                    totalCarbs: { type: Type.INTEGER },
                    totalFats: { type: Type.INTEGER }
                }
            }
        },
        weeklyAverage: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.INTEGER },
                protein: { type: Type.INTEGER },
                carbs: { type: Type.INTEGER },
                fats: { type: Type.INTEGER }
            }
        }
    }
};

const mealAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        foodItems: {
            type: Type.ARRAY,
            description: "Uma lista de itens alimentares identificados na imagem.",
            items: { type: Type.STRING }
        },
        calories: { type: Type.INTEGER, description: "Total de calorias estimadas." },
        protein: { type: Type.INTEGER, description: "Total de proteína estimada em gramas." },
        carbs: { type: Type.INTEGER, description: "Total de carboidratos estimados em gramas." },
        fats: { type: Type.INTEGER, description: "Total de gorduras estimadas em gramas." },
        recommendation: { type: Type.STRING, description: "Uma análise detalhada e uma recomendação clara, informando se a refeição é 'Recomendada', 'Aceitável com Moderação', ou 'Não Recomendada' para o objetivo do usuário, com uma explicação." }
    }
};


const generatePrompt = (profile: UserProfile): string => `
  ### Perfil Detalhado do Usuário para IA Fitness ###

  **Dados Pessoais:**
  - **Nome:** ${profile.name}
  - **Idade:** ${profile.age}
  - **Sexo:** ${profile.gender === 'male' ? 'Masculino' : profile.gender === 'female' ? 'Feminino' : 'Prefere não informar'}
  - **Altura:** ${profile.height} cm
  - **Peso Atual:** ${profile.currentWeight} kg
  - **Peso Alvo:** ${profile.targetWeight} kg

  **1. Objetivo Principal:**
  - **Meta:** ${profile.mainGoal === 'other' ? profile.otherGoal : profile.mainGoal.replace(/_/g, ' ')}

  **3. Saúde e Condições Médicas:**
  - **Condições Pré-existentes:** ${profile.healthConditions.length > 0 ? profile.healthConditions.join(', ') : 'Nenhuma informada'}
  - **Outras Condições:** ${profile.otherHealthConditions || 'Nenhuma'}

  **4. Experiência Física:**
  - **Nível:** ${profile.experienceLevel}
  - **Frequência Atual:** ${profile.exerciseFrequency.replace(/_/g, ' ')}
  - **Já seguiu programa estruturado?:** ${profile.hadStructuredProgram ? 'Sim' : 'Não'}

  **5. Preferências de Treino:**
  - **Local:** ${profile.trainingLocation}
  - **Estilo Favorito:** ${profile.trainingStyle.replace(/_/g, ' ')}
  - **Duração/Intensidade:** ${profile.trainingDurationPreference === 'short_intense' ? 'Curtos e intensos' : 'Longos e leves'}
  - **Usa Equipamentos?:** ${profile.equipmentAvailable ? 'Sim' : 'Não'}
  - **Aceita Alto Impacto?:** ${profile.highImpactAccepted ? 'Sim' : 'Não'}

  **6. Disponibilidade:**
  - **Dias por Semana:** ${profile.daysPerWeek}
  - **Tempo por Sessão:** ${profile.timePerSession.replace(/_/g, ' ')} minutos
  - **Horário Preferido:** ${profile.preferredTime}

  **7. Nutrição e Hábitos Alimentares:**
  - **Refeições por Dia:** ${profile.mealsPerDay}
  - **Hábito Culinário:** ${profile.cookingHabit.replace(/_/g, ' ')}
  - **Acompanhar Macros?:** ${profile.trackMacros ? 'Sim' : 'Não'}
  - **Suplementos:** ${profile.supplements.length > 0 ? profile.supplements.join(', ') : 'Nenhum'}
  - **Outros Suplementos:** ${profile.otherSupplements || 'Nenhum'}
  - **Restrições/Preferências:** ${profile.dietaryRestrictions.length > 0 ? profile.dietaryRestrictions.join(', ').replace(/_/g, ' ') : 'Nenhuma'}
  - **Outras Restrições:** ${profile.otherDietaryRestrictions || 'Nenhuma'}
  - **Alimentos não apreciados:** ${profile.dislikedFoods || 'Nenhum'}

  **8. Motivação e Metas:**
  - **Nível de Motivação:** ${profile.motivationLevel}
  - **Prazo para Meta:** ${profile.goalTimeline.replace(/_/g, ' ')}
  - **Aberto a Desafios?:** ${profile.openToChallenges ? 'Sim' : 'Não'}

  **9. Preferências Extras:**
  - **Foco Adicional:** ${profile.extraFocus.replace(/_/g, ' ')}
  - **Estrutura de Treino:** ${profile.workoutStructure}
  - **Acompanhamento Visual?:** ${profile.visualTracking ? 'Sim' : 'Não'}
  - **Deseja Notificações?:** ${profile.notificationsEnabled ? 'Sim' : 'Não'}
  
  **10. Estilo de Vida:**
  - **Qualidade do Sono:** ${profile.sleepQuality}
  - **Nível de Estresse:** ${profile.stressLevel}
  - **Orçamento para Refeições:** ${profile.budget}
`;


export const generateFitnessPlan = async (profile: UserProfile): Promise<FitnessPlan> => {
  const prompt = `
    ${generatePrompt(profile)}
    
    **Tarefa:**
    Com base neste perfil de usuário EXTREMAMENTE DETALHADO, sua tarefa é criar o plano de treino mais eficaz e personalizado possível.
    
    **Instruções Cruciais:**
    1.  **Descrição Geral:** No campo 'geralDescription', escreva um parágrafo introdutório completo. Inclua recomendações sobre aquecimento, desaquecimento, dias de descanso, importância do cardio, hidratação e sono. Seja encorajador.
    2.  **Foco do Dia:** No campo 'focus' para cada dia, seja MUITO CONCISO (ex: "Peito, Ombros e Tríceps" ou "Pernas e Glúteos"). NÃO adicione recomendações gerais aqui.
    3.  **Exercícios:** Forneça uma lista de exercícios apropriada para o nível de experiência e preferências do usuário. Para cada exercício, inclua uma dica curta e útil sobre a forma correta de execução.
    4.  **Idioma:** O plano deve ser em português do Brasil.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        systemInstruction: "Você é uma API de fitness. Sua única função é retornar um objeto JSON perfeitamente formatado, seguindo estritamente o schema fornecido. Não adicione nenhum texto, explicação ou markdown fora do JSON.",
        responseMimeType: "application/json",
        responseSchema: fitnessPlanSchema,
    },
  });

  return parseJsonResponse<FitnessPlan>(response.text, 'FitnessPlan');
};

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const prompt = `
    ${generatePrompt(profile)}
    
    **Tarefa:**
    Com base neste perfil de usuário EXTREMAMENTE DETALHADO, crie um plano alimentar SEMANAL DETALHADO, de Segunda a Domingo.
    
    **Instruções Cruciais:**
    1.  **Refeições Diárias:** Para cada dia, inclua 4 refeições: Café da Manhã, Almoço, Lanche da Tarde e Jantar.
    2.  **Receitas Práticas:** Para cada refeição, forneça uma descrição clara e sugestões de receitas práticas e saborosas que se alinhem com as preferências, restrições e, MUITO IMPORTANTE, o **orçamento** do usuário.
    3.  **Cálculos Precisos:** Calcule os totais diários de calorias e macronutrientes. Ao final, calcule e forneça as médias semanais.
    4.  **Idioma:** O plano deve ser em português do Brasil.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: dietPlanSchema,
    },
  });

  return parseJsonResponse<DietPlan>(response.text, 'DietPlan');
};

export const analyzeMealImage = async (base64Image: string, mimeType: string, profile: UserProfile): Promise<MealAnalysis> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };
  
  const goalMapping = {
    'lose_weight': 'perder peso',
    'gain_muscle': 'ganhar massa muscular',
    'maintain_fitness': 'manter a forma',
    'improve_conditioning': 'melhorar condicionamento'
  };

  const prompt = `
    Você é a "FitBuilder Pro", uma nutricionista especialista em IA. Sua tarefa é analisar a refeição na imagem para um usuário com o objetivo de '${goalMapping[profile.mainGoal] || profile.mainGoal}'.
    Siga estes passos na sua análise:
    1.  **Identificação:** Liste os alimentos que você consegue identificar no prato.
    2.  **Estimativa Nutricional:** Forneça uma estimativa para o total de calorias, proteínas, carboidratos e gorduras da refeição completa.
    3.  **Recomendação Personalizada:** Esta é a parte mais importante. Compare a refeição com o objetivo do usuário. Forneça uma recomendação clara e direta, começando com uma das três classificações: "Recomendada", "Aceitável com Moderação" ou "Não Recomendada". Em seguida, explique o porquê da sua classificação, mencionando como os macronutrientes do prato se alinham (ou não) ao objetivo. Se possível, sugira pequenas alterações que poderiam tornar a refeição melhor para o objetivo do usuário (ex: "Para se alinhar melhor ao seu objetivo de perda de peso, você poderia reduzir a porção de arroz e adicionar mais vegetais.").
    Mantenha um tom profissional, encorajador e útil. A resposta deve ser em português do Brasil e estritamente no formato JSON especificado.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, {text: prompt}] },
    config: {
        responseMimeType: "application/json",
        responseSchema: mealAnalysisSchema,
    },
  });

  return parseJsonResponse<MealAnalysis>(response.text, 'MealAnalysis');
};