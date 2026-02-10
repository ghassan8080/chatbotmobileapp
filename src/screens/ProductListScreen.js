/**
 * ProductListScreen Component
 * Main screen for displaying and managing products
 */

import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
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
    console.log('🔴 DELETE ACTION TRIGGERED', product);
    const productId = product.id || product.product_id || product._id;
    console.log('🔴 Target Product ID:', productId);

    if (!productId) {
      console.error('❌ Error: No valid product ID found to delete');
      Alert.alert('Error', 'Cannot delete product: Invalid ID');
      return;
    }

    const performDelete = async () => {
      console.log('🔴 CONFIRMED: Proceeding with delete for ID:', productId);
      try {
        await removeProduct(productId);
        console.log('✅ Delete operation completed successfully');
      } catch (error) {
        console.error('❌ Delete operation failed:', error);
        Alert.alert(STRINGS.error || 'Error', error.message);
      }
    };

    if (Platform.OS === 'web') {
        if (window.confirm(STRINGS.deleteMessage || 'Are you sure you want to delete this product?')) {
            performDelete();
        } else {
            console.log('⚪ Delete cancelled by user (Web)');
        }
    } else {
        Alert.alert(
            STRINGS.deleteConfirm || 'Delete Product',
            STRINGS.deleteMessage || 'Are you sure you want to delete this product?',
            [
                { 
                    text: STRINGS.cancel, 
                    style: 'cancel',
                    onPress: () => console.log('⚪ Delete cancelled by user (Mobile)')
                },
                {
                    text: STRINGS.delete || 'Delete',
                    style: 'destructive',
                    onPress: performDelete,
                },
            ]
        );
    }
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
      <ScreenHeader
        title={STRINGS.products}
        leftAction={{
          icon: 'receipt-outline',
          label: STRINGS.myOrders,
          onPress: () => navigation.navigate(SCREEN_NAMES.ORDERS_LIST),
        }}
        rightAction={{
          icon: 'log-out-outline',
          label: STRINGS.logout,
          onPress: handleLogout,
        }}
      />

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
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title={STRINGS.noProducts || 'لا توجد منتجات'}
              subtitle="قم بإضافة منتج جديد للبدء"
              actionLabel={STRINGS.addProduct}
              actionIcon="add-circle-outline"
              onAction={() => navigation.navigate(SCREEN_NAMES.PRODUCT_FORM)}
            />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate(SCREEN_NAMES.PRODUCT_FORM)}
        activeOpacity={0.8}
      >
        <View style={styles.fabInner}>
          <Ionicons name="add" size={28} color={COLORS.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
  },
  fabInner: {
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.primaryLight + '40',
  },
});

export default ProductListScreen;
