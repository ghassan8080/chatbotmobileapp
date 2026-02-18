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
  /**
   * Sort orders: pending (unconfirmed) first, then by date descending (newest first)
   */
  const sortOrders = (ordersArray) => {
    return [...ordersArray].sort((a, b) => {
      const aIsPending = (a.status?.toLowerCase() === 'pending' || a.status?.toLowerCase() === 'قيد الانتظار');
      const bIsPending = (b.status?.toLowerCase() === 'pending' || b.status?.toLowerCase() === 'قيد الانتظار');

      // Pending orders come first
      if (aIsPending && !bIsPending) return -1;
      if (!aIsPending && bIsPending) return 1;

      // Within same group, sort by date descending (newest first)
      const aDate = new Date(a.created_at || a.order_date || 0).getTime();
      const bDate = new Date(b.created_at || b.order_date || 0).getTime();
      return bDate - aDate;
    });
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedOrders = await getOrders();
      setOrders(sortOrders(fetchedOrders || []));
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
      setOrders(sortOrders(fetchedOrders || []));
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
