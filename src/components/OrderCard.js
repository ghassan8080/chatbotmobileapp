import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const OrderCard = ({ order, onPress, onConfirmOrder, onDeleteOrder }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.98, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  // Get order status with Arabic support
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending' || s === 'قيد الانتظار') return { color: COLORS.warning, icon: 'time-outline', label: 'قيد الانتظار', bg: '#FFF8E1' }; // Amber-50
    if (s === 'confirmed' || s === 'مؤكد') return { color: COLORS.success, icon: 'checkmark-circle-outline', label: 'مؤكد', bg: '#E8F5E9' }; // Green-50
    if (s === 'delivered' || s === 'تم التسليم') return { color: COLORS.info, icon: 'bicycle-outline', label: 'تم التسليم', bg: '#E3F2FD' }; // Blue-50
    if (s === 'cancelled' || s === 'ملغى') return { color: COLORS.error, icon: 'close-circle-outline', label: 'ملغى', bg: '#FFEBEE' }; // Red-50
    return { color: COLORS.gray[500], icon: 'help-circle-outline', label: status, bg: COLORS.gray[100] };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Extract key order information
  const orderId = order.id || order._id || 'N/A';
  const productName = order.product_name || order.selectedProduct || 'منتج غير محدد';
  const phoneNumber = order.phone || 'N/A';
  const deliveryAddress = order.delivery_address || order.address || 'N/A';
  const rawStatus = order.status || 'pending';
  const orderDate = order.created_at || order.order_date || new Date().toISOString();
  const quantity = order.quantity || 1;
  const statusConfig = getStatusConfig(rawStatus);

  // Check if order is pending
  const isPending = rawStatus?.toLowerCase() === 'pending' || rawStatus?.toLowerCase() === 'قيد الانتظار';

  // Show delete button for pending or confirmed orders
  const isConfirmed = rawStatus?.toLowerCase() === 'confirmed' || rawStatus?.toLowerCase() === 'مؤكد';
  const canDelete = isPending || isConfirmed;

  // Handle delete order with confirmation
  const handleDeletePress = async () => {
    if (isDeleting) return;

    // Web compatibility: use window.confirm, native: use Alert (handled by parent)
    if (Platform.OS === 'web') {
      if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
      setIsDeleting(true);
      try {
        if (onDeleteOrder) await onDeleteOrder(orderId);
      } catch (error) {
        console.error('Delete failed in card:', error);
      } finally {
        setIsDeleting(false);
      }
    } else {
      // On native, delegate confirmation + delete to parent
      if (onDeleteOrder) onDeleteOrder(orderId);
    }
  };

  // Handle confirm order - using window.confirm for web compatibility
  const handleConfirmOrder = async () => {
    // Web compatibility check
    if (Platform.OS === 'web') {
      if (!window.confirm('هل تريد تثبيت هذا الحجز؟')) return;
    }

    setIsConfirming(true);
    try {
      if (onConfirmOrder) {
        await onConfirmOrder(orderId, 'confirmed');
        // Success often handled by parent refresh, but we can alert if needed
      }
    } catch (error) {
      console.error('Order confirmation failed', error);
      alert('خطأ: ' + (error.message || 'فشل تثبيت الحجز'));
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >

        {/* Header: ID & Status & Delete */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.orderId}>طلب #{orderId}</Text>
            <Text style={styles.date}>{formatDate(orderDate)}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
            </View>
            {canDelete && (
              <TouchableOpacity
                style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
                onPress={handleDeletePress}
                disabled={isDeleting}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={COLORS.error || '#EF4444'} />
                ) : (
                  <Ionicons name="trash-outline" size={18} color={COLORS.error || '#EF4444'} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Product Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>المنتج</Text>
            <Text style={styles.value} numberOfLines={1}>{productName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>الكمية</Text>
            <Text style={styles.value}>{quantity}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Contact Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.iconLabel}>
              <Ionicons name="call-outline" size={14} color={COLORS.text.secondary} />
              <Text style={[styles.label, { marginRight: 4 }]}>الهاتف</Text>
            </View>
            <Text style={styles.value} selectable>{phoneNumber}</Text>
          </View>
          <View style={[styles.row, { alignItems: 'flex-start' }]}>
            <View style={[styles.iconLabel, { marginTop: 2 }]}>
              <Ionicons name="location-outline" size={14} color={COLORS.text.secondary} />
              <Text style={[styles.label, { marginRight: 4 }]}>العنوان</Text>
            </View>
            <Text style={[styles.value, { flex: 1, textAlign: 'left' }]} numberOfLines={2}>{deliveryAddress}</Text>
          </View>
        </View>

        {/* Actions */}
        {isPending && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmButton, isConfirming && styles.disabledButton]}
              onPress={handleConfirmOrder}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <Text style={styles.confirmButtonText}>جاري التثبيت...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
                  <Text style={styles.confirmButtonText}>{STRINGS.confirmOrder}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground || '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: COLORS.shadowDark || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Removed side border for cleaner look
  },
  header: {
    flexDirection: 'row-reverse', // RTL: ID Right, Status Left
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    alignItems: 'flex-end',
  },
  headerRight: {
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'right',
  },
  date: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
    textAlign: 'right',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginBottom: 12,
  },
  section: {
    gap: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row-reverse', // Label right, Value left
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconLabel: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
    marginLeft: 12, // Gap between label and value
  },
  value: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'left', // Values often look better aligned left (numbers, etc)
  },
  footer: {
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.success,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: COLORS.gray[400],
  },
  confirmButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default OrderCard;
