// fix: Import Request, Response from express.
import express, { Request, Response } from 'express';
import { generatePlanFromAI } from '../lib/ai';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const router = express.Router();

// fix: Add types for req and res.
router.post('/generate', async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // 1. Fetch user settings from the database
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings) {
      return res.status(404).json({ message: 'User settings not found. Please complete onboarding.' });
    }
    
    // 2. Generate plan using AI
    const planResult = await generatePlanFromAI(settings);
    
    const newPlan = {
      user_id: userId,
      calories: planResult.calories,
      protein_g: planResult.protein_g,
      carbs_g: planResult.carbs_g,
      fat_g: planResult.fat_g,
      plan_json: { details: "Workout plan details can be generated here too." },
    };

    // 3. Save the new plan to the database
    const { data: savedPlan, error: saveError } = await supabaseAdmin
      .from('plans')
      .insert(newPlan)
      .select()
      .single();

    if (saveError) throw saveError;
    
    res.status(201).json(savedPlan);
  } catch (error: any) {
    console.error('Error generating plan:', error);
    res.status(500).json({ message: 'Failed to generate plan.', details: error.message });
  }
});

export default router;
