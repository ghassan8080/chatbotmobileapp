/**
 * AuthContext
 * Centralized auth state (multi-tenant): user, token, login, logout
 */

import React, { createContext, useState, useEffect } from 'react';
import { storeUserToken, getUserToken, storeUserId, getUserId, clearAuthData } from '../services/authService';
import { subscribeAuth } from '../services/authEvents';
import { loginRequest } from '../api/authApi';
import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to hydrate token and user on startup
    (async () => {
      try {
        const t = await getUserToken();
        const u = await getUserId();
        if (t && u) {
          setToken(t);
          setUser({ id: u });
        }
      } catch (e) {
        console.error('Error hydrating auth state:', e);
      } finally {
        setLoading(false);
      }
    })();
    // subscribe to external auth events (e.g., apiClient triggered logout)
    const unsubscribe = subscribeAuth((event) => {
      if (event === 'logout') {
        setToken(null);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials) => {
    // Call backend login - backend must return { user_id, token }
    const data = await loginRequest(credentials);
    if (!data || !data.token || !data.user_id) throw new Error('Invalid login response');

    await storeUserToken(data.token);
    await storeUserId(String(data.user_id));
    setToken(data.token);
    setUser({ id: String(data.user_id) });
    return data;
  };

  const logout = async () => {
    console.log('Logout initiated in AuthContext');
    try {
      // Call server-side logout webhook if available
      if (API_ENDPOINTS.LOGOUT) {
         console.log('Calling server logout:', API_ENDPOINTS.LOGOUT);
         try {
           await apiClient.post(API_ENDPOINTS.LOGOUT, {});
           console.log('Server logout successful');
         } catch (apiError) {
           console.warn('Server logout failed, proceeding with local logout:', apiError);
         }
      }
      
      await clearAuthData();
      console.log('Local auth data cleared');
    } catch (e) {
      console.error('Error clearing auth during logout:', e);
    }
    setToken(null);
    setUser(null);
    console.log('Auth state reset');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
