/**
 * Upload API
 * API service for image upload operations
 */

import apiClient from './apiClient';
import { API_ENDPOINTS, IMAGE_UPLOAD_CONFIG } from '../config/apiConfig';

/**
 * Upload a single image
 * @param {Object} file - File object from image picker
 * @returns {Promise<Object>} Response data with image URL
 */
export const uploadImage = async (file) => {
  try {
    // Validate image type
    if (!IMAGE_UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
      throw new Error('Invalid image type');
    }

    // Validate image size
    if (file.size > IMAGE_UPLOAD_CONFIG.maxImageSize) {
      throw new Error('Image size exceeds limit');
    }

    // Create form data
    const formData = new FormData();
    formData.append('image', {
      uri: file.uri,
      type: file.type,
      name: file.name || `image_${Date.now()}.jpg`,
    });

    // Create a new axios instance for multipart upload
    const uploadClient = apiClient.create();
    uploadClient.defaults.headers = {
      'Content-Type': 'multipart/form-data',
    };

    // Upload image
    const response = await uploadClient.post(API_ENDPOINTS.UPLOAD_IMAGE, formData);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param {Array} files - Array of file objects
 * @returns {Promise<Array>} Array of image URLs
 */
export const uploadImages = async (files) => {
  try {
    // Filter out null/undefined files
    const validFiles = files.filter(file => file !== null && file !== undefined);

    // Validate number of images
    if (validFiles.length > IMAGE_UPLOAD_CONFIG.maxImages) {
      throw new Error(`Maximum ${IMAGE_UPLOAD_CONFIG.maxImages} images allowed`);
    }

    // Upload all images in parallel
    const uploadPromises = validFiles.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    // Extract image URLs from results
    return results.map(result => result.url);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Convert image to base64 (for small images only)
 * @param {Object} file - File object
 * @returns {Promise<string>} Base64 string
 */
export const imageToBase64 = async (file) => {
  try {
    // Only convert small images to base64
    if (file.size > 1024 * 1024) { // 1MB
      throw new Error('Image too large for base64 conversion');
    }

    // Read file as data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};
