// fix: Import Request, Response from express.
import express, { Request, Response } from 'express';
import multer from 'multer';
import { analyzeImageWithAI } from '../lib/ai';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// fix: Add types for req and res.
router.post('/analyze', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }
  
  const userId = (req as any).user.id;
  if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const analysisResult = await analyzeImageWithAI(req.file.buffer, req.file.mimetype);
    
    const mealLog = {
        user_id: userId,
        description: analysisResult.description,
        calories: analysisResult.calories,
        protein_g: analysisResult.protein_g,
        carbs_g: analysisResult.carbs_g,
        fat_g: analysisResult.fat_g,
    };
    
    const { data, error } = await supabaseAdmin
        .from('meal_logs')
        .insert(mealLog)
        .select()
        .single();
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error analyzing food image:', error);
    res.status(500).json({ message: 'Failed to analyze image.', details: error.message });
  }
});

export default router;
