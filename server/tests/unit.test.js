import { calculateStreaks, generateActivityTimeline } from '../src/utils/streakCalculator.js';
import { DSA_TOPICS, PLATFORMS } from '../src/models/Question.js';
import {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateInterviewSummary,
  analyzeResumeWithGemini,
} from '../src/services/geminiService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('Streak and Activity Metrics Calculator', () => {
  it('should return 0 streak for empty dates', () => {
    const res = calculateStreaks([]);
    expect(res.currentStreak).toBe(0);
    expect(res.longestStreak).toBe(0);
    expect(res.totalActiveDays).toBe(0);
  });

  it('should accurately calculate current and longest streaks', () => {
    const now = new Date();
    const d0 = new Date(now).toISOString();
    const d1 = new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString();
    const d2 = new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString();

    const res = calculateStreaks([d0, d1, d2]);
    expect(res.currentStreak).toBe(3);
    expect(res.longestStreak).toBe(3);
    expect(res.totalActiveDays).toBe(3);
  });

  it('should generate 7-day and 30-day activity buckets', () => {
    const now = new Date();
    const timeline = generateActivityTimeline([now.toISOString()]);
    expect(timeline.weekly.length).toBe(7);
    expect(timeline.monthly.length).toBe(30);
    expect(timeline.weekly[6].count).toBe(1); // Today has count 1
  });
});

describe('DSA Topic and Platform Validations', () => {
  it('should contain fundamental DSA topics', () => {
    expect(DSA_TOPICS).toContain('Arrays');
    expect(DSA_TOPICS).toContain('Trees');
    expect(DSA_TOPICS).toContain('Dynamic Programming');
    expect(DSA_TOPICS).toContain('Graphs');
    expect(DSA_TOPICS).toContain('Sliding Window');
  });

  it('should contain supported coding platforms', () => {
    expect(PLATFORMS).toContain('LeetCode');
    expect(PLATFORMS).toContain('GeeksforGeeks');
    expect(PLATFORMS).toContain('Codeforces');
  });
});

describe('Security & Cryptography Utilities', () => {
  it('should hash passwords with salt rounds and verify correctly', async () => {
    const raw = 'SuperSecretPass123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(raw, salt);

    expect(hash).not.toBe(raw);
    const valid = await bcrypt.compare(raw, hash);
    const invalid = await bcrypt.compare('WrongPass', hash);

    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });

  it('should sign and verify JWT tokens securely', () => {
    const secret = 'test_secret_key_12345';
    const payload = { id: '65f1234567890abcdef12345' };

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, secret);
    expect(decoded.id).toBe(payload.id);
  });
});

describe('Gemini Service & Evaluator Core Logic', () => {
  it('should generate structured interview questions', async () => {
    const questions = await generateInterviewQuestions({
      role: 'Software Development Engineer',
      difficulty: 'Intermediate',
      interviewType: 'DSA',
      totalQuestions: 3,
    });

    expect(questions.length).toBe(3);
    expect(questions[0]).toHaveProperty('question');
    expect(questions[0]).toHaveProperty('codeTemplate');
    expect(questions[0].index).toBe(0);
  });

  it('should evaluate an interview answer with structured rubric', async () => {
    const evaluation = await evaluateInterviewAnswer({
      question: 'Two Sum problem',
      userAnswer: 'I use a hash map to store complements in O(N) time and O(N) space.',
      userCode: 'function twoSum() { return []; }',
      interviewType: 'DSA',
    });

    expect(evaluation.score).toBeGreaterThanOrEqual(0);
    expect(evaluation.score).toBeLessThanOrEqual(100);
    expect(evaluation.strengths.length).toBeGreaterThan(0);
    expect(evaluation.feedback).toBeDefined();
    expect(evaluation.sampleAnswer).toBeDefined();
  });

  it('should generate final performance report and hire rating', async () => {
    const summary = await generateInterviewSummary({
      role: 'Backend Engineer',
      interviewType: 'Node.js',
      difficulty: 'Intermediate',
      questionsWithEvals: [
        { question: 'Q1', evaluation: { score: 90 } },
        { question: 'Q2', evaluation: { score: 80 } },
      ],
    });

    expect(summary.averageScore).toBe(85);
    expect(['Strong Hire', 'Hire', 'Borderline', 'Needs Practice']).toContain(
      summary.performanceRating
    );
    expect(summary.keyStrengths.length).toBeGreaterThan(0);
    expect(summary.studyPlan.length).toBeGreaterThan(0);
  });

  it('should analyze resume text and produce ATS metrics', async () => {
    const analysis = await analyzeResumeWithGemini({
      resumeText: 'Experience: Built full-stack apps with React, Node.js, Express, and MongoDB. Solved 200 DSA problems.',
      targetRole: 'Software Development Engineer',
    });

    expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
    expect(analysis.overallScore).toBeLessThanOrEqual(100);
    expect(analysis.technicalSkills.length).toBeGreaterThan(0);
    expect(analysis.atsFeedback).toHaveProperty('keywordsFound');
    expect(analysis.bulletPointSuggestions.length).toBeGreaterThan(0);
  });
});
