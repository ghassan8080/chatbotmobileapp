import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, SafeAreaView, Platform, StatusBar, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import OrderCard from '../components/OrderCard';
import { useOrders } from '../hooks/useOrders';
import { updateOrderStatus, confirmBooking, deleteOrder, getChatRequests, dismissChatRequest } from '../api/ordersApi';
import { AuthContext } from '../context/AuthContext';

const OrdersListScreen = ({ navigation }) => {
  const { orders, loading, refreshing, onRefresh, error, fetchOrders } = useOrders();
  const { logout, user } = useContext(AuthContext);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [chatRequests, setChatRequests] = useState([]);

  const loadChatRequests = async () => {
    if (user?.store_name) {
      try {
        const reqs = await getChatRequests();
        setChatRequests(reqs);
      } catch (e) {
        console.error('Failed to load chat requests:', e);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      loadChatRequests();
    }, [fetchOrders, user])
  );

  const handleRefresh = async () => {
    await onRefresh();
    await loadChatRequests();
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

  const handleDismissChat = async (senderId) => {
    try {
      await dismissChatRequest(senderId);
      await loadChatRequests();
    } catch (err) {
      Alert.alert('خطأ', 'فشل تغيير حالة المحادثة');
    }
  };

  const renderChatRequests = () => {
    if (!user?.store_name || chatRequests.length === 0) return null;
    return (
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#38274c', marginBottom: 12, textAlign: 'right' }}>
          زبائن يريدون التحدث 💬
        </Text>
        {chatRequests.map(req => (
          <View key={req.id} style={styles.chatCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatCardTitle}>زبون يريد التحدث معك مباشرة</Text>
              <Text style={styles.chatCardSubtitle}>ID: {req.senderId.slice(-8)}</Text>
              <Text style={styles.chatCardTime}>{new Date(req.requestedAt).toLocaleString('ar-SA')}</Text>
            </View>
            <View style={styles.chatCardActions}>
               <TouchableOpacity style={[styles.chatBtn, { backgroundColor: COLORS.primary }]} onPress={() => Linking.openURL(req.messengerLink)}>
                 <Text style={styles.chatBtnText}>فتح المحادثة</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.chatBtn, { backgroundColor: '#e2e8f0', marginTop: 8 }]} onPress={() => handleDismissChat(req.senderId)}>
                 <Text style={[styles.chatBtnText, { color: '#38274c' }]}>تم الرد ✓</Text>
               </TouchableOpacity>
            </View>
          </View>
        ))}
        {orders.length > 0 && (
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#38274c', marginTop: 16, marginBottom: 8, textAlign: 'right' }}>
            طلبات جديدة 🛍️
          </Text>
        )}
      </View>
    );
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
          </View>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>طلباتي</Text>
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
            onAction={handleRefresh}
          />
        ) : orders.length === 0 && chatRequests.length === 0 ? (
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
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderChatRequests()}
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
  chatCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chatCardTitle: { fontSize: 15, fontWeight: '700', color: '#38274c', textAlign: 'right', marginBottom: 4 },
  chatCardSubtitle: { fontSize: 13, color: '#67537c', textAlign: 'right', marginBottom: 4 },
  chatCardTime: { fontSize: 12, color: '#a094ab', textAlign: 'right' },
  chatCardActions: { marginLeft: 16, minWidth: 100 },
  chatBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center' },
  chatBtnText: { color: 'white', fontWeight: '600', fontSize: 13 },
});

export default OrdersListScreen;
