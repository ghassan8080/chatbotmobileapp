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
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { removeProduct } = useProducts();
  const [activeDotIndex, setActiveDotIndex] = React.useState(0);

  // Collect all image URLs
  // Collect all image URLs
  let rawImages = [];
  if (product.images && product.images.length > 0) {
    rawImages = product.images;
  } else {
    for (let i = 1; i <= 4; i++) {
      const imageField = `image_url_${i}`;
      if (product[imageField]) {
        rawImages.push(product[imageField]);
      }
    }
  }

  // Sanitize images
  const images = rawImages
    .map(img => typeof img === 'string' ? img.replace(/\s/g, '') : img)
    .filter(img => img && typeof img === 'string' && img.length > 0);

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
      <ScreenHeader
        title={STRINGS.productDetails}
        backgroundColor={COLORS.primary}
        leftAction={{
          icon: 'arrow-forward',
          onPress: () => navigation.goBack(),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {images.length > 0 ? (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.imageContainer}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setActiveDotIndex(index);
              }}
            >
              {images.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
            {/* Pagination Dots */}
            {images.length > 1 && (
              <View style={styles.dotsContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.dot, index === activeDotIndex && styles.dotActive]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <View style={styles.noImageIconWrapper}>
              <Ionicons name="image-outline" size={72} color={COLORS.gray[300]} />
            </View>
            <Text style={styles.noImageText}>{STRINGS.noImages}</Text>
          </View>
        )}

        {/* Content Card */}
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{product.name}</Text>

          {/* Price Badge */}
          <View style={styles.priceContainer}>
            <View style={styles.priceIconContainer}>
              <Ionicons name="pricetag" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.priceTextContainer}>
              <Text style={styles.priceLabel}>{STRINGS.price}</Text>
              <Text style={styles.price}>
                {(() => {
                  if (!product.price) return '0';
                  const cleanPrice = String(product.price).replace(/[^0-9.]/g, '');
                  const numericPrice = Number(cleanPrice);
                  return isNaN(numericPrice) ? '0' : Math.floor(numericPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                })()}
                <Text style={styles.currency}> د.ع</Text>
              </Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={18} color={COLORS.primary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>{STRINGS.description}</Text>
            </View>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <View style={styles.actionButtonWrapper}>
              <AppButton
                title={STRINGS.edit}
                onPress={handleEdit}
                variant="ghost"
                icon="create-outline"
                size="medium"
              />
            </View>
            <View style={styles.actionButtonWrapper}>
              <AppButton
                title={STRINGS.delete}
                onPress={handleDelete}
                variant="danger"
                icon="trash-outline"
                size="medium"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 320,
    backgroundColor: COLORS.white,
  },
  image: {
    width: SCREEN_WIDTH,
    height: 320,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray[300],
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
    borderRadius: 4,
  },
  noImageContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    marginBottom: 8,
  },
  noImageIconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noImageText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    paddingTop: 28,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 300,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  priceContainer: {
    marginBottom: 24,
    backgroundColor: COLORS.primary + '08',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '15',
  },
  priceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  priceTextContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  currency: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    lineHeight: 26,
    paddingLeft: 26,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButtonWrapper: {
    flex: 1,
  },
});

export default ProductDetailScreen;
