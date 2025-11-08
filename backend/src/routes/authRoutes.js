import express from 'express';
import passport from '../config/passport.js';
import {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
} from '../controllers/authController.js';
import { oauthSuccess, oauthFailure } from '../controllers/oauthController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { authValidation, validate } from '../Middleware/validator.js';

const router = express.Router();

router.post('/signup', authValidation.signup, validate, signup);
router.post('/login', authValidation.login, validate, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/failure',
    session: false 
  }),
  oauthSuccess
);

router.get('/github', passport.authenticate('github', { 
  scope: ['user:email'] 
}));

router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/api/auth/failure',
    session: false 
  }),
  oauthSuccess
);

router.get('/success', oauthSuccess);
router.get('/failure', oauthFailure);

router.use(protect);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', authValidation.changePassword, validate, changePassword);
router.delete('/account', deleteAccount);

export default router;