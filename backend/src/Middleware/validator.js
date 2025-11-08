import { body, validationResult } from 'express-validator';

/**
 * Validation Result Handler
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().reduce((acc, err) => {
        acc[err.path] = err.msg;
        return acc;
      }, {}),
    });
  }
  
  next();
};

/**
 * Auth Validation Rules
 */
export const authValidation = {
  signup: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  ],
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required'),
  ],
  changePassword: [
    body('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .trim()
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
  ],
};

/**
 * Interview Validation Rules
 */
export const interviewValidation = {
  create: [
    body('company')
      .trim()
      .notEmpty()
      .withMessage('Company name is required'),
    body('role')
      .trim()
      .notEmpty()
      .withMessage('Role is required'),
    body('date')
      .notEmpty()
      .withMessage('Interview date is required')
      .isISO8601()
      .withMessage('Invalid date format'),
  ],
};

/**
 * Quiz Validation Rules
 */
export const quizValidation = {
  submit: [
    body('answers')
      .isArray()
      .withMessage('Answers must be an array')
      .notEmpty()
      .withMessage('Answers cannot be empty'),
  ],
};

export default {
  validate,
  authValidation,
  interviewValidation,
  quizValidation,
};