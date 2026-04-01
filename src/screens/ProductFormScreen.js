/**
 * ProductFormScreen Component
 * Screen for adding or editing a product
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProducts } from '../hooks/useProducts';
import { useImageUpload } from '../hooks/useImageUpload';
import ImageUploader from '../components/ImageUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import AppInput from '../components/AppInput';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { validateProductForm } from '../utils/validators';
import { sanitizeImageUrl } from '../utils/formatters';

const ProductFormScreen = ({ route, navigation }) => {
  const { product } = route.params || {};
  const isEditMode = !!product;

  const { addNewProduct, updateExistingProduct, loading } = useProducts();
  const { images, pickImage, addImage, removeImage, clearImages, uploading, prepareImagesForUpload, setImages } = useImageUpload();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const imagesInitialized = useRef(false);

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.toString().replace(/[^\d.]/g, '') : '',
      });

      // Initialize images only once to prevent re-initialization and duplication
      if (product.images && product.images.length > 0 && !imagesInitialized.current) {
        const sanitizedImages = product.images
          .map(url => sanitizeImageUrl(url)) // Clean URLs
          .filter(url => {
            // Filter out invalid images:
            // - Empty strings
            // - Non-HTTP/HTTPS URLs
            // - Very short strings (likely corrupt)
            return url &&
              url.length > 10 &&
              (url.startsWith('http://') || url.startsWith('https://'));
          })
          .map(cleanUrl => ({
            uri: cleanUrl,
            type: 'image/jpeg', // Default type
            name: cleanUrl.split('/').pop(), // Extract filename from URL
            isExisting: true // Flag to identify existing images
          }));

        console.log('Filtered images from product:', sanitizedImages.length, 'out of', product.images.length);
        setImages(sanitizedImages);
        imagesInitialized.current = true;
      }
    }
  }, [isEditMode, product, setImages]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleAddImage = async (source) => {
    const file = await pickImage(source);
    if (file) {
      console.log('Adding new image:', {
        uri: file.uri?.substring(0, 50) + '...',
        type: file.type,
        name: file.name,
        isExisting: file.isExisting
      });
      addImage(file);
    }
  };

  const handleSubmit = async () => {
    const validation = validateProductForm({
      ...formData,
      images,
    });

    if (!validation.isValid) {
      console.error('Form validation failed:', validation.errors);
      setErrors(validation.errors);
      
      // Show an alert with the validation errors so the user isn't stuck silently
      const errorMessages = Object.values(validation.errors).join('\n');
      Alert.alert(STRINGS.error || 'خطأ', errorMessages || 'الرجاء التحقق من المدخلات.');
      
      return;
    }

    try {
      setSubmitting(true);

      setSubmitting(true);

      let imagePayload = [];
      const imagesToUpload = [];
      const existingImages = [];
      const seenUrls = new Set(); // Track URLs to prevent duplicates

      // Separate existing images from new uploads
      console.log('=== IMAGE CLASSIFICATION DEBUG ===');
      console.log('Total images in state:', images.length);
      images.forEach((img, idx) => {
        console.log(`Image ${idx}:`, {
          uri: img.uri?.substring(0, 50) + '...',
          isExisting: img.isExisting,
          hasHttpUrl: img.uri?.startsWith('http://') || img.uri?.startsWith('https://'),
          type: img.type,
          name: img.name
        });
      });

      images.forEach(img => {
        // Existing images have isExisting flag OR HTTP/HTTPS URLs
        if (img.isExisting || (img.uri && (img.uri.startsWith('http://') || img.uri.startsWith('https://')))) {
          // Prevent duplicate URLs
          const cleanUrl = sanitizeImageUrl(img.uri);
          if (!seenUrls.has(cleanUrl)) {
            existingImages.push({ ...img, uri: cleanUrl });
            seenUrls.add(cleanUrl);
            console.log('Classified as EXISTING:', cleanUrl.substring(0, 50) + '...');
          } else {
            console.log('DUPLICATE DETECTED, skipping:', cleanUrl.substring(0, 50) + '...');
          }
        } else {
          // New images have local URIs (file://, content://, etc.)
          imagesToUpload.push(img);
          console.log('Classified as NEW:', img.uri?.substring(0, 50) + '...');
        }
      });

      console.log('Image separation - Existing:', existingImages.length, 'New:', imagesToUpload.length);

      // Handle new uploads
      if (imagesToUpload.length > 0) {
        // We need to temporarily set images state to only new ones for prepareImagesForUpload to work efficiently 
        // or we can manually convert them here. `prepareImagesForUpload` uses the `images` state.
        // Since `prepareImagesForUpload` relies on state, using it might be tricky if mixed.
        // Let's manually convert new images using the logic from `prepareImagesForUpload` 
        // OR better, just iterate and convert.

        const { uriToBase64 } = require('../utils/fileUtils');

        for (const img of imagesToUpload) {
          console.log('Processing new image for upload:', img.name);
          let base64 = img.base64;
          if (!base64 && img.uri) {
            console.log('Converting URI to base64...');
            base64 = await uriToBase64(img.uri);
            console.log('Conversion result - has data:', !!base64, 'length:', base64?.length);
          }

          if (base64 && !base64.startsWith('data:image')) {
            const mimeType = img.type || 'image/jpeg';
            base64 = `data:${mimeType};base64,${base64}`;
            console.log('Added data URL prefix');
          }

          console.log('Final base64 for', img.name, '- length:', base64?.length);
          imagePayload.push({
            base64: base64,
            name: img.name
          });
        }
      }

      // Handle existing images - send URLs as fileName with null base64
      existingImages.forEach(img => {
        const cleanUrl = sanitizeImageUrl(img.uri);
        if (cleanUrl && (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://'))) {
          imagePayload.push({
            fileName: cleanUrl, // API expects fileName for existing URL
            base64: null
          });
          console.log('Added to payload as EXISTING URL:', cleanUrl.substring(0, 50) + '...');
        }
      });

      console.log('=== FINAL PAYLOAD ===');
      console.log('Total images in payload:', imagePayload.length);
      imagePayload.forEach((img, idx) => {
        console.log(`Payload image ${idx}:`, {
          hasBase64: !!img.base64,
          base64Length: img.base64?.length,
          fileName: img.fileName?.substring(0, 50) + '...',
          name: img.name
        });
      });

      const productData = {
        id: isEditMode ? product.id : undefined,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        images: imagePayload,
      };

      if (isEditMode) {
        await updateExistingProduct(productData);
        Alert.alert(STRINGS.success, STRINGS.updateSuccess);
      } else {
        await addNewProduct(productData);
        Alert.alert(STRINGS.success, STRINGS.addSuccess);
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert(STRINGS.error, err.message || STRINGS.operationFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Check if there are unsaved changes
    const hasUnsavedChanges = isEditMode || (formData.name || formData.description || formData.price || images.length > 0);

    if (hasUnsavedChanges) {
      if (Platform.OS === 'web') {
        const confirm = window.confirm(STRINGS.areYouSure);
        if (confirm) {
          clearImages();
          navigation.goBack();
        }
      } else {
        Alert.alert(
          STRINGS.areYouSure,
          STRINGS.areYouSure,
          [
            {
              text: STRINGS.cancel,
              style: 'cancel',
            },
            {
              text: STRINGS.confirm,
              onPress: () => {
                clearImages();
                navigation.goBack();
              },
            },
          ],
          { cancelable: true }
        );
      }
    } else {
      navigation.goBack();
    }
  };

  if (loading && isEditMode) {
    return <LoadingSpinner text={STRINGS.loading} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === 'android' && <StatusBar backgroundColor="#fdf3ff" barStyle="dark-content" />}
      <View style={styles.container}>
        {/* Custom Glass-nav Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}></View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>{isEditMode ? STRINGS.editProduct : STRINGS.addNewProduct}</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.iconButton} hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Ionicons name="arrow-forward" size={24} color="#38274c" />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Product Info Section */}
            <View style={styles.cardContainer}>
              <AppInput
                label={STRINGS.productName}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder={STRINGS.productName}
                icon="cube-outline"
                error={errors.name}
              />

              <AppInput
                label={STRINGS.productDescription}
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder={STRINGS.productDescription}
                multiline
                numberOfLines={4}
                icon="document-text-outline"
                error={errors.description}
              />

              <AppInput
                label={STRINGS.productPrice}
                value={formData.price}
                onChangeText={(text) => handleInputChange('price', text)}
                placeholder={STRINGS.productPrice}
                keyboardType="decimal-pad"
                icon="pricetag-outline"
                error={errors.price}
              />
            </View>

            {/* Images Section */}
            <View style={styles.cardContainer}>
              <ImageUploader
                images={images}
                onAddImage={handleAddImage}
                onRemoveImage={removeImage}
                maxImages={4}
              />
              {errors.images && errors.images.length > 0 && (
                <View style={styles.imageError}>
                  <Text style={styles.errorText}>{errors.images[0]}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleSubmit}
                disabled={submitting || uploading}
                style={styles.actionButtonContainer}
              >
                <LinearGradient
                  colors={(submitting || uploading) ? ['#efdbff', '#efdbff'] : ['#6a1cf6', '#ac8eff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryGradient}
                >
                  <Text style={[styles.buttonText, (submitting || uploading) && styles.disabledButtonText]}>
                    {isEditMode ? STRINGS.update : STRINGS.add}
                  </Text>
                  {!(submitting || uploading) && <Ionicons name="add-circle-outline" size={24} color="#ffffff" style={styles.buttonIcon} />}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdf3ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fdf3ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(253, 243, 255, 0.8)',
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38274c',
    marginRight: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 999,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  buttonContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  actionButtonContainer: {
    width: '100%',
    shadowColor: '#6a1cf6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  primaryGradient: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledButtonText: {
    color: 'rgba(103, 83, 124, 0.4)',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  imageError: {
    marginTop: 8,
  },
  errorText: {
    color: '#b41340',
    fontSize: 13,
    textAlign: 'center',
  },
  hidden: {
    height: 0,
    marginBottom: 0,
    overflow: 'hidden',
  },
});

export default ProductFormScreen;
