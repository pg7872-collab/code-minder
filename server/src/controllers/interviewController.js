import { InterviewSession } from '../models/InterviewSession.js';
import {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateInterviewSummary,
} from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * @desc    Start new AI interview session
 * @route   POST /api/interviews/start
 * @access  Private
 */
export const startInterview = async (req, res, next) => {
  try {
    const {
      role = 'Software Development Engineer',
      difficulty = 'Intermediate',
      interviewType = 'DSA',
      totalQuestions = 5,
      focusTopics = [],
    } = req.body;

    const count = Math.max(1, Math.min(10, parseInt(totalQuestions, 10) || 5));

    // 1. Generate interview questions via Gemini
    const questions = await generateInterviewQuestions({
      role,
      difficulty,
      interviewType,
      totalQuestions: count,
      focusTopics: Array.isArray(focusTopics) ? focusTopics : [],
    });

    // 2. Create InterviewSession in MongoDB
    const session = await InterviewSession.create({
      user: req.user.id,
      role,
      difficulty,
      interviewType,
      focusTopics: Array.isArray(focusTopics) ? focusTopics : [],
      totalQuestions: questions.length,
      currentQuestionIndex: 0,
      status: 'in-progress',
      questions: questions.map((q, idx) => ({
        index: idx,
        question: q.question,
        type: q.type,
        difficulty: q.difficulty,
        codeTemplate: q.codeTemplate,
      })),
    });

    return successResponse(
      res,
      session,
      'Interview session started. Best of luck!',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Submit answer for a specific question in the interview
 * @route   POST /api/interviews/:id/answer
 * @access  Private
 */
export const submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, userAnswer, userCode } = req.body;
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return errorResponse(res, 'Interview session not found', 404);
    }

    if (session.user.toString() !== req.user.id) {
      return errorResponse(res, 'Not authorized to access this session', 403);
    }

    if (session.status === 'completed') {
      return errorResponse(res, 'This interview session is already completed.', 400);
    }

    const idx = parseInt(questionIndex, 10);
    const questionObj = session.questions.find((q) => q.index === idx);

    if (!questionObj) {
      return errorResponse(res, `Question index ${idx} not found in this session.`, 400);
    }

    // Evaluate answer with Gemini
    const evaluation = await evaluateInterviewAnswer({
      question: questionObj.question,
      userAnswer: userAnswer || '',
      userCode: userCode || '',
      interviewType: session.interviewType,
      role: session.role,
      difficulty: session.difficulty,
    });

    // Update question in session
    questionObj.userAnswer = userAnswer || '';
    questionObj.userCode = userCode || '';
    questionObj.evaluation = {
      ...evaluation,
      evaluatedAt: new Date(),
    };

    // Increment currentQuestionIndex if not at the end
    if (session.currentQuestionIndex <= idx) {
      session.currentQuestionIndex = Math.min(session.totalQuestions, idx + 1);
    }

    await session.save();

    return successResponse(
      res,
      {
        session,
        evaluation,
        isLastQuestion: idx + 1 >= session.totalQuestions,
      },
      'Answer evaluated successfully.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Finalize interview session and generate final performance report
 * @route   POST /api/interviews/:id/complete
 * @access  Private
 */
export const completeInterview = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return errorResponse(res, 'Interview session not found', 404);
    }

    if (session.user.toString() !== req.user.id) {
      return errorResponse(res, 'Not authorized to access this session', 403);
    }

    // Generate comprehensive summary
    const overallReport = await generateInterviewSummary({
      role: session.role,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      questionsWithEvals: session.questions,
    });

    session.status = 'completed';
    session.completedAt = new Date();
    session.overallReport = overallReport;

    await session.save();

    return successResponse(res, session, 'Interview completed! Final report generated.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user's interview history
 * @route   GET /api/interviews/history
 * @access  Private
 */
export const getInterviewHistory = async (req, res, next) => {
  try {
    const history = await InterviewSession.find({ user: req.user.id })
      .select('role difficulty interviewType status totalQuestions overallReport createdAt completedAt')
      .sort({ createdAt: -1 });

    return successResponse(res, history);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get full interview session details by ID
 * @route   GET /api/interviews/:id
 * @access  Private
 */
export const getInterviewById = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return errorResponse(res, 'Interview session not found', 404);
    }

    if (session.user.toString() !== req.user.id) {
      return errorResponse(res, 'Not authorized to view this session', 403);
    }

    return successResponse(res, session);
  } catch (err) {
    next(err);
  }
};
