import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { ProductImage } from '../types/product';
import { spacing } from '../theme';
import { validateImageSize } from '../utils/imageUtils';
import { config } from '../config/api.config';

interface ImagePickerComponentProps {
    images: ProductImage[];
    onImagesChange: (images: ProductImage[]) => void;
    maxImages?: number;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
    images,
    onImagesChange,
    maxImages = 4,
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleImageSelection = async (asset: Asset) => {
        if (!asset.uri) return;

        // Validate image size
        if (asset.fileSize && !validateImageSize(asset.fileSize)) {
            Alert.alert(
                t('common.error'),
                t('errors.imageTooLarge')
            );
            return;
        }

        const newImage: ProductImage = {
            uri: asset.uri,
            name: asset.fileName || `image_${Date.now()}.jpg`,
            type: asset.type || 'image/jpeg',
        };

        onImagesChange([...images, newImage]);
    };

    const openCamera = async () => {
        if (images.length >= maxImages) {
            Alert.alert(t('common.error'), `الحد الأقصى ${maxImages} صور`);
            return;
        }

        try {
            setLoading(true);
            const result = await launchCamera({
                mediaType: 'photo',
                quality: config.imageQuality,
                includeBase64: false,
                maxWidth: 1024,
                maxHeight: 1024,
            });

            if (result.assets && result.assets[0]) {
                await handleImageSelection(result.assets[0]);
            }
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert(t('common.error'), 'فشل فتح الكاميرا');
        } finally {
            setLoading(false);
        }
    };

    const openGallery = async () => {
        if (images.length >= maxImages) {
            Alert.alert(t('common.error'), `الحد الأقصى ${maxImages} صور`);
            return;
        }

        try {
            setLoading(true);
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: config.imageQuality,
                selectionLimit: maxImages - images.length,
                includeBase64: false,
                maxWidth: 1024,
                maxHeight: 1024,
            });

            if (result.assets) {
                for (const asset of result.assets) {
                    await handleImageSelection(asset);
                }
            }
        } catch (error) {
            console.error('Gallery error:', error);
            Alert.alert(t('common.error'), 'فشل فتح المعرض');
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    return (
        <View style={styles.container}>
            <Text variant="titleSmall" style={styles.label}>
                {t('product.selectImages')}
            </Text>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.previewContainer}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri: image.uri }} style={styles.previewImage} />
                            <IconButton
                                icon="close-circle"
                                size={24}
                                iconColor="#F44336"
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                            />
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Action Buttons */}
            {images.length < maxImages && (
                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        icon="camera"
                        onPress={openCamera}
                        style={styles.button}
                        loading={loading}
                        disabled={loading}
                    >
                        {t('product.takePhoto')}
                    </Button>
                    <Button
                        mode="outlined"
                        icon="image"
                        onPress={openGallery}
                        style={styles.button}
                        loading={loading}
                        disabled={loading}
                    >
                        {t('product.chooseFromGallery')}
                    </Button>
                </View>
            )}

            <Text variant="bodySmall" style={styles.hint}>
                {images.length} / {maxImages} صور
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.md,
    },
    label: {
        marginBottom: spacing.sm,
        fontWeight: 'bold',
    },
    previewContainer: {
        marginVertical: spacing.md,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: spacing.sm,
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        margin: 0,
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    button: {
        flex: 1,
    },
    hint: {
        marginTop: spacing.sm,
        color: '#666',
        textAlign: 'center',
    },
});

export default ImagePickerComponent;
