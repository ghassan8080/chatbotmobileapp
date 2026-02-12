import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const ProductCard = ({ product, onEdit, onDelete, onPress }) => {
  const images = product.images || [];
  const hasImages = images.length > 0;
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Format price helper
  const formatPrice = (price) => {
    if (!price) return '0';
    // Remove non-numeric characters except decimal point
    const cleanPrice = String(price).replace(/[^0-9.]/g, '');
    const numericPrice = Number(cleanPrice);
    if (isNaN(numericPrice)) return '0';
    return Math.floor(numericPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={onPress} 
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* 1. Title */}
        <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        </View>

        {/* 2. Description (Short) */}
        {product.description ? (
            <Text style={styles.description} numberOfLines={2}>
                {product.description}
            </Text>
        ) : null}

        {/* 3. Image Gallery */}
        {hasImages && (
          <View style={styles.imageSection}>
              <ScrollView 
                horizontal 
                style={styles.imageContainer} 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.imageScrollContent}
              >
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

        {/* 4. Price */}
        <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)} <Text style={styles.currency}>د.ع</Text></Text>
        </View>

        {/* 5. Action Bar */}
        <View style={styles.actionBar}>
            <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => onEdit && onEdit(product)}
                activeOpacity={0.85}
            >
                <Ionicons name="create-outline" size={20} color={COLORS.primary} style={styles.actionIcon} />
                <Text style={styles.editButtonText}>{STRINGS.edit || 'تعديل'}</Text>
            </TouchableOpacity>
            
            <View style={styles.actionDivider} />

            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => onDelete && onDelete(product)}
                activeOpacity={0.85}
            >
                <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                <Text style={styles.deleteButtonText}>حذف</Text>
            </TouchableOpacity>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  titleContainer: {
    marginBottom: 6,
    alignItems: 'flex-end', // RTL
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'right',
    lineHeight: 26,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 16,
  },
  imageSection: {
    marginBottom: 0, 
    marginHorizontal: -16, 
  },
  imageContainer: {
    flexDirection: 'row-reverse',
  },
  imageScrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row-reverse',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginLeft: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceContainer: {
      alignItems: 'flex-end', // RTL alignment (Right)
      marginTop: 12,
      marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'right',
  },
  currency: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row-reverse',
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: 'rgba(98, 0, 234, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', 
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionDivider: {
      width: 1,
      backgroundColor: '#FFFFFF',
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8, // RTL? Text is usually right of icon in LTR, left in RTL. "flexDirection: row" puts icon left, text right.
    // If we want [Icon] [Text], row is correct.
    // Ideally we want [Icon] [Text] centered.
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  actionIcon: {
      //
  }
});

export default ProductCard;
