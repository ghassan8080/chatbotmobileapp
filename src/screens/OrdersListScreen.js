/**
 * OrdersListScreen Component
 * Main screen for displaying and managing orders
 */

import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import OrderCard from '../components/OrderCard';
import { useOrders } from '../hooks/useOrders';
import { updateOrderStatus, confirmBooking } from '../api/ordersApi';
import { AuthContext } from '../context/AuthContext';

const OrdersListScreen = ({ navigation }) => {
  const { orders, loading, refreshing, onRefresh, error, fetchOrders } = useOrders();
  const { logout } = useContext(AuthContext);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);

  const handleLogout = async () => {
    console.log('🔴 LOGOUT BUTTON CLICKED - Showing confirmation dialog');
    
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
   * Calls the webhook to confirm the booking
   */
  const handleConfirmOrder = async (orderId, newStatus) => {
    try {
      console.log(`📤 Confirming order ${orderId} via webhook`);
      setConfirmingOrderId(orderId);

      const result = await confirmBooking(orderId);

      console.log('✅ Order confirmed via webhook:', result);

      Alert.alert(STRINGS.success, STRINGS.confirmSuccess);

      await fetchOrders();
    } catch (err) {
      console.error('❌ Error confirming order:', err);
      Alert.alert('خطأ', err.message || 'فشل تثبيت الحجز');
      throw err;
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const renderItem = ({ item }) => (
    <OrderCard
      order={item}
      onPress={() => {
        console.log('Order tapped:', item);
      }}
      onConfirmOrder={handleConfirmOrder}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={STRINGS.myOrders}
        backgroundColor={COLORS.secondary}
        leftAction={{
          icon: 'arrow-forward',
          onPress: () => navigation.goBack(),
        }}
        rightAction={{
          icon: 'log-out-outline',
          label: STRINGS.logout,
          onPress: handleLogout,
        }}
      />

      {/* Content */}
      {loading && !refreshing ? (
        <LoadingSpinner text={STRINGS.loadingOrders} />
      ) : error && orders.length === 0 ? (
        <EmptyState
          icon="alert-circle-outline"
          iconColor={COLORS.error}
          title="حدث خطأ"
          subtitle={error}
          actionLabel="حاول مجددا"
          actionIcon="refresh-outline"
          onAction={onRefresh}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="لا توجد طلبات"
          subtitle="قم بإنشاء طلب جديد من خلال إضافة منتج"
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id || item._id || Math.random())}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
});

export default OrdersListScreen;
