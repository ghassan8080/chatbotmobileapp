import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import {
    Appbar,
    TextInput,
    Button,
    ActivityIndicator,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePickerComponent from '../components/ImagePicker';
import { Product, ProductFormData, ProductImage } from '../types/product';
import apiService from '../services/api';
import { validateProductForm, sanitizeString } from '../utils/validation';
import { processImagesForUpload } from '../utils/imageUtils';
import { spacing } from '../theme';

const ProductFormScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute<any>();

    const mode = route.params?.mode || 'add';
    const existingProduct: Product | undefined = route.params?.product;

    const [name, setName] = useState(existingProduct?.name || '');
    const [description, setDescription] = useState(existingProduct?.description || '');
    const [price, setPrice] = useState(existingProduct?.price?.toString() || '');
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Validate inputs
        const validation = validateProductForm(name, description, price);
        if (!validation.isValid) {
            Alert.alert(t('common.error'), validation.errors.join('\n'));
            return;
        }

        // Sanitize inputs
        const sanitizedName = sanitizeString(name);
        const sanitizedDescription = sanitizeString(description);
        const numPrice = parseFloat(price);

        try {
            setLoading(true);

            // Process images
            const imageData = await processImagesForUpload(images);

            // Prepare form data
            const formData: ProductFormData = {
                name: sanitizedName,
                description: sanitizedDescription,
                price: numPrice,
                seller_id: 1, // Default seller ID
                ...imageData,
            };

            let response;
            if (mode === 'edit' && existingProduct) {
                response = await apiService.updateProduct(existingProduct.id, formData);
                Alert.alert(t('common.success'), t('product.updateSuccess'));
            } else {
                response = await apiService.addProduct(formData);
                Alert.alert(t('common.success'), t('product.addSuccess'));
            }

            // Navigate back
            navigation.goBack();
        } catch (error: any) {
            Alert.alert(t('common.error'), error.message || t('errors.unknownError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title={mode === 'edit' ? t('product.editProduct') : t('product.addProduct')}
                />
            </Appbar.Header>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Product Name */}
                    <TextInput
                        label={t('product.name')}
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        style={styles.input}
                        placeholder={t('form.namePlaceholder')}
                        disabled={loading}
                    />

                    {/* Product Description */}
                    <TextInput
                        label={t('product.description')}
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                        placeholder={t('form.descriptionPlaceholder')}
                        disabled={loading}
                    />

                    {/* Product Price */}
                    <TextInput
                        label={t('product.price')}
                        value={price}
                        onChangeText={setPrice}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        placeholder={t('form.pricePlaceholder')}
                        right={<TextInput.Affix text={t('common.dinar')} />}
                        disabled={loading}
                    />

                    {/* Image Picker */}
                    <ImagePickerComponent
                        images={images}
                        onImagesChange={setImages}
                        maxImages={4}
                    />

                    {/* Submit Button */}
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        loading={loading}
                        disabled={loading}
                        buttonColor="#4CAF50"
                    >
                        {mode === 'edit' ? t('common.save') : t('common.add')}
                    </Button>

                    {/* Cancel Button */}
                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.cancelButton}
                        disabled={loading}
                    >
                        {t('common.cancel')}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
    },
    input: {
        marginBottom: spacing.md,
    },
    submitButton: {
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    cancelButton: {
        marginBottom: spacing.xl,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProductFormScreen;
