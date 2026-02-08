/**
 * ProductListScreen Component
 * Main screen for displaying and managing products
 */

import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { SCREEN_NAMES } from '../constants/constants';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { AuthContext } from '../context/AuthContext';

const ProductListScreen = ({ navigation }) => {
  const { products, loading, refreshing, onRefresh, removeProduct } = useProducts();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    console.log('🔴 PRODUCT SCREEN LOGOUT CHECK');
    
    if (Platform.OS === 'web') {
        const confirmed = window.confirm(STRINGS.logoutConfirm);
        if (confirmed) {
            console.log('User confirmed logout (Web)');
            logout();
        }
    } else {
        Alert.alert(STRINGS.logoutConfirm, '', [
        {
            text: STRINGS.cancel,
            style: 'cancel',
        },
        {
            text: STRINGS.logout,
            onPress: () => {
                console.log('User confirmed logout (Native)');
                logout();
            },
            style: 'destructive',
        },
        ]);
    }
  };

  const handleDelete = (product) => {
    Alert.alert(
      STRINGS.deleteConfirm || 'Delete Product',
      STRINGS.deleteMessage || 'Are you sure you want to delete this product?',
      [
        { text: STRINGS.cancel, style: 'cancel' },
        {
          text: STRINGS.delete || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeProduct(product.id || product.product_id || product._id);
            } catch (error) {
              Alert.alert(STRINGS.error || 'Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate(SCREEN_NAMES.PRODUCT_DETAIL, { product: item })}
      onEdit={() => navigation.navigate(SCREEN_NAMES.PRODUCT_FORM, { product: item })}
      onDelete={() => handleDelete(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate(SCREEN_NAMES.ORDERS_LIST)}
        >
          <Ionicons name="receipt" size={20} color={COLORS.white} />
          <Text style={styles.headerButtonText}>{STRINGS.myOrders}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{STRINGS.products}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{STRINGS.logout}</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <LoadingSpinner text={STRINGS.loadingProducts} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id || item.product_id || item._id || item.name || Math.random())}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{STRINGS.noProducts || 'No products available'}</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate(SCREEN_NAMES.PRODUCT_FORM)}
      >
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary || '#007AFF', // Fallback color
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 3,
    paddingTop: 40, // Safe area approximate
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
  },
  headerButtonText: {
    color: COLORS.white || '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white || '#fff',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  logoutButtonText: {
    color: COLORS.white || '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    backgroundColor: COLORS.primary || '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  }
});

export default ProductListScreen;
