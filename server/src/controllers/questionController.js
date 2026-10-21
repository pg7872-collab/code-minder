import { Question, DSA_TOPICS } from '../models/Question.js';
import { User } from '../models/User.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseFormatter.js';
import { calculateStreaks } from '../utils/streakCalculator.js';

/**
 * Recompute and synchronize aggregated statistics for a user
 */
export const syncUserStats = async (userId) => {
  try {
    const solvedQuestions = await Question.find({
      user: userId,
      status: 'Solved',
    }).select('difficulty dateSolved');

    let easy = 0;
    let medium = 0;
    let hard = 0;
    const dates = [];

    solvedQuestions.forEach((q) => {
      if (q.difficulty === 'Easy') easy++;
      if (q.difficulty === 'Medium') medium++;
      if (q.difficulty === 'Hard') hard++;
      if (q.dateSolved) dates.push(q.dateSolved);
    });

    const streakData = calculateStreaks(dates);

    await User.findByIdAndUpdate(userId, {
      stats: {
        totalSolved: solvedQuestions.length,
        easySolved: easy,
        mediumSolved: medium,
        hardSolved: hard,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastActiveDate: streakData.lastActiveDate,
      },
    });
  } catch (err) {
    console.error(`[Question Controller] Error syncing user stats for ${userId}:`, err.message);
  }
};

/**
 * @desc    Get user's questions with filtering, searching, sorting & pagination
 * @route   GET /api/questions
 * @access  Private
 */
export const getQuestions = async (req, res, next) => {
  try {
    const {
      topic,
      difficulty,
      platform,
      status,
      needsRevision,
      search,
      sortBy = 'dateSolved',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user.id };

    if (topic && topic !== 'All') query.topic = topic;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (platform && platform !== 'All') query.platform = platform;
    if (status && status !== 'All') query.status = status;
    if (needsRevision !== undefined && needsRevision !== 'All') {
      query.needsRevision = needsRevision === 'true';
    }

    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const sortOptions = {};
    const order = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'difficulty') {
      // Custom sorting for difficulty
      sortOptions.difficulty = order;
    } else {
      sortOptions[sortBy] = order;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [questions, total] = await Promise.all([
      Question.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Question.countDocuments(query),
    ]);

    return paginatedResponse(res, questions, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single question by ID
 * @route   GET /api/questions/:id
 * @access  Private
 */
export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    if (question.user.toString() !== req.user.id) {
      return errorResponse(res, 'Not authorized to access this question', 403);
    }

    return successResponse(res, question);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new question
 * @route   POST /api/questions
 * @access  Private
 */
export const createQuestion = async (req, res, next) => {
  try {
    const {
      title,
      platform,
      problemUrl,
      difficulty,
      topic,
      status,
      dateSolved,
      notes,
      timeTakenMinutes,
      needsRevision,
      revisionNotes,
    } = req.body;

    if (!title || !difficulty || !topic) {
      return errorResponse(res, 'Title, difficulty, and topic are required.', 400);
    }

    const question = await Question.create({
      user: req.user.id,
      title: title.trim(),
      platform: platform || 'LeetCode',
      problemUrl: problemUrl ? problemUrl.trim() : '',
      difficulty,
      topic,
      status: status || 'Solved',
      dateSolved: dateSolved ? new Date(dateSolved) : new Date(),
      notes: notes || '',
      timeTakenMinutes: timeTakenMinutes ? Number(timeTakenMinutes) : 0,
      needsRevision: Boolean(needsRevision),
      revisionNotes: revisionNotes || '',
    });

    // Recompute user stats
    await syncUserStats(req.user.id);

    return successResponse(res, question, 'Question logged successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update question
 * @route   PUT /api/questions/:id
 * @access  Private
 */
export const updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    if (question.user.toString() !== req.user.id) {
      return errorResponse(res, 'Not authorized to edit this question', 403);
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Recompute user stats
    await syncUserStats(req.user.id);

    return successResponse(res, question, 'Question updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete question
 * @route   DELETE /api/questions/:id
 * @access  Private
 */
export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    if (question.user.toString() !== req.user.id) {
      return errorResponse(res, 'Not authorized to delete this question', 403);
    }

    await question.deleteOne();

    // Recompute user stats
    await syncUserStats(req.user.id);

    return successResponse(res, null, 'Question removed successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get topic-wise completion and statistics
 * @route   GET /api/questions/topic-progress
 * @access  Private
 */
export const getTopicProgress = async (req, res, next) => {
  try {
    const userQuestions = await Question.find({ user: req.user.id });

    const topicStats = DSA_TOPICS.map((topic) => {
      const topicQuestions = userQuestions.filter((q) => q.topic === topic);
      const solved = topicQuestions.filter((q) => q.status === 'Solved').length;
      const total = topicQuestions.length;
      const easy = topicQuestions.filter((q) => q.status === 'Solved' && q.difficulty === 'Easy').length;
      const medium = topicQuestions.filter((q) => q.status === 'Solved' && q.difficulty === 'Medium').length;
      const hard = topicQuestions.filter((q) => q.status === 'Solved' && q.difficulty === 'Hard').length;

      return {
        topic,
        total,
        solved,
        easy,
        medium,
        hard,
        percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    });

    return successResponse(res, topicStats);
  } catch (err) {
    next(err);
  }
};
