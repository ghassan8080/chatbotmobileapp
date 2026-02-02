import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/product';
import { spacing, fontSize, shadows } from '../theme';

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.md * 2;

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
    onEdit,
    onDelete,
}) => {
    const { t } = useTranslation();

    // Get first available image
    const getProductImage = (): string | undefined => {
        return product.image_url_1 ||
            product.image_url_2 ||
            product.image_url_3 ||
            product.image_url_4;
    };

    // Count total images
    const imageCount = [
        product.image_url_1,
        product.image_url_2,
        product.image_url_3,
        product.image_url_4,
    ].filter(Boolean).length;

    const productImage = getProductImage();

    return (
        <Card style={styles.card} onPress={onPress}>
            <View style={styles.cardContent}>
                {/* Image Section */}
                {productImage ? (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: productImage }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        {imageCount > 1 && (
                            <View style={styles.imageBadge}>
                                <Text style={styles.imageBadgeText}>+{imageCount - 1}</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={[styles.imageContainer, styles.imagePlaceholder]}>
                        <IconButton icon="image-off" size={32} />
                    </View>
                )}

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <Text variant="titleMedium" style={styles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
                        {product.description}
                    </Text>
                    <Text variant="titleSmall" style={styles.price}>
                        {product.price.toFixed(2)} {t('common.dinar')}
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <IconButton
                        icon="pencil"
                        mode="contained"
                        iconColor="#000"
                        containerColor="#FFC107"
                        size={20}
                        onPress={onEdit}
                    />
                    <IconButton
                        icon="delete"
                        mode="contained"
                        iconColor="#FFF"
                        containerColor="#F44336"
                        size={20}
                        onPress={onDelete}
                    />
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: spacing.md,
        marginVertical: spacing.sm,
        width: CARD_WIDTH,
        ...shadows.card,
    },
    cardContent: {
        flexDirection: 'row',
        padding: spacing.md,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: spacing.md,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    imageBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    description: {
        color: '#666',
        marginBottom: spacing.xs,
    },
    price: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    actionsContainer: {
        justifyContent: 'center',
        gap: spacing.xs,
    },
});

export default ProductCard;
