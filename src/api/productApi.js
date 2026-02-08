/**
 * Product API
 * API service for product-related operations
 */

import apiClient from './apiClient';
import { API_ENDPOINTS, API_CONFIG } from '../config/apiConfig';

import { getUserId } from '../services/authService';

/**
 * Get all products
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
  try {
    const userId = await getUserId();
    
    // Use centralized endpoint configuration
    const response = await apiClient.get(
      API_ENDPOINTS.GET_PRODUCTS,
      {
        ...API_CONFIG,
        params: { user_id: userId }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Add a new product
 * @param {Object} productData - Product data
 * @param {string} productData.name - Product name
 * @param {string} productData.description - Product description
 * @param {number} productData.price - Product price
 * @param {Array} productData.images - Array of image URLs
 * @returns {Promise<Object>} Response data
 */
export const addProduct = async (productData) => {
  try {
    const payload = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      images: productData.images || [],
    };

    const response = await apiClient.post(API_ENDPOINTS.ADD_PRODUCT, payload);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 * @param {Object} productData - Product data
 * @param {number} productData.id - Product ID
 * @param {string} productData.name - Product name
 * @param {string} productData.description - Product description
 * @param {number} productData.price - Product price
 * @param {Array} productData.images - Array of image URLs
 * @returns {Promise<Object>} Response data
 */
export const updateProduct = async (productData) => {
  try {
    const payload = {
      product_id: productData.id,
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      images: productData.images || [],
    };

    const response = await apiClient.post(API_ENDPOINTS.UPDATE_PRODUCT, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Response data
 */
export const deleteProduct = async (productId) => {
  try {
    const payload = { product_id: productId };
    const response = await apiClient.post(API_ENDPOINTS.DELETE_PRODUCT, payload);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Get product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product data
 */
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.GET_PRODUCTS}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};
