/**
 * ProductListScreen Component
 * Main screen for displaying and managing products
 */

import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { SCREEN_NAMES } from '../constants/constants';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { AuthContext } from '../context/AuthContext';

const ProductListScreen = ({ navigation }) => {
  const { products, loading, refreshing, onRefresh } = useProducts();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert(STRINGS.logoutConfirm, '', [
      {
        text: STRINGS.cancel,
        onPress: () => console.log('Logout cancelled'),
        style: 'cancel',
      },
      {
        text: STRINGS.logout,
        onPress: async () => {
       /* Header with navigation buttons */}
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

      {loading ? (
        <LoadingSpinner text={STRINGS.loadingProducts} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id || item.product_id || item._id || item.name)}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate(SCREEN_NAMES.PRODUCT_FORM
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      onEdit={(p) => navigation.navigate('ProductForm', { product: p })}
      onDelete={(p) => navigation.navigate('ProductDetail', { product: p })}
    />
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingSpinner text={STRINGS.loadingProducts} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id || item.product_id || item._id || item.name)}
          renderItem={renderItem}
          refreshing={refreshing}
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 3,
  },
  headerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    marginRight: 8,
  },
  headerButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    marginLeft: 8,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ProductForm')}>
        <Text style={styles.fabText}>{STRINGS.addProduct}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    elevation: 6,
  },
  fabText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});

export default ProductListScreen;
