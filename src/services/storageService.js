/**
 * Storage Service
 * Service for handling local data storage using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/appConfig';

/**
 * Store data in AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {Promise<void>}
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

/**
 * Retrieve data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<any>} Parsed JSON value or null if not found
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<void>}
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

/**
 * Clear all data from AsyncStorage
 * @returns {Promise<void>}
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Store API key securely
 * @param {string} apiKey - API key to store
 * @returns {Promise<void>}
 */
export const storeApiKey = async (apiKey) => {
  try {
    await storeData(STORAGE_KEYS.API_KEY, apiKey);
  } catch (error) {
    console.error('Error storing API key:', error);
    throw error;
  }
};

/**
 * Retrieve API key
 * @returns {Promise<string|null>} API key or null if not found
 */
export const getApiKey = async () => {
  try {
    return await getData(STORAGE_KEYS.API_KEY);
  } catch (error) {
    console.error('Error retrieving API key:', error);
    throw error;
  }
};

/**
 * Store products cache
 * @param {Array} products - Array of products
 * @returns {Promise<void>}
 */
export const storeProductsCache = async (products) => {
  try {
    await storeData(STORAGE_KEYS.PRODUCTS_CACHE, products);
    await storeData(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
  } catch (error) {
    console.error('Error storing products cache:', error);
    throw error;
  }
};

/**
 * Retrieve products cache
 * @returns {Promise<Array|null>} Array of products or null if not found
 */
export const getProductsCache = async () => {
  try {
    return await getData(STORAGE_KEYS.PRODUCTS_CACHE);
  } catch (error) {
    console.error('Error retrieving products cache:', error);
    throw error;
  }
};

/**
 * Get last sync time
 * @returns {Promise<string|null>} ISO date string or null if not found
 */
export const getLastSyncTime = async () => {
  try {
    return await getData(STORAGE_KEYS.LAST_SYNC_TIME);
  } catch (error) {
    console.error('Error retrieving last sync time:', error);
    throw error;
  }
};
