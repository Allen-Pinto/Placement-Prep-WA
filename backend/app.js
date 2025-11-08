import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import compression from 'compression';
import passport from './src/config/passport.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import quizRoutes from './src/routes/quizRoutes.js';
import questionRoutes from './src/routes/questionRoutes.js';
import interviewRoutes from './src/routes/interviewRoutes.js';
import resumeRoutes from './src/routes/resumeRoutes.js';

import { CLIENT_URL, NODE_ENV } from './src/config/env.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Compression
app.use(compression());

// Passport middleware (must be after cookieParser and before routes)
app.use(passport.initialize());

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// API Documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API Documentation',
    endpoints: {
      auth: {
        'POST /api/auth/signup': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/profile': 'Get user profile',
        'PUT /api/auth/profile': 'Update profile',
        'PUT /api/auth/change-password': 'Change password',
        'DELETE /api/auth/account': 'Delete user account', // ✅ Added
        'GET /api/auth/google': 'Google OAuth',
        'GET /api/auth/github': 'GitHub OAuth',
      },
      health: {
        'GET /api/health': 'Health check',
      },
    },
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PrepSaaS API v1.0',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/api/health',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/attempts', quizRoutes); // Note: You might want separate attempts routes

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0',
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
