/**
 * Authentication Service
 * Service for handling authentication and authorization
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../config/appConfig';
import { storeApiKey, getApiKey } from './storageService';
import { emitAuth } from './authEvents';

// Secure store keys
const SECURE_STORE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_ID: 'user_id',
  API_KEY: 'api_key',
};

/**
 * Store user token securely
 * @param {string} token - User token
 * @returns {Promise<void>}
 */
export const storeUserToken = async (token) => {
  try {
    if (Platform.OS === 'web' || !SecureStore || typeof SecureStore.setItemAsync !== 'function') {
      // fallback for web: use localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SECURE_STORE_KEYS.USER_TOKEN, token);
        return;
      }
    }

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.USER_TOKEN, token);
  } catch (error) {
    console.error('Error storing user token:', error);
    throw error;
  }
};

/**
 * Store user id securely
 * @param {string} userId
 */
export const storeUserId = async (userId) => {
  try {
    if (Platform.OS === 'web' || !SecureStore || typeof SecureStore.setItemAsync !== 'function') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SECURE_STORE_KEYS.USER_ID, userId);
        return;
      }
    }

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.USER_ID, userId);
  } catch (error) {
    console.error('Error storing user id:', error);
    throw error;
  }
};

/**
 * Retrieve user token
 * @returns {Promise<string|null>} User token or null if not found
 */
export const getUserToken = async () => {
  try {
    if (Platform.OS === 'web' || !SecureStore || typeof SecureStore.getItemAsync !== 'function') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(SECURE_STORE_KEYS.USER_TOKEN);
      }
    }

    return await SecureStore.getItemAsync(SECURE_STORE_KEYS.USER_TOKEN);
  } catch (error) {
    console.error('Error retrieving user token:', error);
    throw error;
  }
};

/**
 * Retrieve stored user id
 * @returns {Promise<string|null>}
 */
export const getUserId = async () => {
  try {
    if (Platform.OS === 'web' || !SecureStore || typeof SecureStore.getItemAsync !== 'function') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(SECURE_STORE_KEYS.USER_ID);
      }
    }

    return await SecureStore.getItemAsync(SECURE_STORE_KEYS.USER_ID);
  } catch (error) {
    console.error('Error retrieving user id:', error);
    throw error;
  }
};

/**
 * Store API key securely
 * @param {string} apiKey - API key
 * @returns {Promise<void>}
 */
export const storeSecureApiKey = async (apiKey) => {
  try {
    if (Platform.OS === 'web' || !SecureStore || typeof SecureStore.setItemAsync !== 'function') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SECURE_STORE_KEYS.API_KEY, apiKey);
      }
    } else {
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.API_KEY, apiKey);
    }
    // Also store in AsyncStorage for easier access (non-sensitive)
    await storeApiKey(apiKey);
  } catch (error) {
    console.error('Error storing API key:', error);
    throw error;
  }
};

/**
 * Retrieve API key from secure storage
 * @returns {Promise<string|null>} API key or null if not found
 */
export const getSecureApiKey = async () => {
  try {
    // Try secure storage first
    let apiKey = null;
    if (Platform.OS === 'web' || !SecureStore || typeof SecureStore.getItemAsync !== 'function') {
      if (typeof window !== 'undefined' && window.localStorage) {
        apiKey = window.localStorage.getItem(SECURE_STORE_KEYS.API_KEY);
      }
    } else {
      apiKey = await SecureStore.getItemAsync(SECURE_STORE_KEYS.API_KEY);
    }

    // Fall back to AsyncStorage if not found
    if (!apiKey) {
      apiKey = await getApiKey();
    }

    return apiKey;
  } catch (error) {
    console.error('Error retrieving API key:', error);
    throw error;
  }
};

/**
 * Clear all authentication data
 * @returns {Promise<void>}
 */
export const clearAuthData = async () => {
  try {
    if (Platform.OS === 'web' || !SecureStore || typeof SecureStore.deleteItemAsync !== 'function') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(SECURE_STORE_KEYS.USER_TOKEN);
        window.localStorage.removeItem(SECURE_STORE_KEYS.API_KEY);
        window.localStorage.removeItem(SECURE_STORE_KEYS.USER_ID);
      }
    } else {
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER_TOKEN);
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.API_KEY);
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER_ID);
    }
    // notify listeners (e.g., AuthProvider) that auth was cleared
    try {
      emitAuth('logout', null);
    } catch (e) {
      // ignore
    }
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  try {
    const token = await getUserToken();
    const apiKey = await getSecureApiKey();
    return !!(token || apiKey);
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Initialize authentication with API key
 * @param {string} apiKey - API key to use for authentication
 * @returns {Promise<void>}
 */
export const initializeAuth = async (apiKey) => {
  try {
    await storeSecureApiKey(apiKey);
  } catch (error) {
    console.error('Error initializing authentication:', error);
    throw error;
  }
};
