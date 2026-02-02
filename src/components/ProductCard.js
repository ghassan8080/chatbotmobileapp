/**
 * ProductCard Component
 * Displays a product in a card layout
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const ProductCard = ({ product, onEdit, onDelete, onPress }) => {
  const images = product.images || [];
  const hasImages = images.length > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>{product.price}</Text>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {product.description}
      </Text>

      {hasImages && (
        <ScrollView horizontal style={styles.imageContainer} showsHorizontalScrollIndicator={false}>
          {images.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => onEdit && onEdit(product)}
        >
          <Text style={styles.editButtonText}>{STRINGS.edit}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => onDelete && onDelete(product)}
        >
          <Text style={styles.deleteButtonText}>{STRINGS.delete}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  priceContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    lineHeight: 28,
  },
  currencyLabel: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginTop: 2,
  },
  imageSection: {
    marginBottom: 12,
    position: 'relative',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageScrollContent: {
    paddingHorizontal: 4,
  },
  imageWrapper: {
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageIndicatorText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  editButton: {
    backgroundColor: COLORS.warning + '15',
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  editButtonText: {
    color: COLORS.warning,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: COLORS.error + '15',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ProductCard;
