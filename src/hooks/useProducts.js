/**
 * useProducts Hook
 * Custom hook for managing product data
 */

import { useState, useEffect, useCallback } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../api/productApi';
import { getProductsCache, storeProductsCache } from '../services/storageService';
import { formatProductForDisplay } from '../utils/formatters';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch products from API or cache
   */
  const fetchProducts = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      let fetchedProducts = [];

      try {
        // Try to fetch from API
        fetchedProducts = await getProducts();

        // Store in cache
        await storeProductsCache(fetchedProducts);
      } catch (apiError) {
        console.error('Error fetching products from API:', apiError);

        // Fall back to cache if available
        if (useCache) {
          const cachedProducts = await getProductsCache();
          if (cachedProducts && cachedProducts.length > 0) {
            console.log('Using cached products');
            fetchedProducts = cachedProducts;
          } else {
            throw apiError;
          }
        } else {
          throw apiError;
        }
      }

      // Format products for display
      const formattedProducts = fetchedProducts.map(product => 
        formatProductForDisplay(product)
      );

      setProducts(formattedProducts);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error in fetchProducts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Add a new product
   */
  const addNewProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await addProduct(productData);

      // Refresh the product list
      await fetchProducts(false);

      return result;
    } catch (err) {
      setError(err.message || 'Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  /**
   * Update an existing product
   */
  const updateExistingProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await updateProduct(productData);

      // Refresh the product list
      await fetchProducts(false);

      return result;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  /**
   * Delete a product
   */
  const removeProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await deleteProduct(productId);

      // Refresh the product list
      await fetchProducts(false);

      return result;
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  /**
   * Refresh products
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(false);
  }, [fetchProducts]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refreshing,
    fetchProducts,
    addNewProduct,
    updateExistingProduct,
    removeProduct,
    onRefresh,
  };
};
