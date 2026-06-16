import { Router } from 'express';
import { body } from 'express-validator';
import * as notesController from '../controllers/notes.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/', notesController.getNotes);
router.get('/problem/:problemId', notesController.getNoteByProblem);

router.post(
  '/',
  [
    body('problemId').notEmpty(),
    body('approach').optional().isString(),
    body('mistakes').optional().isString(),
    body('revisionNotes').optional().isString(),
    validate,
  ],
  notesController.upsertNote
);

router.delete('/:id', notesController.deleteNote);

export default router;
