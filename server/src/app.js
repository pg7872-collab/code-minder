import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import contestRoutes from './routes/contestRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows cross-origin assets during dev
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost, clientUrl, and requests without origin (e.g. mobile or curl)
      if (!origin || origin.startsWith('http://localhost') || origin === config.clientUrl) {
        callback(null, true);
      } else {
        callback(null, true); // Dev-permissive
      }
    },
    credentials: true,
  })
);

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// General API rate limiter
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Code Minder API',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interviews', interviewRoutes);

// Catch-all for unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.method} ${req.originalUrl} on this server`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
