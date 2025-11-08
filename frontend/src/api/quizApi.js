import { axiosClient, apiRequest } from './axiosClient';

/**
 * Quiz API Service 
 */
export const quizApi = {
  /**
   * Get user's quiz attempts - CORRECT PATH
   */
  getUserAttempts: (params = {}) => {
    const { limit = 5, page = 1 } = params;
    return apiRequest(() => 
      axiosClient.get(`/quizzes/user/attempts?limit=${limit}&page=${page}`) // Changed to /quizzes/user/attempts
    );
  },

  /**
   * Get available quizzes
   */
  getQuizzes: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(() => 
      axiosClient.get(`/quizzes?${params.toString()}`) // Changed to /quizzes
    );
  },

  /**
   * Get quiz by ID
   */
  getQuizById: (quizId) => {
    return apiRequest(() => 
      axiosClient.get(`/quizzes/${quizId}`) // Changed to /quizzes
    );
  },

  /**
   * Start a quiz
   */
  startQuiz: (quizId) => {
    return apiRequest(() => 
      axiosClient.post(`/quizzes/${quizId}/start`) // Changed to /quizzes
    );
  },

  /**
   * Submit quiz answers
   */
  submitQuiz: (attemptId, answers) => {
    return apiRequest(() => 
      axiosClient.post(`/quizzes/attempts/${attemptId}/submit`, { answers }) // Changed to /quizzes
    );
  },

  /**
   * Get attempt results
   */
  getAttemptResults: (attemptId) => {
    return apiRequest(() => 
      axiosClient.get(`/quizzes/attempts/${attemptId}/results`) // Changed to /quizzes
    );
  },

  /**
   * Get quiz analytics
   */
  getQuizAnalytics: () => {
    return apiRequest(() => 
      axiosClient.get('/quizzes/analytics') // Changed to /quizzes
    );
  }
};