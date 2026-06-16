import { Router } from 'express';
import { body } from 'express-validator';
import * as aiController from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.post('/chat', [body('message').trim().notEmpty(), validate], aiController.chat);
router.get('/chat/history', aiController.getChatHistory);
router.delete('/chat/history', aiController.clearChatHistory);

router.post(
  '/study-plan',
  [
    body('skillLevel').notEmpty(),
    body('targetCompany').trim().notEmpty(),
    body('hoursPerWeek').isInt({ min: 1, max: 80 }),
    validate,
  ],
  aiController.generateStudyPlan
);

router.get('/study-plans', aiController.getStudyPlans);

export default router;
