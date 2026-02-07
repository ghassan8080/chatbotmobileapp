/**
 * Auth API
 * Handles login and authentication-related API calls
 */

import axios from 'axios';
import { API_ENDPOINTS, API_TIMEOUT } from '../config/apiConfig';

// Login endpoint bypasses the regular apiClient to avoid token requirement
export const loginRequest = async (credentials) => {
  try {
    const response = await axios.post(API_ENDPOINTS.LOGIN, credentials, {
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during login request:', error);
    throw error;
  }
};
