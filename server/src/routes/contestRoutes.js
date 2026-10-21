import express from 'express';
import {
  getContests,
  getUpcomingContests,
  bookmarkContest,
  removeBookmark,
  getBookmarks,
} from '../controllers/contestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getContests);
router.get('/upcoming', getUpcomingContests);
router.get('/bookmarks', getBookmarks);
router.post('/:id/bookmark', bookmarkContest);
router.delete('/:id/bookmark', removeBookmark);

export default router;
