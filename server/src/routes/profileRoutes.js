import express from 'express';
import { getProfile, updateProfile, syncExternalProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/sync-external', syncExternalProfile);

export default router;
