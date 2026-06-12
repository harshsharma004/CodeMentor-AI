import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticate, analyticsController.getDashboard);
router.get('/weakness', authenticate, analyticsController.getAnalytics);
router.get('/profile', authenticate, analyticsController.getProfile);
router.get('/leaderboard', authenticate, analyticsController.getLeaderboard);

export default router;
