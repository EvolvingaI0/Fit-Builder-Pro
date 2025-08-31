import 'dotenv/config';
// fix: Add types for Request and Response.
import express, { Request, Response } from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth';

import planRoutes from './routes/plan';
import foodRoutes from './routes/food';
import logRoutes from './routes/logs';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Public route example (if any needed)
app.get('/', (req: Request, res: Response) => {
    res.send('FitBuilder Pro Server is running!');
});

// Authenticated routes
app.use('/api/plan', authMiddleware, planRoutes);
app.use('/api/food', authMiddleware, foodRoutes);
app.use('/api/logs', authMiddleware, logRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
