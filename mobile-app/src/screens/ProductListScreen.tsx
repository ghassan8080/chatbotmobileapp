import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import {
    Appbar,
    FAB,
    Searchbar,
    Text,
    ActivityIndicator,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/product';
import apiService from '../services/api';
import { spacing } from '../theme';

const ProductListScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Load products
    const loadProducts = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);

            // Try to fetch products from API
            const data = await apiService.getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.warn('Failed to load products from API, using mock data');
            // For MVP, if API doesn't have GET endpoint, use empty array
            // Products will be managed through add/edit/delete
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadProducts();
    }, []);

    // Reload on screen focus
    useFocusEffect(
        useCallback(() => {
            loadProducts(false);
        }, [])
    );

    // Search filter
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadProducts(false);
    };

    const handleAddProduct = () => {
        navigation.navigate('ProductForm', { mode: 'add' });
    };

    const handleEditProduct = (product: Product) => {
        navigation.navigate('ProductForm', { mode: 'edit', product });
    };

    const handleViewProduct = (product: Product) => {
        navigation.navigate('ProductDetail', { product });
    };

    const handleDeleteProduct = async (product: Product) => {
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
                            await apiService.deleteProduct(product.id);
                            Alert.alert(t('common.success'), t('product.deleteSuccess'));
                            loadProducts(false);
                        } catch (error: any) {
                            Alert.alert(t('common.error'), error.message);
                        }
                    },
                },
            ]
        );
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <ProductCard
            product={item}
            onPress={() => handleViewProduct(item)}
            onEdit={() => handleEditProduct(item)}
            onDelete={() => handleDeleteProduct(item)}
        />
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text variant="titleLarge" style={styles.emptyText}>
                {t('product.noProducts')}
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
                اضغط على زر + لإضافة منتج جديد
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title={t('app.title')} />
            </Appbar.Header>

            <Searchbar
                placeholder={t('common.search')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchBar}
            />

            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#4CAF50']}
                    />
                }
            />

            <FAB
                icon="plus"
                label={t('product.addProduct')}
                style={styles.fab}
                onPress={handleAddProduct}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    searchBar: {
        margin: spacing.md,
        elevation: 2,
    },
    listContent: {
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        color: '#999',
        marginBottom: spacing.sm,
    },
    emptySubtext: {
        color: '#BBB',
    },
    fab: {
        position: 'absolute',
        left: spacing.md,
        bottom: spacing.md,
        backgroundColor: '#4CAF50',
    },
});

export default ProductListScreen;
