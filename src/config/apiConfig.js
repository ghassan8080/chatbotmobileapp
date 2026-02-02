/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

// API Base URL
import { Platform } from 'react-native';

// API Base URL
// On web, use relative path to allow proxying. On native, use full URL.
// Allow overriding the base URL from environment for different tenants/environments
const ENV_API_BASE = (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) || null;
export const API_BASE_URL = ENV_API_BASE || (Platform.OS === 'web' ? '/webhook' : 'https://n8n-n8n.17m6co.easypanel.host/webhook');

// API Key - This should be stored securely in production
export const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0Yzk3OTdmMS04ODE5LTRjMDYtYjFjMy05OWYwNzliOGY0MDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY5MzE2NzU0LCJleHAiOjE3NzE4MjI4MDB9.ei_MWQ2OEt8jNc0Pg9K2RWVCaltHeeqjsqdjHFaY_90';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoint
  LOGIN: 'https://n8n-n8n.17m6co.easypanel.host/webhook/login',
  // Standardized endpoints for multi-tenant n8n webhooks
  GET_PRODUCTS: `${API_BASE_URL}/get-products`,
  ADD_PRODUCT: `${API_BASE_URL}/add-product`,
  UPDATE_PRODUCT: `${API_BASE_URL}/update-product`,
  DELETE_PRODUCT: `${API_BASE_URL}/delete-product`,
};

// API Request Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds timeout
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

// Image Upload Configuration
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
