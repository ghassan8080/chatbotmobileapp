/**
 * ProductFormScreen Component
 * Screen for adding or editing a product
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';
import { useImageUpload } from '../hooks/useImageUpload';
import ImageUploader from '../components/ImageUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { FORM_FIELDS } from '../constants/constants';
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

    // Clear error for this field when user starts typing
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
    // Validate form
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

      // Prepare images (convert to base64)

      // On hook side we renamed uploadAllImages to prepareImagesForUpload
      // We need to access that function from the hook
      // But wait, we destructure it as uploadAllImages in line 33? 
      // I need to update line 33 too.
      // For now, let's assume I fix line 33 in a separate call or same call if possible.
      // I can't do multiple chunks easily with replace_file_content if they are far apart.
      // I will use multi_replace.

      // ... actually I should use multi_replace for ProductFormScreen.
      // Abort this specific tool call and use multi_replace in next step.
      // Wait, I can't abort. I will just do a valid replacement here and a separate one for the destructure.
      // Or I can just use `uploadAllImages` as the name for the new function in the hook? 
      // No, semantic naming is better.

      // Let's assume I will update the destructuring in the next step.
      // Here I use the PROP that will be available.


      let base64Images = [];
      if (images.length > 0) {
        base64Images = await prepareImagesForUpload();
      }

      // Convert to simple images array expected by backend: [{ name, base64 }, ...]
      const imagePayload = base64Images.map(img => ({ name: img.name, base64: img.base64 }));

      // Prepare product data
      const productData = {
        id: isEditMode ? product.id : undefined,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        images: imagePayload,
      };

      // Submit
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
    if (isEditMode || (formData.name || formData.description || formData.price || images.length > 0)) {
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
    } else {
      navigation.goBack();
    }
  };

  // Note: The actual image upload is handled by the useImageUpload hook
  // We'll use the uploadAllImages function from the hook when needed

  if (loading && isEditMode) {
    return <LoadingSpinner text={STRINGS.loading} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {isEditMode ? STRINGS.editProduct : STRINGS.addNewProduct}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{STRINGS.productName}</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder={STRINGS.productName}
            placeholderTextColor={COLORS.input.placeholder}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{STRINGS.productDescription}</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            placeholder={STRINGS.productDescription}
            placeholderTextColor={COLORS.input.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{STRINGS.productPrice}</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={formData.price}
            onChangeText={(text) => handleInputChange('price', text)}
            placeholder={STRINGS.productPrice}
            placeholderTextColor={COLORS.input.placeholder}
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        <View style={styles.formGroup}>
          <ImageUploader
            images={images}
            onAddImage={handleAddImage}
            onRemoveImage={removeImage}
            maxImages={4}
          />
          {errors.images && <Text style={styles.errorText}>{errors.images[0]}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={submitting || uploading}
          >
            <Text style={styles.cancelButtonText}>{STRINGS.cancel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={submitting || uploading}
          >
            {submitting || uploading ? (
              <Ionicons name="hourglass-outline" size={24} color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditMode ? STRINGS.update : STRINGS.add}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.input.background,
    borderWidth: 2,
    borderColor: COLORS.input.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text.primary,
    textAlign: 'right',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  cancelButton: {
    backgroundColor: COLORS.gray[100],
    borderWidth: 2,
    borderColor: COLORS.gray[200],
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProductFormScreen;
