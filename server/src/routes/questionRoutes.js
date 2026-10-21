import express from 'express';
import { body } from 'express-validator';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTopicProgress,
} from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getQuestions);
router.get('/topic-progress', getTopicProgress);
router.get('/:id', getQuestionById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Question title is required'),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
    body('topic').notEmpty().withMessage('DSA Topic is required'),
  ],
  validateRequest,
  createQuestion
);

router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
