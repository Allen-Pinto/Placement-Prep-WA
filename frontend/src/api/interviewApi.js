import { axiosClient, apiRequest } from './axiosClient';

/**
 * Interview API Service
 */
export const interviewApi = {
  /**
   * Get all user interviews with filters
   */
  getAllInterviews: (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    return apiRequest(() => 
      axiosClient.get(`/interviews?${params.toString()}`)
    );
  },

  /**
   * Get interview by ID
   */
  getInterviewById: (interviewId) => {
    return apiRequest(() => 
      axiosClient.get(`/interviews/${interviewId}`)
    );
  },

  /**
   * Create new interview
   */
  createInterview: (interviewData) => {
    return apiRequest(() => 
      axiosClient.post('/interviews', interviewData)
    );
  },

  /**
   * Update interview
   */
  updateInterview: (interviewId, updates) => {
    return apiRequest(() => 
      axiosClient.put(`/interviews/${interviewId}`, updates)
    );
  },

  /**
   * Delete interview
   */
  deleteInterview: (interviewId) => {
    return apiRequest(() => 
      axiosClient.delete(`/interviews/${interviewId}`)
    );
  },

  /**
   * Start mock interview session
   */
  startMockInterview: (interviewId) => {
    return apiRequest(() => 
      axiosClient.post(`/interviews/${interviewId}/start-mock`)
    );
  },

  /**
   * Add note to interview
   */
  addNote: (interviewId, note) => {
    return apiRequest(() => 
      axiosClient.post(`/interviews/${interviewId}/notes`, { note })
    );
  },

  /**
   * Get interview analytics
   */
  getAnalytics: () => {
    return apiRequest(() => 
      axiosClient.get('/interviews/analytics/overview')
    );
  },

  /**
   * Get upcoming interviews
   */
  getUpcomingInterviews: () => {
    return apiRequest(() => 
      axiosClient.get('/interviews/upcoming')
    );
  },

  /**
   * Update interview round
   */
  updateRound: (interviewId, roundId, roundData) => {
    return apiRequest(() => 
      axiosClient.put(`/interviews/${interviewId}/rounds/${roundId}`, roundData)
    );
  }
};

// In your interviewApi.js, make sure resumeApi has these functions:
export const resumeApi = {
  uploadResume: (formData) => {
    return apiRequest(() => 
      axiosClient.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  },

  getResumes: () => {
    return apiRequest(() => axiosClient.get('/resume'));
  },

  getResumeById: (resumeId) => {
    return apiRequest(() => axiosClient.get(`/resume/${resumeId}`));
  },

  updateResume: (resumeId, updates) => {
    return apiRequest(() => axiosClient.put(`/resume/${resumeId}`, updates));
  },

  deleteResume: (resumeId) => {
    return apiRequest(() => axiosClient.delete(`/resume/${resumeId}`));
  },

  getAISuggestions: (resumeId, targetRole) => {
    return apiRequest(() => 
      axiosClient.post(`/resume/${resumeId}/suggestions`, { targetRole })
    );
  },

  applySuggestion: (resumeId, suggestionId) => {
    return apiRequest(() => 
      axiosClient.post(`/resume/${resumeId}/apply-suggestion`, { suggestionId })
    );
  },

  analyzeATS: (resumeId) => {
    return apiRequest(() => axiosClient.get(`/resume/${resumeId}/ats-analysis`));
  },

  setPrimary: (resumeId) => {
    return apiRequest(() => 
      axiosClient.post(`/resume/${resumeId}/set-primary`)
    );
  }
};