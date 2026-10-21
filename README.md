# Code Minder — AI-Powered DSA & Interview Preparation Platform

A full-stack, production-grade MERN web application engineered for software engineers, computer science students, and tech job seekers to master Data Structures & Algorithms, track coding progress, simulate rigorous AI technical interviews, and audit resumes for ATS and role compatibility.

Inspired by modern developer platforms like LeetCode, GitHub, and Linear, **Code Minder** combines an immersive dark-themed dashboard with Google Gemini AI to provide real-time rubric grading, feedback, and actionable guidance.

---

## 🌟 Key Features

### 1. 📊 Main Developer Dashboard
- **Real-Time Problem Counters**: Track total solved problems and difficulty breakdown across **Easy**, **Medium**, and **Hard**.
- **Coding Streak & Active Days**: Current streak and longest continuous streak calculators computed dynamically from problem timestamps.
- **Interactive Consistency Visualizations**: Weekly and 30-day interactive problem-solving charts powered by **Recharts**.
- **Topic Mastery Breakdown**: Completion percentages and problem volume across 20+ DSA topics.
- **Recent Solved Questions & Live Contest Countdown Widget**: Quick links to open problems and upcoming contests.
- **Quick Action Bar**: One-click shortcuts to log problems, view contests, or launch mock interviews.

### 2. 📝 DSA Question Tracker
- **Comprehensive Problem Logging**: Store problem title, platform (*LeetCode, GeeksforGeeks, CodeStudio, Codeforces, HackerRank, InterviewBit*), problem URL, difficulty, topic, status (*Solved, In Progress, Not Started*), date solved, solution notes, and time taken in minutes.
- **Revision Queue**: Flag tricky questions for revision and keep focused notes on subtle edge cases or algorithmic traps.
- **Rich Multi-Field Filtering & Sorting**: Filter by topic, difficulty, platform, status, or revision flag. Search problems by keyword or pattern in real-time. Sort by date, title, or difficulty.
- **Pagination & Topic Mastery Analytics**: Clean pagination for large question collections and collapsible topic progress metrics.
- **Strict User Authorization**: Multi-tenant database design ensuring users can only read, update, and delete their own questions.

### 3. 🏆 Coding Contest Aggregator
- **Multi-Platform Contest Tracker**: Aggregates upcoming and completed contests across **LeetCode**, **Codeforces**, **CodeChef**, and **AtCoder**.
- **Live Ticking Countdown Timers**: Real-time ticker counting down days, hours, minutes, and seconds until contest start time.
- **Interactive Status Ticker**: Automatically highlights live running contests with a pulsing badge.
- **Local Timezone Conversion**: Automatically converts contest UTC timestamps into the user's browser timezone.
- **Personal Contest Bookmarking**: Star upcoming contests to keep track of reminders on your profile and dashboard.
- **Resilient Fallback Design**: Integrates public APIs (*Codeforces API, Kontests API*) with a reliable fallback schedule so the aggregator works seamlessly offline or when external rate limits occur.

### 4. 🤖 AI-Powered Resume Analyzer
- **In-Memory PDF Extraction**: Extracts and sanitizes plain text directly from in-memory buffers using `pdf-parse` (zero raw file retention on disk for security and privacy).
- **Target Role Alignment**: Evaluates resume qualifications against specific engineering roles (*Software Development Engineer, Frontend Developer, Backend Developer, Full Stack Developer, Data Engineer, DevOps*).
- **Google Gemini 1.5 Analysis**:
  - **Executive Assessment & Score**: Objective readiness score (0-100) and evaluation paragraph.
  - **Categorized Technical Stack**: Extracted languages, frontend frameworks, backend stacks, databases, and tools.
  - **Key Strengths & Critical Gaps**: Standout achievements vs missing technologies required for the role.
  - **Google XYZ Formula Bullet Rewrites**: Concrete, high-impact rewrites transforming passive duties into quantifiable accomplishments.
  - **ATS Readability & Keyword Audit**: Identifies matched keywords and missing keywords for recruitment parsers.
  - **Recommended Study Topics**: Tailored list of topics to revise before interviews, with a one-click shortcut to launch a mock interview on those exact topics.
