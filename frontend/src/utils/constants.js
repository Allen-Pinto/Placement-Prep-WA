// API Configuration - MUST MATCH BACKEND
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://placement-prep-wa.onrender.com/api';
export const API_TIMEOUT = 30000;

// Debug mode
export const DEBUG_MODE = import.meta.env.VITE_NODE_ENV === 'development';

// Authentication
export const AUTH_TOKEN_KEY = 'prep_auth_token';
export const USER_DATA_KEY = 'prep_user_data';
export const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes

// Quiz Configuration
export const QUIZ_TYPES = {
  APTITUDE: 'aptitude',
  CODING: 'coding',
  HR_BEHAVIORAL: 'hr_behavioral',
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const QUIZ_TIME_LIMITS = {
  APTITUDE: 30 * 60, // 30 minutes in seconds
  CODING: 60 * 60, // 60 minutes
  HR_BEHAVIORAL: 45 * 60, // 45 minutes
};

// Question Types
export const QUESTION_TYPES = {
  MCQ: 'mcq',
  CODING: 'coding',
  SUBJECTIVE: 'subjective',
};

// Status Types
export const INTERVIEW_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
};

export const ATTEMPT_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
};

// UI Constants
export const ITEMS_PER_PAGE = 12;
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 3000;

// Score Ranges
export const SCORE_RANGES = {
  EXCELLENT: { min: 90, max: 100, label: 'Excellent', color: 'success' },
  GOOD: { min: 75, max: 89, label: 'Good', color: 'info' },
  AVERAGE: { min: 60, max: 74, label: 'Average', color: 'warning' },
  POOR: { min: 0, max: 59, label: 'Needs Improvement', color: 'error' },
};

// Topics & Categories
export const TOPICS = {
  ARRAYS_HASHING: { id: 'arrays_hashing', name: 'Arrays & Hashing', icon: '📊' },
  TWO_POINTERS: { id: 'two_pointers', name: 'Two Pointers', icon: '👉' },
  SLIDING_WINDOW: { id: 'sliding_window', name: 'Sliding Window', icon: '🪟' },
  STACK: { id: 'stack', name: 'Stack', icon: '📚' },
  BINARY_SEARCH: { id: 'binary_search', name: 'Binary Search', icon: '🔍' },
  LINKED_LIST: { id: 'linked_list', name: 'Linked List', icon: '🔗' },
  TREES: { id: 'trees', name: 'Trees', icon: '🌳' },
  GRAPHS: { id: 'graphs', name: 'Graphs', icon: '🕸️' },
  DYNAMIC_PROGRAMMING: { id: 'dp', name: 'Dynamic Programming', icon: '💡' },
  SYSTEM_DESIGN: { id: 'system_design', name: 'System Design', icon: '🏗️' },
};

// Routes - UPDATED WITH AUTH_SUCCESS
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  AUTH_SUCCESS: '/auth/success', // ADDED THIS LINE
  DASHBOARD: '/dashboard',
  PRACTICE: '/practice',
  INTERVIEWS: '/interviews',
  INTERVIEW_DETAIL: '/interviews/:id',
  QUIZ: '/quiz/:id',
  RESULTS: '/results/:id',
  RESUME: '/resume',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  NOT_FOUND: '*',
};

// Feature Flags
export const FEATURES = {
  AI_INTERVIEW: true,
  RESUME_ANALYSIS: true,
  MOCK_INTERVIEWS: true,
  ANALYTICS: true,
  LEADERBOARD: false, // Coming soon
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your inputs and try again.',
  NOT_FOUND: 'Resource not found.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  SIGNUP: 'Account created successfully!',
  QUIZ_SUBMITTED: 'Quiz submitted successfully!',
  RESUME_UPLOADED: 'Resume uploaded successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};