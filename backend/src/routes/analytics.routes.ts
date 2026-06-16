import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticate, analyticsController.getDashboard);
router.get('/weakness', authenticate, analyticsController.getAnalytics);
router.get('/profile', authenticate, analyticsController.getProfile);
router.get('/leaderboard', authenticate, analyticsController.getLeaderboard);

router.get('/readiness', authenticate, analyticsController.getReadiness);
router.get('/velocity', authenticate, analyticsController.getVelocity);
router.get('/mastery', authenticate, analyticsController.getMastery);

export default router;
