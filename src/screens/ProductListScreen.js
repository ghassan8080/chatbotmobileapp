/**
 * ProductListScreen Component
 * Main screen for displaying and managing products
 */

import React, { useContext, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert, Platform, Animated } from 'react-native';
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
import { getErrorMessage } from '../services/errorHandler';

import { NotificationContext } from '../context/NotificationContext';

const ProductListScreen = ({ navigation }) => {
  const { products, loading, refreshing, onRefresh, removeProduct } = useProducts();
  const { logout } = useContext(AuthContext);
  const { pendingCount } = useContext(NotificationContext);
  const fabScale = useRef(new Animated.Value(1)).current;

  const handleFabPressIn = () => {
    Animated.spring(fabScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
        const confirmed = window.confirm(STRINGS.logoutConfirm);
        if (confirmed) {
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
                logout();
            },
            style: 'destructive',
        },
        ]);
    }
  };

  const handleDelete = (product) => {
    const productId = product.id || product.product_id || product._id;

    if (!productId) {
      Alert.alert('Error', 'Cannot delete product: Invalid ID');
      return;
    }

    const performDelete = async () => {
      try {
        await removeProduct(productId);
      } catch (error) {
        const userMessage = getErrorMessage(error, 'ProductListScreen:handleDelete');
        Alert.alert(STRINGS.error || 'Error', userMessage);
      }
    };

    if (Platform.OS === 'web') {
        if (window.confirm(STRINGS.deleteMessage || 'Are you sure you want to delete this product?')) {
            performDelete();
        }
    } else {
        Alert.alert(
            STRINGS.deleteConfirm || 'Delete Product',
            STRINGS.deleteMessage || 'Are you sure you want to delete this product?',
            [
                { 
                    text: STRINGS.cancel, 
                    style: 'cancel',
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
          icon: 'log-out-outline',
          onPress: handleLogout,
        }}
        rightAction={{
          icon: 'notifications-outline',
          label: pendingCount > 0 ? String(pendingCount) : null,
          textColor: pendingCount > 0 ? COLORS.error : null,
          onPress: () => navigation.navigate(SCREEN_NAMES.ORDERS_LIST),
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
        activeOpacity={1}
        onPressIn={handleFabPressIn}
        onPressOut={handleFabPressOut}
      >
        <Animated.View style={[styles.fabInner, { transform: [{ scale: fabScale }] }]}>
          <Ionicons name="add" size={28} color={COLORS.white} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
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
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8, // Increased elevation
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
});

export default ProductListScreen;
