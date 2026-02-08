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
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        </View>
        <Text style={styles.price}>{product.price} <Text style={styles.currency}>د.ع</Text></Text>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {product.description}
      </Text>

      {hasImages && (
        <View style={styles.imageSection}>
            <ScrollView horizontal style={styles.imageContainer} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScrollContent}>
            {images.map((imageUrl, index) => (
                <View key={index} style={styles.imageWrapper}>
                    <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                    />
                </View>
            ))}
            </ScrollView>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => onEdit && onEdit(product)}
        >
          <Text style={styles.buttonEmoji}>✏️</Text>
          <Text style={styles.editButtonText}>{STRINGS.edit}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => onDelete && onDelete(product)}
        >
          <Text style={styles.buttonEmoji}>🗑️</Text>
          <Text style={styles.deleteButtonText}>{STRINGS.delete}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  header: {
    flexDirection: 'row-reverse', // RTL: Name Right, Price Left
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    textAlign: 'right', // RTL
    lineHeight: 26,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'left', // LTR for numbers
  },
  currency: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 22,
    textAlign: 'right', // RTL
  },
  imageSection: {
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: 'row-reverse',
  },
  imageScrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row-reverse',
  },
  imageWrapper: {
    marginLeft: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  image: {
    width: 100,
    height: 100,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginHorizontal: 16,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row-reverse', // Buttons flow from Right
    padding: 12,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row', // Icon next to text
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 1, // Slight 3D pop
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  editButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  deleteButtonText: {
    color: COLORS.red,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  buttonEmoji: {
    fontSize: 16,
  },
});
export default ProductCard;
