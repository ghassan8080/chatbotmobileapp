/**
 * Global Error Handler Service
 * Centralized error handling for API calls, validation, and runtime errors
 */

import { DEBUG_LOGGING } from '../config/apiConfig';

/**
 * Error Categories for different types of errors
 */
export const ERROR_CATEGORIES = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  FORBIDDEN: 'FORBIDDEN_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  NOT_FOUND_ERROR: 'The requested resource was not found.',
  FORBIDDEN_ERROR: 'You do not have permission to access this resource.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Parse error from API response or exception
 * @param {Error|Object} error - Error object from API call or thrown error
 * @returns {Object} Normalized error object with category and message
 */
export const parseError = (error) => {
  // Log raw error for debugging
  if (DEBUG_LOGGING) {
    console.error('🔴 Raw Error:', error);
  }

  let category = ERROR_CATEGORIES.UNKNOWN;
  let message = ERROR_MESSAGES.UNKNOWN_ERROR;
  let details = {};

  // Handle Axios errors
  if (error.response) {
    // Server responded with error status code
    const status = error.response.status;

    if (status === 401) {
      category = ERROR_CATEGORIES.AUTHENTICATION;
      message = ERROR_MESSAGES.AUTH_ERROR;
    } else if (status === 403) {
      category = ERROR_CATEGORIES.FORBIDDEN;
      message = ERROR_MESSAGES.FORBIDDEN_ERROR;
    } else if (status === 404) {
      category = ERROR_CATEGORIES.NOT_FOUND;
      message = ERROR_MESSAGES.NOT_FOUND_ERROR;
    } else if (status >= 500) {
      category = ERROR_CATEGORIES.SERVER;
      message = ERROR_MESSAGES.SERVER_ERROR;
    } else {
      category = ERROR_CATEGORIES.SERVER;
      // Try to use server message if available
      if (error.response.data?.message) {
        message = error.response.data.message;
      } else {
        message = ERROR_MESSAGES.SERVER_ERROR;
      }
    }

    details = {
      status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response received
    category = ERROR_CATEGORIES.NETWORK;
    message = ERROR_MESSAGES.NETWORK_ERROR;
    details = { request: error.request };
  } else if (error.code === 'ECONNABORTED') {
    // Timeout error
    category = ERROR_CATEGORIES.TIMEOUT;
    message = ERROR_MESSAGES.TIMEOUT_ERROR;
  } else if (error.message) {
    // Handle custom error messages
    if (error.message.includes('timeout')) {
      category = ERROR_CATEGORIES.TIMEOUT;
      message = ERROR_MESSAGES.TIMEOUT_ERROR;
    } else if (error.message.includes('network')) {
      category = ERROR_CATEGORIES.NETWORK;
      message = ERROR_MESSAGES.NETWORK_ERROR;
    } else if (error.message.includes('auth')) {
      category = ERROR_CATEGORIES.AUTHENTICATION;
      message = ERROR_MESSAGES.AUTH_ERROR;
    } else {
      message = error.message;
    }
  }

  return {
    category,
    message,
    details,
    originalError: error,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Log error with context
 * @param {string} context - Where the error occurred (e.g., 'LoginScreen', 'ProductAPI')
 * @param {Error} error - The error object
 * @param {Object} additionalContext - Extra context information
 */
export const logError = (context, error, additionalContext = {}) => {
  const parsedError = parseError(error);

  const errorLog = {
    context,
    category: parsedError.category,
    message: parsedError.message,
    timestamp: parsedError.timestamp,
    ...additionalContext,
  };

  if (DEBUG_LOGGING) {
    console.error(`[${context}] Error:`, errorLog);
  }

  // In production, you might want to send this to an error tracking service
  // e.g., Sentry, LogRocket, etc.
  // Example:
  // if (ENVIRONMENT === 'production') {
  //   sendToErrorTrackingService(errorLog);
  // }

  return errorLog;
};

/**
 * Handle API errors and return user-friendly message
 * @param {Error} error - Error from API call
 * @param {string} context - Context of where error occurred
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, context) => {
  const parsedError = parseError(error);
  logError(context, error);
  return parsedError.message;
};

/**
 * Retry logic for failed requests
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delayMs - Delay between retries in milliseconds
 * @returns {Promise<*>} Result of function call
 */
export const retryWithExponentialBackoff = async (
  fn,
  maxRetries = 3,
  delayMs = 1000
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on authentication errors or 4xx errors (except 429)
      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403 || (status >= 400 && status !== 429)) {
          throw error;
        }
      }

      if (attempt < maxRetries) {
        const waitTime = delayMs * Math.pow(2, attempt);
        if (DEBUG_LOGGING) {
          console.warn(`Retry attempt ${attempt + 1}/${maxRetries} in ${waitTime}ms`);
        }
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
};

/**
 * Validate response structure
 * @param {Object} response - API response to validate
 * @param {Array} requiredFields - Required fields in response
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
export const validateResponse = (response, requiredFields = []) => {
  if (!response) {
    throw new Error('Response is null or undefined');
  }

  for (const field of requiredFields) {
    if (!(field in response)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return true;
};

/**
 * Handle timeout for async operations
 * @param {Promise} promise - Promise to wrap with timeout
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<*>} Result or timeout error
 */
export const withTimeout = (promise, timeoutMs = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
};

export default {
  parseError,
  logError,
  getErrorMessage,
  retryWithExponentialBackoff,
  validateResponse,
  withTimeout,
  ERROR_CATEGORIES,
};
