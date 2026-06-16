import { Router } from 'express';
import { body } from 'express-validator';
import * as leetcodeController from '../controllers/leetcode.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.post(
  '/sync',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    validate,
  ],
  leetcodeController.syncProfile
);

router.get('/profile', leetcodeController.getProfile);

export default router;
