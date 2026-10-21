import { User } from '../models/User.js';
import { Question } from '../models/Question.js';
import { ContestBookmark } from '../models/ContestBookmark.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { InterviewSession } from '../models/InterviewSession.js';
import { fetchCodeforcesStats, fetchLeetCodeStats } from '../services/externalCodingService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { generateActivityTimeline } from '../utils/streakCalculator.js';

/**
 * @desc    Get user profile with aggregated activity and history
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [user, questions, bookmarks, resumes, interviews] = await Promise.all([
      User.findById(userId),
      Question.find({ user: userId }).sort({ dateSolved: -1 }),
      ContestBookmark.find({ user: userId }).sort({ createdAt: -1 }),
      ResumeAnalysis.find({ user: userId }).sort({ createdAt: -1 }),
      InterviewSession.find({ user: userId }).sort({ createdAt: -1 }),
    ]);

    const solvedQuestions = questions.filter((q) => q.status === 'Solved');
    const dates = solvedQuestions.map((q) => q.dateSolved);
    const timeline = generateActivityTimeline(dates);

    // Bookmarked/revision questions
    const revisionQuestions = questions.filter((q) => q.needsRevision);

    return successResponse(res, {
      user,
      stats: user.stats,
      questionsSummary: {
        totalTracked: questions.length,
        totalSolved: solvedQuestions.length,
        easy: solvedQuestions.filter((q) => q.difficulty === 'Easy').length,
        medium: solvedQuestions.filter((q) => q.difficulty === 'Medium').length,
        hard: solvedQuestions.filter((q) => q.difficulty === 'Hard').length,
        revisionCount: revisionQuestions.length,
      },
      activityTimeline: timeline,
      bookmarkedContests: bookmarks,
      revisionQuestions: revisionQuestions.slice(0, 10),
      recentInterviews: interviews.slice(0, 5),
      recentResumes: resumes.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update profile basic details
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, college, graduationYear, targetRole } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (avatar) updateFields.avatar = avatar;
    if (college !== undefined) updateFields.college = college.trim();
    if (graduationYear !== undefined) updateFields.graduationYear = graduationYear ? Number(graduationYear) : null;
    if (targetRole) updateFields.targetRole = targetRole;

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, user, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Connect and sync external coding profiles (LeetCode, Codeforces)
 * @route   POST /api/profile/sync-external
 * @access  Private
 */
export const syncExternalProfile = async (req, res, next) => {
  try {
    const { platform, username } = req.body;

    if (!platform || !username) {
      return errorResponse(res, 'Platform and username are required.', 400);
    }

    const cleanPlatform = platform.toLowerCase().trim();
    const cleanUsername = username.trim();

    let fetchedData = null;

    if (cleanPlatform === 'leetcode') {
      try {
        fetchedData = await fetchLeetCodeStats(cleanUsername);
      } catch (err) {
        return errorResponse(res, `Failed to sync LeetCode profile: ${err.message}`, 400);
      }

      await User.findByIdAndUpdate(req.user.id, {
        'externalProfiles.leetcode': fetchedData,
      });
    } else if (cleanPlatform === 'codeforces') {
      try {
        fetchedData = await fetchCodeforcesStats(cleanUsername);
      } catch (err) {
        return errorResponse(res, `Failed to sync Codeforces profile: ${err.message}`, 400);
      }

      await User.findByIdAndUpdate(req.user.id, {
        'externalProfiles.codeforces': fetchedData,
      });
    } else {
      return errorResponse(res, 'Supported external platforms are "leetcode" and "codeforces".', 400);
    }

    const updatedUser = await User.findById(req.user.id);
    return successResponse(res, { user: updatedUser, synced: fetchedData }, `${platform} profile connected successfully.`);
  } catch (err) {
    next(err);
  }
};
