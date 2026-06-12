import { Router } from 'express';
import { body } from 'express-validator';
import * as contestsController from '../controllers/contests.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/', contestsController.getContests);
router.post(
  '/',
  [body('contestName').trim().notEmpty(), validate],
  contestsController.addContest
);
router.put('/:id', contestsController.updateContest);
router.delete('/:id', contestsController.deleteContest);

export default router;
