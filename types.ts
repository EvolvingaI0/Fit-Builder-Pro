
export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  currentWeight: number;
  targetWeight: number;
  
  // 1. Objetivo principal
  mainGoal: 'lose_weight' | 'gain_muscle' | 'maintain_fitness' | 'improve_conditioning' | 'other';
  otherGoal?: string;

  // 3. Saúde e condições médicas
  healthConditions: string[];
  otherHealthConditions?: string;

  // 4. Experiência física
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  exerciseFrequency: 'none' | '1-2_per_week' | '3-4_per_week' | '5+_per_week';
  hadStructuredProgram: boolean;

  // 5. Preferências de treino
  trainingLocation: 'home' | 'gym' | 'outdoors';
  trainingStyle: 'strength' | 'cardio' | 'stretching' | 'yoga_pilates' | 'mixed';
  trainingDurationPreference: 'short_intense' | 'long_light';
  equipmentAvailable: boolean;
  highImpactAccepted: boolean;
  
  // 6. Disponibilidade
  daysPerWeek: '1-2' | '3-4' | '5-6' | 'every_day';
  timePerSession: 'under_20' | '20-40' | '40-60' | 'over_60';
  preferredTime: 'morning' | 'afternoon' | 'night' | 'flexible';

  // 7. Nutrição e hábitos alimentares
  mealsPerDay: '1-2' | '3' | '4-5' | '5+';
  cookingHabit: 'mostly_out' | 'mostly_home' | 'mixed';
  trackMacros: boolean;
  supplements: string[];
  otherSupplements?: string;
  dietaryRestrictions: ('vegetarian' | 'vegan' | 'gluten_free' | 'lactose_free')[];
  otherDietaryRestrictions?: string;

  // 8. Motivação e metas
  motivationLevel: 'low' | 'medium' | 'high';
  goalTimeline: 'short_term' | 'medium_term' | 'long_term';
  openToChallenges: boolean;

  // 9. Preferências extras
  extraFocus: 'strength' | 'endurance' | 'fat_loss' | 'specific_performance';
  workoutStructure: 'individual' | 'circuits';
  visualTracking: boolean;
  notificationsEnabled: boolean;

  // Estilo de Vida (do quiz anterior, ainda importante)
  sleepQuality: 'poor' | 'average' | 'good';
  stressLevel: 'low' | 'medium' | 'high';
  budget: 'economic' | 'moderate' | 'flexible';
  dislikedFoods: string;
}


export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  tip?: string;
}

export interface WorkoutDay {
  day: number;
  focus: string;
  exercises: Exercise[];
}

export interface FitnessPlan {
  geralDescription: string;
  workouts: WorkoutDay[];
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyDiet {
    dayOfWeek: string;
    meals: Meal[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
}

export interface DietPlan {
    weeklyDiet: DailyDiet[];
    weeklyAverage: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
}


export interface MealAnalysis {
  foodItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  recommendation: string;
}

export interface ProgressEntry {
  date: string; // ISO string
  weight: number;
  waist?: number;
  chest?: number;
  hip?: number;
}

export interface HydrationLog {
    date: string; // YYYY-MM-DD
    glasses: number;
}

export interface User {
  email: string;
  password?: string;
  profile?: UserProfile;
  fitnessPlan?: FitnessPlan;
  dietPlan?: DietPlan;
  mealPlannerData?: { [weekId: string]: string[] };
  workoutScheduleData?: { [date: string]: { status?: 'completed' | 'skipped'; notes?: string } };
  challengeProgress?: { [challengeId:string]: boolean[] };
}