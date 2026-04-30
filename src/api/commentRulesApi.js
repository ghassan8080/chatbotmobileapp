/**
 * Comment Reply Rules API
 * API calls for managing comment reply rules
 */

import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '../config/apiConfig';

/**
 * Get all comment reply rules for a seller
 * @param {string|number} sellerId
 * @returns {Promise<Array>} List of rules
 */
export const getCommentRules = async (sellerId) => {
  if (!API_ENDPOINTS.COMMENT_REPLY_RULES_WEBHOOK) {
    throw new Error('Comment Reply Rules Webhook not configured');
  }

  try {
    const response = await axios.get(
      `${API_ENDPOINTS.COMMENT_REPLY_RULES_WEBHOOK}?seller_id=${sellerId}`,
      API_CONFIG
    );
    
    // Support { rules: [...] } or direct array
    if (response.data && Array.isArray(response.data.rules)) {
      return response.data.rules;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching comment reply rules:', error);
    throw error;
  }
};

/**
 * Add a new comment reply rule
 * @param {Object} ruleData { seller_id, platform, page_id, post_id, product_id, enabled, message_template }
 * @returns {Promise<Object>} API response
 */
export const addCommentRule = async (ruleData) => {
  if (!API_ENDPOINTS.COMMENT_REPLY_RULES_WEBHOOK) {
    throw new Error('Comment Reply Rules Webhook not configured');
  }

  try {
    const response = await axios.post(
      API_ENDPOINTS.COMMENT_REPLY_RULES_WEBHOOK,
      ruleData,
      API_CONFIG
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment reply rule:', error);
    throw error;
  }
};

/**
 * Delete a comment reply rule
 * @param {string|number} ruleId 
 * @returns {Promise<Object>} API response
 */
export const deleteCommentRule = async (ruleId) => {
  if (!API_ENDPOINTS.DELETE_COMMENT_REPLY_RULE_WEBHOOK) {
    throw new Error('Delete Comment Reply Rule Webhook not configured');
  }

  try {
    const response = await axios.post(
      API_ENDPOINTS.DELETE_COMMENT_REPLY_RULE_WEBHOOK,
      { rule_id: ruleId },
      API_CONFIG
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting comment reply rule:', error);
    throw error;
  }
};
