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
  const { images, pickImage, addImage, removeImage, clearImages, uploading, prepareImagesForUpload } = useImageUpload();

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
    }
  }, [isEditMode, product]);

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

      let base64Images = [];
      if (images.length > 0) {
        base64Images = await prepareImagesForUpload();
      }

      const imagePayload = base64Images.map(img => ({ name: img.name, base64: img.base64 }));

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
