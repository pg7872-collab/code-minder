import { Question } from '../models/Question.js';
import { User } from '../models/User.js';
import { InterviewSession } from '../models/InterviewSession.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { getContestsData } from '../services/contestService.js';
import { successResponse } from '../utils/responseFormatter.js';
import { generateActivityTimeline } from '../utils/streakCalculator.js';

/**
 * @desc    Get dashboard metrics, quick summary & widgets
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user and questions in parallel
    const [user, questions, interviews, resumes, allContests] = await Promise.all([
      User.findById(userId),
      Question.find({ user: userId }).sort({ dateSolved: -1 }),
      InterviewSession.find({ user: userId }).sort({ createdAt: -1 }),
      ResumeAnalysis.find({ user: userId }).sort({ createdAt: -1 }).limit(1),
      getContestsData(),
    ]);

    const solvedQuestions = questions.filter((q) => q.status === 'Solved');

    // Counts
    const easyCount = solvedQuestions.filter((q) => q.difficulty === 'Easy').length;
    const mediumCount = solvedQuestions.filter((q) => q.difficulty === 'Medium').length;
    const hardCount = solvedQuestions.filter((q) => q.difficulty === 'Hard').length;
    const totalSolved = solvedQuestions.length;

    // Recent solved
    const recentSolved = solvedQuestions.slice(0, 5);

    // Topic breakdown (top active topics)
    const topicCounts = {};
    solvedQuestions.forEach((q) => {
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    });

    const topTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Upcoming contests (top 3 upcoming)
    const now = new Date();
    const upcomingContests = allContests
      .filter((c) => new Date(c.startTime) > now)
      .slice(0, 4);

    // AI Interview preparation summary
    const completedInterviews = interviews.filter((i) => i.status === 'completed');
    const averageInterviewScore = completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce(
            (acc, curr) => acc + (curr.overallReport?.averageScore || 0),
            0
          ) / completedInterviews.length
        )
      : 0;

    return successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        targetRole: user.targetRole,
        avatar: user.avatar,
      },
      stats: {
        totalSolved,
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
        currentStreak: user.stats?.currentStreak || 0,
        longestStreak: user.stats?.longestStreak || 0,
        totalQuestionsTracked: questions.length,
        inProgressCount: questions.filter((q) => q.status === 'In Progress').length,
        revisionCount: questions.filter((q) => q.needsRevision).length,
      },
      recentSolved,
      topTopics,
      upcomingContests,
      interviewSummary: {
        totalSessions: interviews.length,
        completedSessions: completedInterviews.length,
        averageScore: averageInterviewScore,
        latestSession: interviews[0] || null,
      },
      latestResumeAnalysis: resumes[0] || null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get weekly and monthly activity chart data
 * @route   GET /api/dashboard/activity
 * @access  Private
 */
export const getActivityTimelineData = async (req, res, next) => {
  try {
    const questions = await Question.find({
      user: req.user.id,
      status: 'Solved',
    }).select('dateSolved');

    const dates = questions.map((q) => q.dateSolved);
    const timeline = generateActivityTimeline(dates);

    return successResponse(res, timeline);
  } catch (err) {
    next(err);
  }
};
