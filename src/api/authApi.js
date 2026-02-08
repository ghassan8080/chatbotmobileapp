/**
 * Auth API
 * Handles login and authentication-related API calls
 */

import axios from 'axios';
import { API_ENDPOINTS, API_TIMEOUT } from '../config/apiConfig';

// Login endpoint bypasses the regular apiClient to avoid token requirement
export const loginRequest = async (credentials) => {
  console.log('LOGIN API CALLED with:', { 
    url: API_ENDPOINTS.LOGIN, 
    email: credentials.email 
  });

  try {
    const response = await axios.post(API_ENDPOINTS.LOGIN, credentials, {
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Login Response Status:', response.status);
    console.log('Login Response Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during login request:', error);
    if (error.response) {
        console.error('Error Response:', error.response.data);
        console.error('Error Status:', error.response.status);
    }
    throw error;
  }
};