- **History Management**: Review and delete previous scan reports at any time.

### 5. 🎙️ AI Technical Interview Simulator
- **Flexible Track Selection**: Supports **DSA**, **JavaScript**, **React**, **Node.js**, **MongoDB**, **Backend**, **Frontend**, and **HR / Behavioral** tracks.
- **Configurable Difficulty & Question Count**: Choose *Beginner*, *Intermediate*, or *Advanced* with 3, 5, 7, or 10 questions.
- **Step-by-Step Interview Room**: Displays one prompt at a time with problem statement, constraints, and starter code templates.
- **Developer Solution Workspace**:
  - Code Editor with line numbers, monospace typography, template reset, and copy buttons.
  - Written explanation area to articulate approach, Big-O time complexity, and space complexity trade-offs.
- **Gemini Structured Rubric Evaluation**:
  - Score (0-100) based on correctness, edge cases, and algorithmic efficiency.
  - Identified strengths and weaknesses.
  - Missing concepts or unhandled boundary cases.
  - Detailed constructive feedback paragraph.
  - Optimal model answer and solution code for comparison.
- **Executive Performance Report**:
  - Cumulative average score and hire recommendation (*Strong Hire, Hire, Borderline, Needs Practice*).
  - Key strengths summary and improvement points.
  - Actionable 7-day study plan.
  - Accordion review of every submitted answer and score.

### 6. 👤 Developer Profile & External Stats Sync
- **Unified Profile Hub**: Displays user bio, college, graduation year, target role, and avatar.
- **Official Platform Synchronization**: Connect public **LeetCode** and **Codeforces** usernames to fetch verified problem solve counts, global rankings, and contest ratings via official endpoints.
- **Bookmarks & Revision Queue**: Aggregated view of flagged revision problems and bookmarked contests.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React, clsx |
| **Backend** | Node.js (ES Modules), Express.js, Mongoose, JWT (`jsonwebtoken`), bcryptjs |
| **AI Engine** | Google Gemini API (`@google/generative-ai`), Gemini 1.5 Flash |
| **Document Processing** | Multer (in-memory storage), `pdf-parse` |
| **Security & Middleware** | Helmet, CORS, Express Rate Limit, Express Validator, Cookie Parser |
| **Database** | MongoDB (Local Daemon or MongoDB Atlas) with automatic fallback |
| **Testing** | Jest, Supertest |

---

## 📁 Project Structure

