/**
 * API Client
 * Base API client with interceptors for authentication and error handling
 */

import axios from 'axios';
import { API_CONFIG, API_BASE_URL } from '../config/apiConfig';
import { getUserToken, getUserId, clearAuthData } from '../services/authService';
// storage helpers not required here directly

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Request interceptor to add authentication headers
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Attach Authorization header for multi-tenant user
      const token = await getUserToken();
      const userId = await getUserId();

      // Allow unauthenticated calls to specific public endpoints (e.g. login)
      const urlLower = (config.url || '').toString().toLowerCase();
      const isAuthEndpoint = urlLower.includes('/login') || urlLower.includes('/auth');

      // Prevent API calls if token is missing (except for auth endpoints)
      if (!token && !isAuthEndpoint) {
        const err = new Error('Missing authentication token');
        err.isAuthError = true;
        throw err;
      }

      config.headers = config.headers || {};
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      // Ensure JSON content-type by default
      if (!config.headers['Content-Type'] && !config.headers['content-type']) {
        config.headers['Content-Type'] = 'application/json';
      }

      // For POST requests with an object body, automatically inject user_id when not present
      if (config.method && config.method.toLowerCase() === 'post' && config.data && typeof config.data === 'object') {
        if (!('user_id' in config.data) && userId) {
          config.data = {
            user_id: userId,
            ...config.data,
          };
        }
      }

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear stored credentials and auth data
          try {
            clearAuthData();
          } catch (e) {
            console.error('Error clearing auth data on 401:', e);
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data);
          break;
        case 500:
          // Server error
          console.error('Server error:', data);
          break;
        default:
          console.error('API error:', status, data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error:', error.message);
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
