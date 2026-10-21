import mongoose from 'mongoose';

const contestBookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    contestId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    durationSeconds: {
      type: Number,
      default: 7200, // 2 hours default
    },
    notes: {
      type: String,
      default: '',
    },
    reminderSet: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

contestBookmarkSchema.index({ user: 1, contestId: 1 }, { unique: true });

export const ContestBookmark = mongoose.model('ContestBookmark', contestBookmarkSchema);
