/**
 * ProductListScreen Component
 * Main screen for displaying and managing products
 */

import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const ProductListScreen = ({ navigation }) => {
  const { products, loading, refreshing, onRefresh } = useProducts();

  const renderItem = ({ item }) => (
    <ProductCard
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
