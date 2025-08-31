// from profiles table
export interface Profile {
  id: string;
  name: string;
  created_at: string;
}

// from user_settings table
export interface UserSettings {
  user_id: string;
  weight_kg: number;
  height_cm: number;
  age: number;
  sex: 'male' | 'female' | 'other';
  goal: 'lose_fat' | 'gain_muscle' | 'maintain';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active';
  updated_at: string;
}

// Combined profile for app usage
export type UserProfile = Profile & Partial<Omit<UserSettings, 'user_id' | 'updated_at'>>;


// from plans table
export interface Plan {
  id: number;
  user_id: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  plan_json: Record<string, any>;
  created_at: string;
}

// from meal_logs table
export interface MealLog {
  id: string;
  user_id: string;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  image_url: string | null;
  created_at: string;
}
