import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import OrderCard from '../components/OrderCard';
import { useOrders } from '../hooks/useOrders';
import { updateOrderStatus, confirmBooking, deleteOrder } from '../api/ordersApi';
import { AuthContext } from '../context/AuthContext';

const OrdersListScreen = ({ navigation }) => {
  const { orders, loading, refreshing, onRefresh, error, fetchOrders } = useOrders();
  const { logout } = useContext(AuthContext);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const handleLogout = async () => {
    // Keep confirmation logic for both platforms
    const confirmed = Platform.OS === 'web' 
        ? window.confirm('هل تريد تسجيل الخروج؟') 
        : true; // In Native normally we'd trigger an Alert.alert, assuming true for now unless we add Alert block

    if (confirmed) {
      try {
        await logout();
      } catch (err) {
        alert('Error logging out: ' + err.message);
      }
    }
  };

  /**
   * Handle order confirmation
   */
  const handleConfirmOrder = async (orderId, newStatus) => {
    try {
      setConfirmingOrderId(orderId);
      await confirmBooking(orderId);
      Alert.alert(STRINGS.success, STRINGS.confirmSuccess);
      await fetchOrders();
    } catch (err) {
      Alert.alert('خطأ', err.message || 'فشل تثبيت الحجز');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  /**
   * Handle delete order
   */
  const handleDeleteOrder = async (orderId) => {
    if (deletingOrderId) return;
    setDeletingOrderId(orderId);
    try {
      await deleteOrder(orderId);
      alert('تم حذف الطلب بنجاح');
      await fetchOrders();
    } catch (err) {
      alert('خطأ: ' + (err.message || 'فشل حذف الطلب'));
      await fetchOrders();
    } finally {
      setDeletingOrderId(null);
    }
  };

  const renderItem = ({ item }) => (
    <OrderCard
      order={item}
      onPress={() => {}}
      onConfirmOrder={handleConfirmOrder}
      onDeleteOrder={handleDeleteOrder}
      isConfirmingOrder={confirmingOrderId === (item.timestamp || item.id || item._id)} 
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === 'android' && <StatusBar backgroundColor="#fdf3ff" barStyle="dark-content" />}
      <View style={styles.container}>
        
        {/* Custom Glass-nav Header */}
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#67537c" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>طلباتي</Text>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-forward" size={24} color="#6a1cf6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>مرحباً بك مجدداً</Text>
          <Text style={styles.greetingSubtitle}>تتبع طلباتك الحالية وقم بتأكيد حجوزاتك بسهولة</Text>
        </View>

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
            keyExtractor={(item) => String(item.timestamp || item.id || item._id || Math.random())}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdf3ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fdf3ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(253, 243, 255, 0.8)',
    // shadow for glass nav
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 999,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38274c',
    marginRight: 16,
  },
  greetingSection: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'flex-end', // RTL alignment
  },
  greetingTitle: {
    fontSize: 30, // 3xl roughly
    fontWeight: '900', // font-black
    color: '#38274c', // text-on-background
    letterSpacing: -0.5, // tracking-tight
    textAlign: 'right',
  },
  greetingSubtitle: {
    fontSize: 15,
    color: '#67537c', // text-on-surface-variant
    marginTop: 4,
    textAlign: 'right',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Enough bottom padding for navigation
    flexGrow: 1,
  },
});

export default OrdersListScreen;
