import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
    Alert,
} from 'react-native';
import {
    Appbar,
    Text,
    Button,
    Card,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Product } from '../types/product';
import apiService from '../services/api';
import { spacing } from '../theme';

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const product: Product = route.params?.product;
    const [deleting, setDeleting] = useState(false);

    if (!product) {
        navigation.goBack();
        return null;
    }

    // Get all product images
    const productImages = [
        product.image_url_1,
        product.image_url_2,
        product.image_url_3,
        product.image_url_4,
    ].filter(Boolean);

    const handleEdit = () => {
        navigation.navigate('ProductForm', { mode: 'edit', product });
    };

    const handleDelete = () => {
        Alert.alert(
            t('common.confirm'),
            t('product.deleteConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setDeleting(true);
                            await apiService.deleteProduct(product.id);
                            Alert.alert(t('common.success'), t('product.deleteSuccess'));
                            navigation.goBack();
                        } catch (error: any) {
                            Alert.alert(t('common.error'), error.message);
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={t('product.productDetails')} />
                <Appbar.Action icon="pencil" onPress={handleEdit} />
                <Appbar.Action icon="delete" onPress={handleDelete} />
            </Appbar.Header>

            <ScrollView style={styles.scrollView}>
                {/* Images Gallery */}
                {productImages.length > 0 && (
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageGallery}
                    >
                        {productImages.map((imageUrl, index) => (
                            <Image
                                key={index}
                                source={{ uri: imageUrl }}
                                style={styles.galleryImage}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                )}

                {/* Product Info Card */}
                <Card style={styles.infoCard}>
                    <Card.Content>
                        <Text variant="headlineMedium" style={styles.productName}>
                            {product.name}
                        </Text>

                        <Text variant="titleLarge" style={styles.price}>
                            {product.price.toFixed(2)} {t('common.dinar')}
                        </Text>

                        <View style={styles.divider} />

                        <Text variant="titleSmall" style={styles.sectionTitle}>
                            {t('product.description')}
                        </Text>
                        <Text variant="bodyMedium" style={styles.description}>
                            {product.description}
                        </Text>

                        {product.created_at && (
                            <>
                                <View style={styles.divider} />
                                <Text variant="bodySmall" style={styles.metadata}>
                                    تاريخ الإضافة: {new Date(product.created_at).toLocaleDateString('ar-EG')}
                                </Text>
                            </>
                        )}
                    </Card.Content>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <Button
                        mode="contained"
                        icon="pencil"
                        onPress={handleEdit}
                        style={styles.editButton}
                        buttonColor="#FFC107"
                        textColor="#000"
                    >
                        {t('common.edit')}
                    </Button>

                    <Button
                        mode="contained"
                        icon="delete"
                        onPress={handleDelete}
                        style={styles.deleteButton}
                        buttonColor="#F44336"
                        loading={deleting}
                        disabled={deleting}
                    >
                        {t('common.delete')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollView: {
        flex: 1,
    },
    imageGallery: {
        height: 300,
    },
    galleryImage: {
        width: width,
        height: 300,
    },
    infoCard: {
        margin: spacing.md,
        padding: spacing.sm,
    },
    productName: {
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    price: {
        color: '#4CAF50',
        fontWeight: 'bold',
        marginBottom: spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: spacing.md,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    description: {
        color: '#666',
        lineHeight: 24,
    },
    metadata: {
        color: '#999',
    },
    actionContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
    },
    editButton: {
        flex: 1,
    },
    deleteButton: {
        flex: 1,
    },
});

export default ProductDetailScreen;
