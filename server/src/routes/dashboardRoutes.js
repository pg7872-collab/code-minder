import express from 'express';
import { getDashboardStats, getActivityTimelineData } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/activity', getActivityTimelineData);

export default router;
