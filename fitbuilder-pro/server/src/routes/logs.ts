// fix: Import Request, Response from express.
import express, { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const router = express.Router();
const PAGE_SIZE = 10;

// This route is a GET, so it can be called by the client directly.
// The authMiddleware protects it. It's an example of how the server can also act as a secure proxy to the database.
// fix: Add types for req and res.
router.get('/meals', async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string, 10) || 0;

    try {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabaseAdmin
            .from('meal_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error: any) {
        console.error('Error fetching meal logs:', error);
        res.status(500).json({ message: 'Failed to fetch meal logs.', details: error.message });
    }
});

export default router;
