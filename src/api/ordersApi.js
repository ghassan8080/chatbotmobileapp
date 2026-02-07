/**
 * Orders API
 * API service for order-related operations
 */

import apiClient from './apiClient';
import { getUserId } from '../services/authService';
import { API_ENDPOINTS } from '../config/apiConfig';

/**
 * Get all orders for the current user
 * @returns {Promise<Array>} Array of orders
 */
export const getOrders = async () => {
  try {
    // Retrieve user_id from secure storage
    const userId = await getUserId();
    if (!userId) {
      console.warn('⚠️ No user_id found in storage');
      throw new Error('User ID not found');
    }

    // Build URL with user_id query parameter for multi-tenant filtering
    const url = `${API_ENDPOINTS.ORDERS}?user_id=${userId}`;
    
    console.log('📥 Fetching orders with URL:', url);
    
    // Use GET to fetch orders
    const response = await apiClient.get(url);
    
    const data = response.data;
    
    console.log('📥 Raw response from GET /orders:', data);
    
    // Handle both response formats:
    // 1. { success: true, count: X, orders: [...] }
    // 2. Direct array [...]
    if (Array.isArray(data)) {
      console.log('✅ Response is direct array, items:', data.length);
      return data;
    } else if (data.orders && Array.isArray(data.orders)) {
      console.log('✅ Response has orders array, items:', data.orders.length);
      return data.orders;
    } else if (data.success && data.orders) {
      console.log('✅ Response has orders in success object, items:', data.orders.length);
      return data.orders;
    }
    
    // Return empty array if no orders found
    console.log('⚠️ No orders found in response');
    return [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message || 'Failed to fetch orders');
  }
};

/**
 * Get a single order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User ID not found');
    }

    const url = `${API_ENDPOINTS.ORDERS}/${orderId}?user_id=${userId}`;
    
    console.log('📥 Fetching order:', url);
    
    const response = await apiClient.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error(error.message || 'Failed to fetch order');
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID to update
 * @param {string} newStatus - New status (confirmed, delivered, cancelled, etc.)
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User ID not found');
    }

    const payload = {
      order_id: orderId,
      new_status: newStatus,
      user_id: userId,
    };

    console.log('📤 Updating order status:', payload);

    // Use centralized endpoint configuration
    const response = await apiClient.post(API_ENDPOINTS.UPDATE_ORDER_STATUS, payload);

    console.log('✅ Order status updated:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(error.message || 'Failed to update order status');
  }
};
