import { extractTextFromPdf } from '../services/pdfService.js';
import { analyzeResumeWithGemini } from '../services/geminiService.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * @desc    Upload PDF resume and run AI analysis
 * @route   POST /api/resume/analyze
 * @access  Private
 */
export const analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload a PDF resume file.', 400);
    }

    const targetRole = req.body.targetRole || req.user.targetRole || 'Software Development Engineer';

    // 1. Extract text safely in memory
    let pdfData;
    try {
      pdfData = await extractTextFromPdf(req.file.buffer);
    } catch (parseErr) {
      return errorResponse(res, parseErr.message, 400);
    }

    // 2. Perform AI evaluation using Gemini
    const analysisResult = await analyzeResumeWithGemini({
      resumeText: pdfData.text,
      targetRole,
    });

    // 3. Save analysis to database (do not store raw PDF buffer for privacy/storage efficiency)
    const savedRecord = await ResumeAnalysis.create({
      user: req.user.id,
      originalFileName: req.file.originalname,
      targetRole,
      overallAssessment: analysisResult.overallAssessment,
      overallScore: analysisResult.overallScore,
      technicalSkills: analysisResult.technicalSkills,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      missingSkills: analysisResult.missingSkills,
      projectImprovements: analysisResult.projectImprovements,
      atsFeedback: analysisResult.atsFeedback,
      bulletPointSuggestions: analysisResult.bulletPointSuggestions,
      recommendedTopics: analysisResult.recommendedTopics,
    });

    return successResponse(
      res,
      savedRecord,
      'Resume analyzed successfully. Review your detailed feedback below.',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user's previous resume analyses
 * @route   GET /api/resume/history
 * @access  Private
 */
export const getResumeHistory = async (req, res, next) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user.id })
      .select('originalFileName targetRole overallScore createdAt atsFeedback')
      .sort({ createdAt: -1 });

    return successResponse(res, analyses);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single resume analysis details
 * @route   GET /api/resume/:id
 * @access  Private
 */
export const getResumeById = async (req, res, next) => {
  try {
    const analysis = await ResumeAnalysis.findById(req.params.id);

    if (!analysis) {
      return errorResponse(res, 'Resume analysis record not found.', 404);
    }

    if (analysis.user.toString() !== req.user.id) {
      return errorResponse(res, 'Not authorized to view this analysis.', 403);
    }

    return successResponse(res, analysis);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete resume analysis record
 * @route   DELETE /api/resume/:id
 * @access  Private
 */
export const deleteResumeAnalysis = async (req, res, next) => {
  try {
    const analysis = await ResumeAnalysis.findById(req.params.id);

    if (!analysis) {
      return errorResponse(res, 'Resume analysis record not found.', 404);
    }

    if (analysis.user.toString() !== req.user.id) {
      return errorResponse(res, 'Not authorized to delete this analysis.', 403);
    }

    await analysis.deleteOne();

    return successResponse(res, null, 'Resume analysis record deleted.');
  } catch (err) {
    next(err);
  }
};
