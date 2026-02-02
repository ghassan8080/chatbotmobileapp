/**
 * Formatters
 * Utility functions for data formatting
 */

import { STRINGS } from '../constants/strings';

/**
 * Format price with currency
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  const formattedPrice = parseFloat(price).toFixed(2);
  return `${formattedPrice} ${STRINGS.currency}`;
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate text if it exceeds a certain length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format file size to human-readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format image URL with size parameters
 * @param {string} url - Original image URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} Formatted image URL
 */
export const formatImageUrl = (url, width = 300, height = 300) => {
  if (!url) return null;

  // Check if URL already has query parameters
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&h=${height}`;
};

/**
 * Format product data for display
 * @param {Object} product - Product data
 * @returns {Object} Formatted product data
 */
export const formatProductForDisplay = (product) => {
  const images = [];

  // Collect all image URLs
  for (let i = 1; i <= 4; i++) {
    const imageField = `image_url_${i}`;
    if (product[imageField]) {
      images.push(product[imageField]);
    }
  }

  return {
    ...product,
    price: formatPrice(product.price),
    images,
    hasImages: images.length > 0,
  };
};

/**
 * Format error message for display
 * @param {Error|string} error - Error object or string
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;

  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;

    if (data && data.message) {
      return data.message;
    }

    switch (status) {
      case 400:
        return 'Invalid request';
      case 401:
        return 'Unauthorized access';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error';
      default:
        return 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response received
    return 'Network error';
  } else {
    // Error in request setup
    return error.message || 'An unknown error occurred';
  }
};
