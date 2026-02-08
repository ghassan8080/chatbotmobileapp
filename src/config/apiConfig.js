/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 * 
 * SECURITY NOTE: All sensitive values should come from environment variables
 * using EXPO_PUBLIC_* prefix for React Native Expo
 */

import { Platform } from 'react-native';

// ===== API BASE URL & AUTHENTICATION =====
// Use environment variables with EXPO_PUBLIC_ prefix (safe for client-side)
// Environment variable: EXPO_PUBLIC_API_BASE_URL
// Always use the explicit API base URL from environment
export const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://n8n-n8n.17m6co.easypanel.host/webhook';

if (!API_BASE_URL) {
  console.warn('⚠️ WARNING: EXPO_PUBLIC_API_BASE_URL not configured. API calls will fail.');
}

// API Key (JWT Token)
// Environment variable: EXPO_PUBLIC_API_KEY
// IMPORTANT: This should be a read-only API key with minimal permissions
// Never commit production API keys to repository
export const API_KEY = process.env.EXPO_PUBLIC_API_KEY || null;

if (!API_KEY) {
  console.warn('⚠️ WARNING: EXPO_PUBLIC_API_KEY not configured. API calls will fail.');
}

// API Timeout Configuration
// Environment variable: EXPO_PUBLIC_API_TIMEOUT (in milliseconds)
export const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000', 10);

// ===== API ENDPOINTS =====
// All endpoints are relative to API_BASE_URL for flexibility
// Can be customized via environment variables if needed
const LOGIN_ENDPOINT = process.env.EXPO_PUBLIC_LOGIN_ENDPOINT || '/login';
const LOGOUT_ENDPOINT = process.env.EXPO_PUBLIC_LOGOUT_ENDPOINT || '/logout';
const GET_PRODUCTS_ENDPOINT = process.env.EXPO_PUBLIC_GET_PRODUCTS_ENDPOINT || '/products';
const ADD_PRODUCT_ENDPOINT = process.env.EXPO_PUBLIC_ADD_PRODUCT_ENDPOINT || '/add-product';
const UPDATE_PRODUCT_ENDPOINT = process.env.EXPO_PUBLIC_UPDATE_PRODUCT_ENDPOINT || '/update-product';
const DELETE_PRODUCT_ENDPOINT = process.env.EXPO_PUBLIC_DELETE_PRODUCT_ENDPOINT || '/delete-product';
const ORDERS_ENDPOINT = process.env.EXPO_PUBLIC_ORDERS_ENDPOINT || '/orders';
const UPDATE_ORDER_STATUS_ENDPOINT = process.env.EXPO_PUBLIC_UPDATE_ORDER_STATUS_ENDPOINT || '/update-order-status';

export const API_ENDPOINTS = {
  // Authentication endpoint - uses full URL because login happens before we have auth
  LOGIN: API_BASE_URL ? `${API_BASE_URL}${LOGIN_ENDPOINT}` : null,
  LOGOUT: API_BASE_URL ? `${API_BASE_URL}${LOGOUT_ENDPOINT}` : null,
  
  // Product endpoints
  GET_PRODUCTS: API_BASE_URL ? `${API_BASE_URL}${GET_PRODUCTS_ENDPOINT}` : null,
  ADD_PRODUCT: API_BASE_URL ? `${API_BASE_URL}${ADD_PRODUCT_ENDPOINT}` : null,
  UPDATE_PRODUCT: API_BASE_URL ? `${API_BASE_URL}${UPDATE_PRODUCT_ENDPOINT}` : null,
  DELETE_PRODUCT: API_BASE_URL ? `${API_BASE_URL}${DELETE_PRODUCT_ENDPOINT}` : null,
  
  // Order endpoints
  ORDERS: API_BASE_URL ? `${API_BASE_URL}${ORDERS_ENDPOINT}` : null,
  UPDATE_ORDER_STATUS: API_BASE_URL ? `${API_BASE_URL}${UPDATE_ORDER_STATUS_ENDPOINT}` : null,
};

// API Request Configuration
// Uses environment variables for timeout and API key
export const API_CONFIG = {
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  multipartConfig: {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-api-key': API_KEY,
    },
  },
};

// ===== ENVIRONMENT & FEATURE FLAGS =====
export const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';
export const DEBUG_LOGGING = process.env.EXPO_PUBLIC_DEBUG_LOGGING === 'true';
export const TOKEN_EXPIRY_MINUTES = parseInt(process.env.EXPO_PUBLIC_TOKEN_EXPIRY_MINUTES || '1440', 10);
export const AUTO_REFRESH_TOKEN = process.env.EXPO_PUBLIC_AUTO_REFRESH_TOKEN !== 'false';
export const MULTI_TENANT_ENABLED = process.env.EXPO_PUBLIC_MULTI_TENANT_ENABLED !== 'false';

// ===== IMAGE CONFIGURATION =====
export const IMAGE_UPLOAD_CONFIG = {
  maxImages: 4,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  quality: 0.8, // Compression quality
};

// Image Picker Options
export const IMAGE_PICKER_OPTIONS = {
  mediaTypes: 'Images',
  quality: 0.8,
  allowsEditing: true,
  aspect: [4, 3],
  base64: true, // Request base64 directly
};
