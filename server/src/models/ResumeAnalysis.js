import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
    },
    overallAssessment: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
    },
    technicalSkills: [
      {
        category: { type: String, default: 'General' },
        skills: [{ type: String }],
      },
    ],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingSkills: [{ type: String }],
    projectImprovements: [
      {
        projectTitle: { type: String, default: 'Project' },
        observation: { type: String },
        suggestion: { type: String },
      },
    ],
    atsFeedback: {
      score: { type: Number, min: 0, max: 100, default: 75 },
      formatNotes: [{ type: String }],
      keywordsFound: [{ type: String }],
      keywordsMissing: [{ type: String }],
    },
    bulletPointSuggestions: [
      {
        original: { type: String },
        improved: { type: String },
        reasoning: { type: String },
      },
    ],
    recommendedTopics: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

resumeAnalysisSchema.index({ user: 1, createdAt: -1 });

export const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
