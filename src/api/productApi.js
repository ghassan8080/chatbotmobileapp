/**
 * Product API
 * API service for product-related operations
 */

import apiClient from './apiClient';
import { API_BASE_URL, API_ENDPOINTS, API_CONFIG } from '../config/apiConfig';

// Force the correct endpoint for product fetching
const CORRECT_GET_PRODUCTS_URL = 'https://n8n-n8n.17m6co.easypanel.host/webhook/Respond%20immediately';

// ...existing code...

/**
 * Get all products
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
  try {
    // Use the correct deployed endpoint for GET_PRODUCTS
    const response = await apiClient.post(
      CORRECT_GET_PRODUCTS_URL,
      {},
      API_CONFIG
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

    const response = await apiClient.post(API_BASE_URL, payload);
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

    const response = await apiClient.post(API_BASE_URL, payload);
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
    const response = await apiClient.post(API_BASE_URL, payload);
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
    const response = await apiClient.get(`${API_BASE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};
