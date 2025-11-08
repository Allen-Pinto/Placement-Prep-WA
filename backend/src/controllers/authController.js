import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { JWT_SECRET, JWT_EXPIRE, JWT_COOKIE_EXPIRE, CLIENT_URL } from '../config/env.js';

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();
  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  const userResponse = user.getPublicProfile();
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userResponse,
  });
};

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Email already registered', 400));
  }
  const user = await User.create({
    name,
    email,
    password,
    provider: 'local',
  });
  sendTokenResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  if (user.provider !== 'local') {
    return next(new ErrorResponse(`Please login using ${user.provider} authentication`, 401));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });
  sendTokenResponse(user, 200, res);
});

export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user: user.getPublicProfile(),
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
    'preferences.theme': req.body.theme,
  };
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: user.getPublicProfile(),
  });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse('No user found with this email', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Password reset email sent (functionality coming soon)',
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;
  res.status(200).json({
    success: true,
    message: 'Password reset functionality coming soon',
  });
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  await User.findByIdAndDelete(userId);
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});

export default {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
};