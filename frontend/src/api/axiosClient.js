import axios from 'axios';
import { 
  API_BASE_URL, 
  API_TIMEOUT, 
  AUTH_TOKEN_KEY, 
  ERROR_MESSAGES,
  DEBUG_MODE 
} from '../utils/constants.js';
import toast from 'react-hot-toast';

/**
 * Create Axios instance with default configuration
 */
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor - Add auth token to requests
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (DEBUG_MODE) {
      console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle responses and errors globally
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (DEBUG_MODE) {
      console.log('✅ API Response:', response.config.url, response.data);
    }

    // Handle backend response format (success: true/false)
    if (response.data && typeof response.data.success !== 'undefined') {
      return response;
    }

    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (!error.response) {
      // Network error
      console.error('🌐 Network Error:', error.message);
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      return Promise.reject({ 
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0 
      });
    }

    const { status, data } = error.response;

    // Use backend error message if available
    const errorMessage = data?.message || 
                        data?.error?.message || 
                        ERROR_MESSAGES[status] || 
                        ERROR_MESSAGES.SERVER_ERROR;

    // Handle specific status codes
    switch (status) {
      case 400:
        // Bad Request - Show validation errors
        if (data.errors) {
          Object.values(data.errors).forEach(errMsg => {
            toast.error(errMsg);
          });
        } else {
          toast.error(errorMessage);
        }
        break;

      case 401:
        // Unauthorized - Clear token and redirect to login
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('prep_user_data');
        toast.error(ERROR_MESSAGES.UNAUTHORIZED);
        // Use setTimeout to avoid React state updates during render
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        break;

      case 403:
        // Forbidden
        toast.error('You do not have permission to perform this action.');
        break;

      case 404:
        // Not Found
        toast.error(errorMessage);
        break;

      case 422:
        // Validation Error
        if (data.errors) {
          Object.values(data.errors).forEach(errMsg => {
            toast.error(errMsg);
          });
        } else {
          toast.error(errorMessage);
        }
        break;

      case 429:
        // Too Many Requests
        toast.error('Too many requests. Please slow down.');
        break;

      case 500:
      case 502:
      case 503:
        // Server Errors
        toast.error(ERROR_MESSAGES.SERVER_ERROR);
        break;

      default:
        toast.error(errorMessage);
    }

    console.error('❌ API Error:', {
      status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: errorMessage,
      data: data
    });

    // Return consistent error format
    return Promise.reject({
      message: errorMessage,
      status,
      ...data
    });
  }
);

/**
 * Generic request wrapper with error handling
 * @param {Function} requestFn - Axios request function
 * @returns {Promise} Response data or error
 */
export const apiRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return { 
      data: response.data,  // Extract data from axios response
      error: null 
    };
  } catch (error) {
    console.error('💥 API Request Failed:', error);
    return { 
      data: null, 
      error: {
        message: error.message || 'Request failed',
        status: error.status,
        ...error
      }
    };
  }
};

export { axiosClient };
export default axiosClient;