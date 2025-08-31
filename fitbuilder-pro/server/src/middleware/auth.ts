// fix: Import Request, Response, NextFunction from express.
import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabaseAdmin';

// fix: Add types for req, res, and next.
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required: No token provided.' });
    }

    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
        }

        // Attach user to the request object
        (req as any).user = user;
        next();

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error during authentication.' });
    }
};
