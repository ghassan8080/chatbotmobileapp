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
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 32,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginLeft: 8,
    minWidth: 85,
    width: 85,
  },
  value: {
    fontSize: 13,
    color: COLORS.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  addressValue: {
    fontSize: 12,
    color: COLORS.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  actionSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.gray[50],
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  arrow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    opacity: 0.5,
  },
});

export default OrderCard;