```
prakash_Antigravity_project/
├── client/                               # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                          # Axios API clients
│   │   │   ├── axiosClient.js            # Base Axios instance with auth interceptors
│   │   │   ├── authApi.js                # Auth endpoints
│   │   │   ├── questionApi.js            # Questions CRUD endpoints
│   │   │   ├── contestApi.js             # Contests & bookmarks
│   │   │   ├── resumeApi.js              # Resume upload & history
│   │   │   ├── interviewApi.js           # Interview simulation
│   │   │   ├── dashboardApi.js           # Metrics & charts
│   │   │   └── profileApi.js             # Profile & external sync
│   │   ├── components/
│   │   │   ├── common/                   # ProtectedRoute, Modal, Toast, StatCard, Badge, Skeleton, EmptyState
│   │   │   ├── layout/                   # Navbar, Sidebar, AppLayout
│   │   │   ├── questions/                # QuestionModal, QuestionTable, QuestionFilters
│   │   │   ├── contests/                 # ContestCard, CountdownTimer
│   │   │   ├── resume/                   # ResumeUploader, ResumeAnalysisView
│   │   │   └── interview/                # InterviewSetupModal, CodeEditor, FeedbackCard, InterviewReport
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Session management & user state
│   │   │   └── ThemeContext.jsx          # Dark / Light theme toggle
│   │   ├── pages/                        # Landing, Login, Register, Dashboard, Questions, Contests, Resume, Interview, Profile, Settings, NotFound
│   │   ├── App.jsx                       # Routing & provider wrapper
│   │   ├── index.css                     # Tailwind & custom scrollbar styles
│   │   └── main.jsx                      # React DOM mount
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js                    # Vite dev proxy configuration (/api -> http://localhost:5000)
│
├── server/                               # Express + MongoDB Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                     # MongoDB connection with in-memory fallback
│   │   │   └── env.js                    # Environment variable loader
│   │   ├── controllers/                  # auth, question, dashboard, profile, contest, resume, interview
│   │   ├── middleware/                   # auth JWT, errorHandler, rateLimiter, upload, validate
│   │   ├── models/                       # User, Question, ContestBookmark, ResumeAnalysis, InterviewSession
│   │   ├── routes/                       # authRoutes, questionRoutes, dashboardRoutes, etc.
│   │   ├── services/
│   │   │   ├── geminiService.js          # Google Gemini AI integration (questions, rubric, resume)
│   │   │   ├── contestService.js         # Codeforces & Kontests API aggregation
│   │   │   ├── externalCodingService.js  # Official LeetCode & Codeforces profile fetcher
│   │   │   └── pdfService.js             # In-memory PDF text extraction
│   │   ├── utils/                        # streakCalculator, responseFormatter
│   │   ├── scripts/
│   │   │   └── seed.js                   # Database seeding script with demo account & questions
│   │   ├── app.js                        # Express app with security headers & routes
│   │   └── server.js                     # Server entry point
│   ├── tests/
│   │   └── unit.test.js                  # Automated unit test suite
│   ├── .env.example                      # Template environment variables
│   ├── .env                              # Local environment variables
│   └── package.json
│
├── package.json                          # Workspace root script runner
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ / v24+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: Local MongoDB instance (listening on `localhost:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string.

---

### 2. Installation

Clone or open the project folder in your terminal:

```bash
cd prakash_Antigravity_project
```

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

### 3. Environment Configuration

The backend contains a `.env.example` file. Copy it to `.env` inside `server/`:

```bash
# Inside server/
cp .env.example .env
```

#### Environment Variables (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codeminder
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Google Gemini API Key for live AI evaluations
# Obtain from https://aistudio.google.com/
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

> [!NOTE]
> **Gemini API Key**: If you do not have a Gemini API key yet, Code Minder automatically operates with intelligent, realistic built-in rubric evaluation and sample questions so you can test and explore every single feature immediately! Adding an API key seamlessly enables live Google Gemini 1.5 responses.

---

### 4. Seed Demo Data

Populate the database with a pre-configured demo user, 8 solved DSA problems, contest bookmarks, a sample resume analysis, and an AI interview session:

```bash
cd server
npm run seed
```

#### Demo User Credentials:
- **Email**: `demo@codeminder.io`
- **Password**: `password123`

*(You can also click the **"Click to Auto-Fill Demo Credentials"** button directly on the Login page).*

---

### 5. Running the Application Locally

#### Terminal 1 — Start the Backend Server:
```bash
cd server
npm start
```
*Backend runs on: `http://localhost:5000`*

#### Terminal 2 — Start the React Frontend:
```bash
cd client
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

Open **`http://localhost:5173`** in your browser.

---

## 🧪 Running Automated Tests

Run the backend automated test suite:

```bash
cd server
npm test
```

### Verified Test Coverage:
- **Streak & Activity Calculator**: Verifies current streak, longest streak, and 7-day/30-day activity timelines.
- **DSA Topic & Platform Validations**: Ensures proper enum consistency across all 20+ topics and platforms.
- **Security & Cryptography**: Tests bcrypt salted password hashing and JWT signing and verification.
- **Gemini Service Logic**: Tests question generation schema, rubric grading calculation, hire rating assignment, and resume analysis output validation.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with name, email, password, and target role |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT cookie/token |
| `POST` | `/api/auth/logout` | Private | Clear authentication cookie |
| `GET` | `/api/auth/me` | Private | Retrieve currently authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update name, avatar, college, and target role |

