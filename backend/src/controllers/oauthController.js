import { asyncHandler } from '../middleware/errorHandler.js';
import { CLIENT_URL } from '../config/env.js';

export const oauthSuccess = asyncHandler(async (req, res) => {
  console.log('=== OAuth Success Handler ===');
  console.log('User authenticated:', !!req.user);
  console.log('User email:', req.user?.email);
  console.log('CLIENT_URL:', CLIENT_URL);
  
  if (!req.user) {
    console.error('No user found in request');
    return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);
  }

  try {
    // Generate token using the User model method
    const token = req.user.generateAuthToken();
    console.log('Token generated successfully');
    console.log('Token preview:', token.substring(0, 30) + '...');
    
    // Update last login
    req.user.lastLogin = Date.now();
    await req.user.save({ validateBeforeSave: false });
    console.log('Last login updated');

    // Build redirect URL
    const redirectUrl = `${CLIENT_URL}/auth/success?token=${token}`;
    console.log('Redirecting to:', redirectUrl);
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in oauthSuccess:', error);
    res.redirect(`${CLIENT_URL}/login?error=token_generation_failed`);
  }
});

export const oauthFailure = (req, res) => {
  console.error('OAuth Authentication Failed');
  res.redirect(`${CLIENT_URL}/login?error=auth_failed`);
};