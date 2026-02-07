/**
 * Session Management Service
 * Handles token expiration, refresh logic, and session timeouts
 */

import {
  storeUserToken,
  getUserToken,
  clearAuthData,
  getUserId,
} from './authService';
import { logError, ERROR_CATEGORIES } from './errorHandler';
import { TOKEN_EXPIRY_MINUTES, AUTO_REFRESH_TOKEN } from '../config/apiConfig';

/**
 * Session storage keys
 */
const SESSION_KEYS = {
  TOKEN_TIMESTAMP: 'token_timestamp',
  SESSION_START: 'session_start',
  LAST_ACTIVITY: 'last_activity',
};

/**
 * Check if token has expired
 * @returns {Promise<boolean>} True if token expired
 */
export const isTokenExpired = async () => {
  try {
    const tokenTimestamp = localStorage.getItem(SESSION_KEYS.TOKEN_TIMESTAMP);
    if (!tokenTimestamp) return true;

    const expiryTime = parseInt(tokenTimestamp, 10) + TOKEN_EXPIRY_MINUTES * 60 * 1000;
    return Date.now() > expiryTime;
  } catch (error) {
    logError('SessionManager.isTokenExpired', error);
    return true;
  }
};

/**
 * Record token creation time
 * @returns {void}
 */
export const recordTokenTimestamp = () => {
  try {
    localStorage.setItem(SESSION_KEYS.TOKEN_TIMESTAMP, Date.now().toString());
  } catch (error) {
    logError('SessionManager.recordTokenTimestamp', error);
  }
};

/**
 * Check if session has been inactive for too long
 * @param {number} inactivityTimeoutMs - Inactivity timeout in milliseconds
 * @returns {boolean} True if session is inactive
 */
export const isSessionInactive = (inactivityTimeoutMs = 30 * 60 * 1000) => {
  try {
    const lastActivity = localStorage.getItem(SESSION_KEYS.LAST_ACTIVITY);
    if (!lastActivity) {
      recordLastActivity();
      return false;
    }

    const lastActivityTime = parseInt(lastActivity, 10);
    return Date.now() - lastActivityTime > inactivityTimeoutMs;
  } catch (error) {
    logError('SessionManager.isSessionInactive', error);
    return false;
  }
};

/**
 * Record user activity (for inactivity timeout)
 * @returns {void}
 */
export const recordLastActivity = () => {
  try {
    localStorage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString());
  } catch (error) {
    logError('SessionManager.recordLastActivity', error);
  }
};

/**
 * Get session details
 * @returns {Promise<Object>} Session information
 */
export const getSessionInfo = async () => {
  try {
    const token = await getUserToken();
    const userId = await getUserId();
    const tokenTimestamp = localStorage.getItem(SESSION_KEYS.TOKEN_TIMESTAMP);
    const sessionStart = localStorage.getItem(SESSION_KEYS.SESSION_START);

    return {
      isAuthenticated: !!token,
      userId,
      tokenExpiresAt: tokenTimestamp ? new Date(parseInt(tokenTimestamp, 10) + TOKEN_EXPIRY_MINUTES * 60 * 1000) : null,
      sessionStartedAt: sessionStart ? new Date(parseInt(sessionStart, 10)) : null,
      isExpired: await isTokenExpired(),
    };
  } catch (error) {
    logError('SessionManager.getSessionInfo', error);
    return {
      isAuthenticated: false,
      userId: null,
      tokenExpiresAt: null,
      sessionStartedAt: null,
      isExpired: true,
    };
  }
};

/**
 * Initialize session
 * @param {string} token - Auth token
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const initializeSession = async (token, userId) => {
  try {
    await storeUserToken(token);
    recordTokenTimestamp();
    localStorage.setItem(SESSION_KEYS.SESSION_START, Date.now().toString());
    recordLastActivity();
  } catch (error) {
    logError('SessionManager.initializeSession', error);
    throw error;
  }
};

/**
 * End session (logout)
 * @returns {Promise<void>}
 */
export const endSession = async () => {
  try {
    await clearAuthData();
    localStorage.removeItem(SESSION_KEYS.TOKEN_TIMESTAMP);
    localStorage.removeItem(SESSION_KEYS.SESSION_START);
    localStorage.removeItem(SESSION_KEYS.LAST_ACTIVITY);
  } catch (error) {
    logError('SessionManager.endSession', error);
    throw error;
  }
};

/**
 * Check and handle token expiration
 * @returns {Promise<boolean>} True if token was expired and cleared
 */
export const checkTokenExpiration = async () => {
  try {
    const expired = await isTokenExpired();
    if (expired) {
      await endSession();
      return true;
    }
    return false;
  } catch (error) {
    logError('SessionManager.checkTokenExpiration', error);
    return true; // Default to expired on error
  }
};

/**
 * Validate session before API calls
 * Checks for token expiration and inactivity
 * @returns {Promise<{valid: boolean, reason: string|null}>}
 */
export const validateSession = async () => {
  try {
    // Check token expiration
    const tokenExpired = await isTokenExpired();
    if (tokenExpired) {
      await endSession();
      return {
        valid: false,
        reason: 'Token expired',
      };
    }

    // Check inactivity (30 minutes default)
    const inactive = isSessionInactive(30 * 60 * 1000);
    if (inactive) {
      await endSession();
      return {
        valid: false,
        reason: 'Session inactive',
      };
    }

    // Update last activity
    recordLastActivity();

    return {
      valid: true,
      reason: null,
    };
  } catch (error) {
    logError('SessionManager.validateSession', error);
    return {
      valid: false,
      reason: 'Session validation error',
    };
  }
};

/**
 * Refresh token (placeholder for actual token refresh implementation)
 * @returns {Promise<boolean>} True if refresh successful
 */
export const refreshToken = async () => {
  try {
    if (!AUTO_REFRESH_TOKEN) {
      return false;
    }

    // TODO: Implement actual token refresh logic
    // This would call the refresh endpoint from your n8n backend
    // For now, just update the token timestamp
    recordTokenTimestamp();
    return true;
  } catch (error) {
    logError('SessionManager.refreshToken', error);
    return false;
  }
};

export default {
  isTokenExpired,
  recordTokenTimestamp,
  isSessionInactive,
  recordLastActivity,
  getSessionInfo,
  initializeSession,
  endSession,
  checkTokenExpiration,
  validateSession,
  refreshToken,
};
