/**
 * OrderCard Component
 * Displays an order in a card layout
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const OrderCard = ({ order, onPress, onConfirmOrder }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  // Get order status with Arabic support
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'قيد الانتظار':
        return COLORS.warning;
      case 'confirmed':
      case 'مؤكد':
        return COLORS.primary; // Changed to green
      case 'delivered':
      case 'تم التسليم':
        return COLORS.info; // Changed to blue
      case 'cancelled':
      case 'ملغى':
        return COLORS.error;
      default:
        return COLORS.gray[400];
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
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
  const status = order.status || 'pending';
  const orderDate = order.created_at || order.order_date || new Date().toISOString();
  const quantity = order.quantity || 1;

  // Check if order is pending
  const isPending = status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'قيد الانتظار';

  // Handle confirm order
  const handleConfirmOrder = () => {
    Alert.alert(
      STRINGS.confirmOrder,
      STRINGS.confirmOrderMessage,
      [
        {
          text: STRINGS.cancel,
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
        {
          text: STRINGS.confirm,
          onPress: async () => {
            setIsConfirming(true);
            try {
              if (onConfirmOrder) {
                await onConfirmOrder(orderId, 'confirmed');
              }
            } catch (error) {
              console.error('Error confirming order:', error);
              Alert.alert(STRINGS.error, error.message || STRINGS.operationFailed);
            } finally {
              setIsConfirming(false);
            }
          },
          style: 'default',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* Order Header */}
      <View style={styles.header}>
        <Text style={styles.orderId}>طلب رقم: {orderId}</Text>
        <Text style={styles.date}>{formatDate(orderDate)}</Text>
      </View>

      {/* Product Info */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Ionicons name="cube" size={16} color={COLORS.primary} />
          <Text style={styles.label}>المنتج:</Text>
          <Text style={styles.value} numberOfLines={1}>{productName}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Ionicons name="layers" size={16} color={COLORS.primary} />
          <Text style={styles.label}>الكمية:</Text>
          <Text style={styles.value}>{quantity}</Text>
        </View>
      </View>

      {/* Contact & Delivery Info */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Ionicons name="call" size={16} color={COLORS.primary} />
          <Text style={styles.label}>الهاتف:</Text>
          <Text style={styles.value}>{phoneNumber}</Text>
        </View>
        <View style={styles.addressRow}>
          <Ionicons name="location" size={16} color={COLORS.primary} />
          <Text style={styles.label}>عنوان التسليم:</Text>
          <Text style={styles.addressValue} numberOfLines={2}>
            {deliveryAddress}
          </Text>
        </View>
      </View>

      {/* Confirm Order Button - Only show for pending orders */}
      {isPending && (
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              isConfirming && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirmOrder}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <Ionicons
                  name="hourglass"
                  size={16}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.confirmButtonText}>جاري التثبيت...</Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.confirmButtonText}>{STRINGS.confirmOrder}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Arrow indicator */}
      <View style={styles.arrow}>
        <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderRightWidth: 6, // Changed to Right for RTL visual flow
    borderRightColor: COLORS.primary,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12, // Moved to LEFT to avoid overlap with Arabic text on right
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
    marginTop: 8,
    alignItems: 'flex-end', // Align header content to right
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    textAlign: 'right',
  },
  date: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 4,
    textAlign: 'right',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  sectionRow: {
    flexDirection: 'row-reverse', // Reverse for RTL: Icon/Label on Right
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'flex-start', // Start from right (because row-reverse)
  },
  addressRow: {
    flexDirection: 'row-reverse', // Reverse for RTL
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginRight: 8, // Changed marginLeft to marginRight
    marginLeft: 0,
    width: 100,
    textAlign: 'right', // Align text right
  },
  value: {
    fontSize: 15,
    color: COLORS.text.primary,
    flex: 1,
    fontWeight: '600',
    textAlign: 'right', // Align text right
  },
  addressValue: {
    fontSize: 14,
    color: COLORS.text.primary,
    flex: 1,
    lineHeight: 20,
    textAlign: 'right', // Align text right
  },
  actionSection: {
    padding: 16,
    backgroundColor: COLORS.gray[50],
  },
  confirmButton: {
    flexDirection: 'row-reverse', // Icon on right, text on left (or vice versa depending on pref)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
    backgroundColor: COLORS.gray[400],
  },
  confirmButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8, // Adjusted spacing
  },
  buttonIcon: {
    marginLeft: 4, // Adjusted spacing
  },
  arrow: {
    position: 'absolute',
    bottom: 16,
    left: 16, // Moved arrow to left
    opacity: 0.3,
    transform: [{ rotate: '180deg' }], // E.g. point left
  },
});

export default OrderCard;
