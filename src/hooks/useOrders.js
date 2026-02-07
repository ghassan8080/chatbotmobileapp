/**
 * useOrders Hook
 * Custom hook for managing order data
 */

import { useState, useEffect, useCallback } from 'react';
import { getOrders } from '../api/ordersApi';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch orders from API
   */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error in fetchOrders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh orders (pull to refresh)
   */
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders || []);
    } catch (err) {
      setError(err.message || 'Failed to refresh orders');
      console.error('Error in onRefresh:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refreshing,
    onRefresh,
    fetchOrders,
  };
};