### Questions Tracker (`/api/questions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/questions` | Private | List questions with search, topic, difficulty, status, and pagination |
| `POST` | `/api/questions` | Private | Create a new DSA question |
| `GET` | `/api/questions/:id` | Private | Get single question details (ownership verified) |
| `PUT` | `/api/questions/:id` | Private | Update question details (ownership verified) |
| `DELETE` | `/api/questions/:id` | Private | Delete question (ownership verified) |
| `GET` | `/api/questions/topic-progress` | Private | Retrieve topic-wise completion counts and percentages |

### Dashboard & Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Private | Aggregated stats, streak counts, top topics, recent solved |
| `GET` | `/api/dashboard/activity` | Private | 7-day and 30-day timeline series for Recharts |

### Contests (`/api/contests`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/contests` | Private | Aggregated coding contests with platform & status filter |
| `GET` | `/api/contests/upcoming` | Private | Upcoming contests with countdown data |
| `GET` | `/api/contests/bookmarks` | Private | Retrieve user's bookmarked contests |
| `POST` | `/api/contests/:id/bookmark` | Private | Bookmark contest for reminders |
| `DELETE` | `/api/contests/:id/bookmark` | Private | Remove contest bookmark |

### AI Resume Analyzer (`/api/resume`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/resume/analyze` | Private | Upload PDF resume (`multipart/form-data`) & run Gemini audit |
| `GET` | `/api/resume/history` | Private | Retrieve past resume scan reports |
| `GET` | `/api/resume/:id` | Private | Get detailed analysis report by ID |
| `DELETE` | `/api/resume/:id` | Private | Delete resume analysis record |

### AI Interview Simulator (`/api/interviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interviews/start` | Private | Generate questions via Gemini & initialize session |
| `POST` | `/api/interviews/:id/answer` | Private | Submit answer, evaluate with rubric, advance question |
| `POST` | `/api/interviews/:id/complete` | Private | Generate final performance summary & hire rating |
| `GET` | `/api/interviews/history` | Private | Get past interview sessions |
| `GET` | `/api/interviews/:id` | Private | Get full session with evaluations and model solutions |

### Profile & External Sync (`/api/profile`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Private | Profile overview, revision queue, and stats |
| `PUT` | `/api/profile` | Private | Update profile bio |
| `POST` | `/api/profile/sync-external` | Private | Sync LeetCode or Codeforces public handle stats |

---

## 🛡️ Security & Resilience Best Practices

1. **User Isolation**: Every database record (Questions, Bookmarks, Resumes, Interview Sessions) references `user: req.user._id`. Backend controllers enforce ownership checks before any read, edit, or delete action.
2. **Safe PDF Handling**: PDF files uploaded via Multer are held in temporary memory buffers (`multer.memoryStorage()`) and never written to server disk. Only extracted text is evaluated, after which the buffer is discarded.
3. **Prompt Injection Defense**: Explicit security system prompts instruct Gemini to treat resume contents strictly as unverified data rather than instructions.
4. **Rate Limiting**: Independent rate limiters protect authentication endpoints (`/api/auth`) and AI endpoints (`/api/interviews`, `/api/resume`) against abuse.
5. **Security Headers & Cookies**: Express is fortified with Helmet, sanitized CORS, and JWT cookies set with `httpOnly: true`.

---

## 💻 Pair Programming & Verification

Built and verified in accordance with modern full-stack standards:
- [x] Node.js and MongoDB initialized and verified.
- [x] Database seeded with realistic data.
- [x] Production build tested with Vite (`vite build` succeeded with zero errors).
- [x] Automated test suite passed (11/11 tests passing).
- [x] End-to-end API verification performed for Auth, Questions, Contests, Resume Analyzer, and AI Interviews.
