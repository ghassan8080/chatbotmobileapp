/**
 * App Configuration
 * Centralized application settings and configurations
 */

// App Settings
export const APP_CONFIG = {
  appName: 'إدارة المنتجات',
  appVersion: '1.0.0',
  defaultLanguage: 'ar',
  supportedLanguages: ['ar'],
};

// UI Configuration
export const UI_CONFIG = {
  animationDuration: 300,
  modalAnimationDuration: 200,
  toastDuration: 3000,
  debounceDelay: 500,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  API_KEY: 'api_key',
  PRODUCTS_CACHE: 'products_cache',
  LAST_SYNC_TIME: 'last_sync_time',
};

// Pagination Settings
export const PAGINATION_CONFIG = {
  initialPageSize: 20,
  pageSizeIncrement: 10,
  maxPageSize: 100,
};

// Product Form Configuration
export const PRODUCT_FORM_CONFIG = {
  maxImages: 4,
  maxNameLength: 100,
  maxDescriptionLength: 500,
  minPrice: 0,
  maxPrice: 999999,
};
