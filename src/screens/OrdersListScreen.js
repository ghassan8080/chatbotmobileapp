/**
 * OrdersListScreen Component
 * Main screen for displaying and managing orders
 */

import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import OrderCard from '../components/OrderCard';
import { useOrders } from '../hooks/useOrders';
import { updateOrderStatus } from '../api/ordersApi';
import { AuthContext } from '../context/AuthContext';

const OrdersListScreen = ({ navigation }) => {
  const { orders, loading, refreshing, onRefresh, error, fetchOrders } = useOrders();
  const { logout } = useContext(AuthContext);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);

  const handleLogout = async () => {
    console.log('🔴 LOGOUT BUTTON CLICKED - Showing confirmation dialog');
    
    // Simple confirmation
    const confirmed = window.confirm('هل تريد تسجيل الخروج؟');
    
    if (confirmed) {
      console.log('🟡 User confirmed logout - calling logout()...');
      try {
        console.log('🟡 Calling logout function from context');
        await logout();
        console.log('🟢 Logout completed successfully');
      } catch (err) {
        console.error('🔴 Error in logout:', err);
        alert('Error logging out: ' + err.message);
      }
    } else {
      console.log('⚪ Logout cancelled by user');
    }
  };

  /**
   * Handle order confirmation
   * Updates order status to "confirmed"
   */
  const handleConfirmOrder = async (orderId, newStatus) => {
    try {
      console.log(`📤 Confirming order ${orderId} to status: ${newStatus}`);
      setConfirmingOrderId(orderId);

      const result = await updateOrderStatus(orderId, newStatus);

      console.log('✅ Order confirmed:', result);

      // Show success message
      Alert.alert(STRINGS.success, STRINGS.confirmSuccess);

      // Refresh the orders list to get updated data
      await fetchOrders();
    } catch (err) {
      console.error('❌ Error confirming order:', err);
      throw err;
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const renderItem = ({ item }) => (
    <OrderCard
      order={item}
      onPress={() => {
        // Could navigate to order detail screen in the future
        console.log('Order tapped:', item);
      }}
      onConfirmOrder={handleConfirmOrder}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt" size={60} color={COLORS.gray[300]} />
      <Text style={styles.emptyText}>لا توجد طلبات</Text>
      <Text style={styles.emptySubtext}>
        قم بإنشاء طلب جديد من خلال إضافة منتج
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="alert-circle" size={60} color={COLORS.error} />
      <Text style={styles.emptyText}>حدث خطأ</Text>
      <Text style={styles.emptySubtext}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
        <Text style={styles.retryButtonText}>حاول مجددا</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with logout and back buttons */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-forward" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{STRINGS.myOrders}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{STRINGS.logout}</Text>
        </TouchableOpacity>
      </View>

      {/* Loading state */}
      {loading && !refreshing ? (
        <LoadingSpinner text={STRINGS.loadingOrders} />
      ) : error && orders.length === 0 ? (
        renderErrorState()
      ) : orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id || item._id || Math.random())}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default OrdersListScreen;
