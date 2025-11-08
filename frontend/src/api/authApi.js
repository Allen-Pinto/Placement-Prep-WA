import axiosClient, { apiRequest } from './axiosClient';

/**
 * Authentication API Service
 * Handles all user authentication and account-related operations.
 */
export const authApi = {
  /**
   * User login
   * @param {Object} credentials - { email, password }
   * @returns {Promise} User data and token
   */
  login: async (credentials) => {
    return apiRequest(() => axiosClient.post('/auth/login', credentials));
  },

  /**
   * User signup/registration
   * @param {Object} userData - { name, email, password }
   * @returns {Promise} User data and token
   */
  signup: async (userData) => {
    return apiRequest(() => axiosClient.post('/auth/signup', userData));
  },

  /**
   * Logout user (optional backend call)
   * @returns {Promise} Success status
   */
  logout: async () => {
    return apiRequest(() => axiosClient.post('/auth/logout'));
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    return apiRequest(() => axiosClient.get('/auth/profile'));
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Updated user data
   */
  updateProfile: async (profileData) => {
    return apiRequest(() => axiosClient.put('/auth/profile', profileData));
  },

  /**
   * Change password
   * @param {Object} passwords - { currentPassword, newPassword }
   * @returns {Promise} Success status
   */
  changePassword: async (passwords) => {
    return apiRequest(() => axiosClient.put('/auth/change-password', passwords));
  },

  /**
   * Delete user account permanently
   * @returns {Promise} Success status
   */
  deleteAccount: async () => {
    return apiRequest(() => axiosClient.delete('/auth/account'));
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Success status
   */
  forgotPassword: async (email) => {
    return apiRequest(() => axiosClient.post('/auth/forgot-password', { email }));
  },

  /**
   * Reset password with token
   * @param {Object} data - { token, newPassword }
   * @returns {Promise} Success status
   */
  resetPassword: async (data) => {
    return apiRequest(() => axiosClient.post('/auth/reset-password', data));
  },

  /**
   * Verify email using token
   * @param {string} token - Verification token
   * @returns {Promise} Success status
   */
  verifyEmail: async (token) => {
    return apiRequest(() => axiosClient.post('/auth/verify-email', { token }));
  },

  /**
   * Refresh access token
   * @returns {Promise} New token
   */
  refreshToken: async () => {
    return apiRequest(() => axiosClient.post('/auth/refresh-token'));
  },
};

export default authApi;
