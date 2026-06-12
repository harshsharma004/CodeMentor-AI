import { Router } from 'express';
import { body } from 'express-validator';
import * as problemsController from '../controllers/problems.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/', problemsController.getProblems);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD', 'easy', 'medium', 'hard']),
    body('topic').notEmpty().withMessage('Topic is required'),
    validate,
  ],
  problemsController.addSolvedProblem
);

router.put('/:id', problemsController.updateSolvedProblem);
router.delete('/:id', problemsController.deleteSolvedProblem);

export default router;
