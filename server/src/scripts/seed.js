import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Question } from '../models/Question.js';
import { ContestBookmark } from '../models/ContestBookmark.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { InterviewSession } from '../models/InterviewSession.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { syncUserStats } from '../controllers/questionController.js';

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing demo data...');
    const demoEmail = 'demo@codeminder.io';
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      await Promise.all([
        Question.deleteMany({ user: existingUser._id }),
        ContestBookmark.deleteMany({ user: existingUser._id }),
        ResumeAnalysis.deleteMany({ user: existingUser._id }),
        InterviewSession.deleteMany({ user: existingUser._id }),
        User.deleteOne({ _id: existingUser._id }),
      ]);
    }

    console.log('[Seed] Creating demo user...');
    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: demoEmail,
      password: 'password123',
      targetRole: 'Software Development Engineer',
      college: 'Stanford University',
      graduationYear: 2025,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      externalProfiles: {
        leetcode: {
          username: 'alexrivera_dev',
          solved: 142,
          easy: 60,
          medium: 68,
          hard: 14,
          ranking: 42180,
          lastFetched: new Date(),
        },
        codeforces: {
          username: 'alex_cf',
          rating: 1540,
          rank: 'Specialist',
          solved: 88,
          lastFetched: new Date(),
        },
      },
    });

    console.log('[Seed] Creating sample DSA questions...');
    const now = new Date();
    const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const sampleQuestions = [
      {
        user: demoUser._id,
        title: 'Two Sum',
        platform: 'LeetCode',
        problemUrl: 'https://leetcode.com/problems/two-sum/',
        difficulty: 'Easy',
        topic: 'Arrays',
        status: 'Solved',
        dateSolved: daysAgo(0),
        notes: 'Classic hash map complement check in O(N) time and O(N) space.',
        timeTakenMinutes: 15,
        needsRevision: false,
      },
      {
        user: demoUser._id,
        title: 'Longest Substring Without Repeating Characters',
        platform: 'LeetCode',
        problemUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        status: 'Solved',
        dateSolved: daysAgo(1),
        notes: 'Two pointers with hash set window tracking left boundary.',
        timeTakenMinutes: 25,
        needsRevision: true,
        revisionNotes: 'Recheck the left pointer jump when duplicate occurs.',
      },
      {
        user: demoUser._id,
        title: 'Invert Binary Tree',
        platform: 'LeetCode',
        problemUrl: 'https://leetcode.com/problems/invert-binary-tree/',
        difficulty: 'Easy',
        topic: 'Trees',
        status: 'Solved',
        dateSolved: daysAgo(2),
        notes: 'Recursive DFS swapping left and right subtrees.',
        timeTakenMinutes: 10,
        needsRevision: false,
      },
      {
        user: demoUser._id,
        title: 'Coin Change',
        platform: 'LeetCode',
        problemUrl: 'https://leetcode.com/problems/coin-change/',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        status: 'Solved',
        dateSolved: daysAgo(3),
        notes: 'Bottom-up DP table dp[i] = min(dp[i], dp[i - coin] + 1). Initialize with infinity.',
        timeTakenMinutes: 40,
        needsRevision: true,
        revisionNotes: 'Memorize unbounded knapsack transition pattern.',
      },
      {
        user: demoUser._id,
        title: 'Trapping Rain Water',
        platform: 'LeetCode',
        problemUrl: 'https://leetcode.com/problems/trapping-rain-water/',
        difficulty: 'Hard',
        topic: 'Two Pointers',
        status: 'Solved',
        dateSolved: daysAgo(4),
        notes: 'Two pointers maintaining leftMax and rightMax to achieve O(1) space.',
        timeTakenMinutes: 50,
        needsRevision: true,
        revisionNotes: 'Master both monotonic stack and two pointers approaches.',
      },
      {
        user: demoUser._id,
        title: 'Course Schedule (Cycle Detection in Directed Graph)',
        platform: 'LeetCode',
        problemUrl: 'https://leetcode.com/problems/course-schedule/',
        difficulty: 'Medium',
        topic: 'Graphs',
        status: 'Solved',
        dateSolved: daysAgo(5),
        notes: "Kahn's Algorithm using BFS and in-degree array, or DFS with recursion stack coloring.",
        timeTakenMinutes: 35,
        needsRevision: false,
      },
      {
        user: demoUser._id,
        title: 'Merge k Sorted Lists',
        platform: 'LeetCode',
        problemUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        difficulty: 'Hard',
        topic: 'Heap',
        status: 'In Progress',
        dateSolved: daysAgo(6),
        notes: 'Min-heap of size K or divide-and-conquer merge sort.',
        timeTakenMinutes: 30,
        needsRevision: true,
      },
      {
        user: demoUser._id,
        title: 'Valid Palindrome',
        platform: 'LeetCode',
        problemUrl: 'https://leetcode.com/problems/valid-palindrome/',
        difficulty: 'Easy',
        topic: 'Strings',
        status: 'Solved',
        dateSolved: daysAgo(7),
        notes: 'Two pointers alphanumeric skip.',
        timeTakenMinutes: 12,
        needsRevision: false,
      },
    ];

    await Question.insertMany(sampleQuestions);
    await syncUserStats(demoUser._id);

    console.log('[Seed] Creating demo contest bookmarks...');
    await ContestBookmark.create({
      user: demoUser._id,
      contestId: 'dev_lc_biweekly_142',
      title: 'LeetCode Biweekly Contest 142',
      platform: 'LeetCode',
      url: 'https://leetcode.com/contest/biweekly-contest-142',
      startTime: new Date(now.getTime() + 18 * 3600 * 1000),
      durationSeconds: 5400,
    });

    console.log('[Seed] Creating demo resume analysis...');
    await ResumeAnalysis.create({
      user: demoUser._id,
      originalFileName: 'Alex_Rivera_SDE_Resume.pdf',
      targetRole: 'Software Development Engineer',
      overallScore: 86,
      overallAssessment:
        'Strong academic grounding and impressive project portfolio in modern full-stack development with React, Node.js, and MongoDB. Candidate demonstrates good understanding of system fundamentals.',
      technicalSkills: [
        { category: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'C++', 'SQL'] },
        { category: 'Frontend', skills: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Vite'] },
        { category: 'Backend & DB', skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis'] },
        { category: 'Tools', skills: ['Git', 'Docker', 'Postman', 'Linux', 'Jest'] },
      ],
      strengths: [
        'Solid production-ready full-stack projects showcasing high code quality',
        'Demonstrated mastery of both relational and NoSQL databases',
        'Active open-source contributions and competitive programming consistency',
      ],
      weaknesses: [
        'Could include more quantitative business impact metrics on project bullet points',
        'Limited mention of cloud deployments or container orchestration (Kubernetes)',
      ],
      missingSkills: ['Kubernetes', 'CI/CD pipeline configuration', 'GraphQL'],
      projectImprovements: [
        {
          projectTitle: 'E-Commerce Platform',
          observation: 'Lacks quantitative performance metrics in project descriptions.',
          suggestion: 'Quantify query latency reductions and concurrent active users.',
        },
      ],
      atsFeedback: {
        score: 88,
        formatNotes: ['Standard clean ATS single-column hierarchy', 'Clear section dividers'],
        keywordsFound: ['React', 'Node.js', 'MongoDB', 'REST API', 'Algorithms'],
        keywordsMissing: ['CI/CD', 'Docker', 'Distributed Systems'],
      },
      bulletPointSuggestions: [
        {
          original: 'Built user authentication and session management.',
          improved: 'Architected robust JWT authentication module with refresh rotation, serving 10,000+ test requests with zero auth failures.',
          reasoning: 'Highlights scale and security rigor.',
        },
      ],
      recommendedTopics: [
        'System Design: Scalability and Distributed Caching',
        'Advanced Graph Algorithms: Tarjan and Dijkstra',
        'React Fiber Reconciler deep dive',
      ],
    });

    console.log('[Seed] Creating demo interview session...');
    await InterviewSession.create({
      user: demoUser._id,
      role: 'Software Development Engineer',
      difficulty: 'Intermediate',
      interviewType: 'DSA',
      totalQuestions: 2,
      currentQuestionIndex: 2,
      status: 'completed',
      completedAt: daysAgo(1),
      questions: [
        {
          index: 0,
          question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
          type: 'dsa',
          difficulty: 'Intermediate',
          userAnswer: 'I used a hash map to store seen elements and their indices. For each number, I check if target - num exists in the map.',
          userCode: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
          evaluation: {
            score: 95,
            strengths: ['Optimal O(N) time and O(N) space complexity', 'Handled edge cases cleanly'],
            weaknesses: ['Could briefly mention how collisions are resolved in internal hash maps'],
            missingConcepts: [],
            feedback: 'Excellent response. Optimal logic and concise implementation.',
            sampleAnswer: 'Standard hash map lookup.',
            evaluatedAt: daysAgo(1),
          },
        },
        {
          index: 1,
          question: 'Explain how Sliding Window optimizes subarray problems from O(N^2) to O(N).',
          type: 'conceptual',
          difficulty: 'Intermediate',
          userAnswer: 'Instead of re-computing every possible subarray, sliding window slides a window across the array, adding the incoming element and subtracting the outgoing element in O(1) amortized time.',
          userCode: '',
          evaluation: {
            score: 90,
            strengths: ['Clear explanation of amortized constant time transition', 'Correct contrast with brute force'],
            weaknesses: ['Could mention dynamic sliding window vs fixed-size sliding window'],
            missingConcepts: ['Dynamic vs Fixed window distinction'],
            feedback: 'Strong grasp of algorithmic mechanics. Remember to mention condition-based shrinking.',
            sampleAnswer: 'Sliding window maintains state over contiguous slices.',
            evaluatedAt: daysAgo(1),
          },
        },
      ],
      overallReport: {
        averageScore: 93,
        performanceRating: 'Strong Hire',
        summary: 'Outstanding algorithmic framing, clean code structure, and solid time complexity communication.',
        keyStrengths: ['Optimal data structure selection', 'Clean syntax', 'Clear explanations'],
        areasForImprovement: ['Mention dynamic vs fixed window variants in interview dialogues'],
        studyPlan: ['Practice advanced hard DP questions and graph cycle detection'],
      },
    });

    console.log('[Seed] Seeding completed successfully!');
    console.log(`[Seed] Demo Credentials:`);
    console.log(`   Email:    demo@codeminder.io`);
    console.log(`   Password: password123`);

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
