import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    targetRole: {
      type: String,
      enum: [
        'Software Development Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Data Engineer',
        'DevOps / Cloud Engineer',
        'Other',
      ],
      default: 'Software Development Engineer',
    },
    externalProfiles: {
      leetcode: {
        username: { type: String, default: '' },
        solved: { type: Number, default: 0 },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
        ranking: { type: Number, default: 0 },
        lastFetched: { type: Date, default: null },
      },
      codeforces: {
        username: { type: String, default: '' },
        rating: { type: Number, default: 0 },
        rank: { type: String, default: '' },
        solved: { type: Number, default: 0 },
        lastFetched: { type: Date, default: null },
      },
      github: {
        username: { type: String, default: '' },
        repos: { type: Number, default: 0 },
        lastFetched: { type: Date, default: null },
      },
    },
    stats: {
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const User = mongoose.model('User', userSchema);
