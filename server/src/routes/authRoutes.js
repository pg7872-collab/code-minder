import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
