import { getContestsData } from '../services/contestService.js';
import { ContestBookmark } from '../models/ContestBookmark.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * @desc    Get aggregated contests with optional filtering
 * @route   GET /api/contests
 * @access  Private
 */
export const getContests = async (req, res, next) => {
  try {
    const { platform, status } = req.query;
    const allContests = await getContestsData();

    // Fetch user's bookmarks to annotate
    const bookmarks = await ContestBookmark.find({ user: req.user.id });
    const bookmarkedIds = new Set(bookmarks.map((b) => b.contestId));

    let filtered = allContests.map((c) => ({
      ...c,
      isBookmarked: bookmarkedIds.has(c.id),
    }));

    if (platform && platform !== 'All') {
      filtered = filtered.filter(
        (c) => c.platform.toLowerCase() === platform.toLowerCase()
      );
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(
        (c) => c.status.toLowerCase() === status.toLowerCase()
      );
    }

    return successResponse(res, filtered);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get upcoming contests only
 * @route   GET /api/contests/upcoming
 * @access  Private
 */
export const getUpcomingContests = async (req, res, next) => {
  try {
    const allContests = await getContestsData();
    const now = new Date();
    const upcoming = allContests.filter((c) => new Date(c.startTime) > now);

    const bookmarks = await ContestBookmark.find({ user: req.user.id });
    const bookmarkedIds = new Set(bookmarks.map((b) => b.contestId));

    const enriched = upcoming.map((c) => ({
      ...c,
      isBookmarked: bookmarkedIds.has(c.id),
    }));

    return successResponse(res, enriched);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Bookmark a contest
 * @route   POST /api/contests/:id/bookmark
 * @access  Private
 */
export const bookmarkContest = async (req, res, next) => {
  try {
    const contestId = req.params.id;
    const { title, platform, url, startTime, durationSeconds } = req.body;

    const existing = await ContestBookmark.findOne({
      user: req.user.id,
      contestId,
    });

    if (existing) {
      return successResponse(res, existing, 'Contest is already bookmarked.');
    }

    const bookmark = await ContestBookmark.create({
      user: req.user.id,
      contestId,
      title: title || 'Coding Contest',
      platform: platform || 'Other',
      url: url || '',
      startTime: startTime ? new Date(startTime) : new Date(),
      durationSeconds: durationSeconds || 7200,
    });

    return successResponse(res, bookmark, 'Contest bookmarked successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Remove bookmark for a contest
 * @route   DELETE /api/contests/:id/bookmark
 * @access  Private
 */
export const removeBookmark = async (req, res, next) => {
  try {
    const contestId = req.params.id;

    const deleted = await ContestBookmark.findOneAndDelete({
      user: req.user.id,
      contestId,
    });

    if (!deleted) {
      return errorResponse(res, 'Bookmark not found', 404);
    }

    return successResponse(res, null, 'Bookmark removed.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all bookmarked contests for the user
 * @route   GET /api/contests/bookmarks
 * @access  Private
 */
export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await ContestBookmark.find({ user: req.user.id }).sort({
      startTime: 1,
    });
    return successResponse(res, bookmarks);
  } catch (err) {
    next(err);
  }
};
