import express from 'express';
import {
  analyzeResume,
  getResumeHistory,
  getResumeById,
  deleteResumeAnalysis,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', aiLimiter, uploadResume.single('resume'), analyzeResume);
router.get('/history', getResumeHistory);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResumeAnalysis);

export default router;
