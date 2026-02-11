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
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={18} color={COLORS.primary} style={styles.actionIcon} />
          <Text style={styles.editButtonText}>{STRINGS.edit}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => onDelete && onDelete(product)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.red} style={styles.actionIcon} />
          <Text style={styles.deleteButtonText}>{STRINGS.delete}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  header: {
    flexDirection: 'row-reverse', // RTL: Name Right, Price Left
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'right', // RTL
    lineHeight: 24,
  },
  price: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'left', // LTR for numbers
    lineHeight: 24,
  },
  currency: {
    fontSize: 13,
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
    borderColor: COLORS.gray[150],
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginHorizontal: 16,
    marginBottom: 12,
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
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  editButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.red,
  },
  deleteButtonText: {
    color: COLORS.red,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  actionIcon: {
    marginLeft: 6,
  },
});
export default ProductCard;
