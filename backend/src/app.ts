import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import problemsRoutes from './routes/problems.routes.js';
import aiRoutes from './routes/ai.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import contestsRoutes from './routes/contests.routes.js';
import leetcodeRoutes from './routes/leetcode.routes.js';
import notesRoutes from './routes/notes.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contests', contestsRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

export default app;
