import mongoose from 'mongoose';

export const DSA_TOPICS = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Trees',
  'Binary Search Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Binary Search',
  'Stack',
  'Queue',
  'Heap',
  'Hashing',
  'Trie',
  'Bit Manipulation',
  'Two Pointers',
  'Sliding Window',
  'Math',
  'Matrix',
  'Design',
  'Other',
];

export const PLATFORMS = [
  'LeetCode',
  'GeeksforGeeks',
  'CodeStudio',
  'Codeforces',
  'HackerRank',
  'InterviewBit',
  'Other',
];

const questionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide the question title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    platform: {
      type: String,
      enum: PLATFORMS,
      default: 'LeetCode',
    },
    problemUrl: {
      type: String,
      trim: true,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Please select difficulty level'],
      default: 'Medium',
    },
    topic: {
      type: String,
      enum: DSA_TOPICS,
      required: [true, 'Please select a DSA topic'],
      default: 'Arrays',
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Solved'],
      default: 'Solved',
    },
    dateSolved: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
    timeTakenMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    needsRevision: {
      type: Boolean,
      default: false,
    },
    revisionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user query performance and sorting
questionSchema.index({ user: 1, status: 1, topic: 1, difficulty: 1 });
questionSchema.index({ user: 1, dateSolved: -1 });

export const Question = mongoose.model('Question', questionSchema);
