/**
 * ProductDetailScreen Component
 * Screen for displaying product details
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { removeProduct } = useProducts();

  // Collect all image URLs
  const images = [];
  for (let i = 1; i <= 4; i++) {
    const imageField = `image_url_${i}`;
    if (product[imageField]) {
      images.push(product[imageField]);
    }
  }

  const handleEdit = () => {
    navigation.navigate('ProductForm', { product });
  };

  const handleDelete = () => {
    Alert.alert(
      STRINGS.areYouSure,
      STRINGS.deleteProductConfirm,
      [
        {
          text: STRINGS.cancel,
          style: 'cancel',
        },
        {
          text: STRINGS.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await removeProduct(product.id);
              Alert.alert(STRINGS.success, STRINGS.deleteSuccess);
              navigation.goBack();
            } catch (err) {
              Alert.alert(STRINGS.error, err.message || STRINGS.operationFailed);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {images.length > 0 ? (
          <ScrollView horizontal pagingEnabled style={styles.imageContainer}>
            {images.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={80} color={COLORS.gray[400]} />
            <Text style={styles.noImageText}>{STRINGS.noImages}</Text>
          </View>
        )}

        <View style={styles.contentContainer}>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>{STRINGS.price}</Text>
            <Text style={styles.price}>{product.price}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{STRINGS.description}</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Ionicons name="create-outline" size={24} color={COLORS.warning} />
              <Text style={styles.actionButtonText}>{STRINGS.edit}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color={COLORS.error} />
              <Text style={styles.actionButtonText}>{STRINGS.delete}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 350,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 350,
  },
  noImageContainer: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 12,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 32,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  priceContainer: {
    marginBottom: 24,
    backgroundColor: COLORS.primary + '10',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    lineHeight: 26,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    letterSpacing: 0.2,
  },
});

export default ProductDetailScreen;
