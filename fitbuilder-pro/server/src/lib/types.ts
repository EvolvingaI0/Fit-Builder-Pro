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
