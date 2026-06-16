import { Router } from 'express';
import { body } from 'express-validator';
import * as usersController from '../controllers/users.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Public route
router.get('/:username', usersController.getPublicProfile);

// Authenticated routes
router.use(authenticate);

router.put(
  '/profile',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('username').optional().isString().trim().matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and dashes'),
    validate
  ],
  usersController.updateProfile
);

export default router;
