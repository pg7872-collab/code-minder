import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'conceptual', // 'dsa', 'conceptual', 'system-design', 'behavioral'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  codeTemplate: {
    type: String,
    default: '',
  },
  userAnswer: {
    type: String,
    default: '',
  },
  userCode: {
    type: String,
    default: '',
  },
  evaluation: {
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingConcepts: [{ type: String }],
    feedback: { type: String, default: '' },
    sampleAnswer: { type: String, default: '' },
    evaluatedAt: { type: Date, default: null },
  },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    interviewType: {
      type: String,
      enum: [
        'DSA',
        'JavaScript',
        'React',
        'Node.js',
        'MongoDB',
        'Backend',
        'Frontend',
        'HR',
        'Full Stack',
      ],
      required: true,
    },
    focusTopics: [{ type: String }],
    totalQuestions: {
      type: Number,
      default: 5,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    questions: [interviewQuestionSchema],
    overallReport: {
      averageScore: { type: Number, default: 0 },
      performanceRating: { type: String, default: '' },
      summary: { type: String, default: '' },
      keyStrengths: [{ type: String }],
      areasForImprovement: [{ type: String }],
      studyPlan: [{ type: String }],
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

interviewSessionSchema.index({ user: 1, createdAt: -1 });

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
