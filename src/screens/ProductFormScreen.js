/**
 * ProductFormScreen Component
 * Screen for adding or editing a product
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { useImageUpload } from '../hooks/useImageUpload';
import ImageUploader from '../components/ImageUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import ScreenHeader from '../components/ScreenHeader';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { validateProductForm } from '../utils/validators';

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

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.toString().replace(/[^\d.]/g, '') : '',
      });

      // Initialize images if they exist
      if (product.images && product.images.length > 0) {
        setImages(product.images.map(url => ({
          uri: url,
          type: 'image/jpeg', // Default type
          name: url.split('/').pop(), // Extract filename from URL
          isExisting: true // Flag to identify existing images
        })));
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
      addImage(file);
    }
  };

  const handleSubmit = async () => {
    const validation = validateProductForm({
      ...formData,
      images,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);

      setSubmitting(true);

      let imagePayload = [];
      const imagesToUpload = [];
      const existingImages = [];

      // Separate existing images from new uploads
      images.forEach(img => {
        if (img.isExisting || (img.uri && img.uri.startsWith('http'))) {
          existingImages.push(img);
        } else {
          imagesToUpload.push(img);
        }
      });

      // Handle new uploads
      if (imagesToUpload.length > 0) {
        // We need to temporarily set images state to only new ones for prepareImagesForUpload to work efficiently 
        // or we can manually convert them here. `prepareImagesForUpload` uses the `images` state.
        // Since `prepareImagesForUpload` relies on state, using it might be tricky if mixed.
        // Let's manually convert new images using the logic from `prepareImagesForUpload` 
        // OR better, just iterate and convert.

        const { uriToBase64 } = require('../utils/fileUtils');

        for (const img of imagesToUpload) {
          let base64 = img.base64;
          if (!base64 && img.uri) {
            base64 = await uriToBase64(img.uri);
          }

          if (base64 && !base64.startsWith('data:image')) {
            const mimeType = img.type || 'image/jpeg';
            base64 = `data:${mimeType};base64,${base64}`;
          }

          imagePayload.push({
            base64: base64,
            name: img.name
          });
        }
      }

      // Handle existing images
      existingImages.forEach(img => {
        imagePayload.push({
          fileName: img.uri, // API expects fileName for existing URL
          base64: null
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
    <View style={styles.container}>
      <ScreenHeader
        title={isEditMode ? STRINGS.editProduct : STRINGS.addNewProduct}
        backgroundColor={COLORS.primary}
        leftAction={{
          icon: 'arrow-back',
          onPress: handleCancel,
        }}
      />

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
          <View style={styles.section}>
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
          <View style={styles.section}>
            <ImageUploader
              images={images}
              onAddImage={handleAddImage}
              onRemoveImage={removeImage}
              maxImages={4}
            />
            {errors.images && (
              <View style={styles.imageError}>
                <AppInput error={errors.images[0]} editable={false} style={styles.hidden} />
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <AppButton
                title={STRINGS.cancel}
                onPress={handleCancel}
                variant="secondary"
                disabled={submitting || uploading}
                icon="close-outline"
                size="medium"
              />
            </View>

            <View style={styles.buttonWrapper}>
              <AppButton
                title={isEditMode ? STRINGS.update : STRINGS.add}
                onPress={handleSubmit}
                variant="primary"
                loading={submitting || uploading}
                disabled={submitting || uploading}
                icon={submitting || uploading ? undefined : 'checkmark-circle-outline'}
                size="medium"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  buttonWrapper: {
    flex: 1,
  },
  imageError: {
    marginTop: -10,
  },
  hidden: {
    height: 0,
    marginBottom: 0,
    overflow: 'hidden',
  },
});

export default ProductFormScreen;
