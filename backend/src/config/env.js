import dotenv from 'dotenv';

dotenv.config();

export const {
  NODE_ENV = 'development',
  PORT = 5001,
  HOST = 'localhost',
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRE = '7d',
  JWT_COOKIE_EXPIRE = 7,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  FRONTEND_URL = 'https://placement-prep-wa.vercel.app',
  CLIENT_URL = FRONTEND_URL, 
  EMAIL_SERVICE,
  EMAIL_FROM,
  EMAIL_USER,
  EMAIL_PASSWORD,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  OPENAI_API_KEY,
  RATE_LIMIT_WINDOW_MS = 900000,
  RATE_LIMIT_MAX_REQUESTS = 100,
  SESSION_SECRET,
  REDIS_URL,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} = process.env;

// Validate required environment variables
export const validateEnv = () => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }

  console.log('Environment variables loaded successfully');
};