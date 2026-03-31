import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const OrderCard = ({ order, onPress, onConfirmOrder, onDeleteOrder, isConfirmingOrder }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.98, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  // Setup exact UI details from the Stitch HTML
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending' || s === 'قيد الانتظار') {
      return { 
        color: '#b48a00', 
        icon: 'time-outline', 
        label: 'قيد الانتظار', 
        bg: '#fff9e6' 
      };
    }
    if (s === 'confirmed' || s === 'مؤكد') {
      return { 
        color: '#564d69', 
        icon: 'lock-closed-outline', 
        label: 'تم التأكيد مسبقاً', 
        bg: '#eaddff' 
      }; 
    }
    if (s === 'delivered' || s === 'تم التسليم' || s === 'تم الشحن') {
      return { 
        color: '#564d69', 
        icon: 'car-outline', 
        label: 'تم الشحن', 
        bg: '#eaddff' 
      }; 
    }
    if (s === 'cancelled' || s === 'ملغى') {
      return { 
        color: '#b41340', 
        icon: 'close-circle-outline', 
        label: 'ملغى', 
        bg: '#ffefef' 
      }; 
    }
    return { color: '#67537c', icon: 'help-circle-outline', label: status || 'مجهول', bg: '#f9edff' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const orderId = order.timestamp || order.id || order._id || 'N/A';
  // Use a fallback hash just for UI if it's too long or non-numeric
  let displayId = String(orderId);
  if (displayId.length > 10) displayId = displayId.slice(-10).toUpperCase(); 
  
  const productName = order.product_name || order.selectedProduct || 'منتج غير محدد';
  const phoneNumber = order.phone || 'N/A';
  const deliveryAddress = order.delivery_address || order.address || 'N/A';
  const rawStatus = order.status || 'pending';
  const orderDate = order.created_at || order.order_date || new Date().toISOString();
  const quantity = order.quantity || 1;
  const statusConfig = getStatusConfig(rawStatus);

  const isPending = rawStatus?.toLowerCase() === 'pending' || rawStatus?.toLowerCase() === 'قيد الانتظار';
  const isConfirmed = rawStatus?.toLowerCase() === 'confirmed' || rawStatus?.toLowerCase() === 'مؤكد';
  
  // Design specifies delete is available initially
  const canDelete = isPending || isConfirmed;

  const handleDeletePress = async () => {
    if (isDeleting) return;
    if (Platform.OS === 'web') {
      if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
      setIsDeleting(true);
      try {
        if (onDeleteOrder) await onDeleteOrder(orderId);
      } finally {
        setIsDeleting(false);
      }
    } else {
      setIsDeleting(true);
      if (onDeleteOrder) onDeleteOrder(orderId);
      // Let parent handle completion, optimistic UI handles the rest.
      setTimeout(() => setIsDeleting(false), 2000); 
    }
  };

  const handleConfirmOrderPress = async () => {
    if (Platform.OS === 'web') {
      if (!window.confirm('هل تريد تثبيت هذا الحجز؟')) return;
    }
    if (onConfirmOrder) onConfirmOrder(orderId, 'confirmed');
  };

  const isConfirming = isConfirmingOrder || false;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }], opacity: (isConfirmed && !isPending) ? 0.8 : 1 }]}>
      <View style={styles.cardWrapper}>
        <View style={styles.container}>
          
          {/* Header Section */}
          <View style={styles.header}>
            {canDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeletePress}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#b41340" />
                ) : (
                  <MaterialIcons name="delete" size={20} color="rgba(180, 19, 64, 0.4)" />
                )}
              </TouchableOpacity>
            )}
            
            <View style={styles.headerInfo}>
              <View style={styles.badgeRow}>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                  <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
                </View>
              </View>
              <Text style={styles.date}>رقم الطلب: <Text style={styles.orderIdText}>#{displayId}</Text></Text>
              <Text style={styles.date}>بتاريخ: {formatDate(orderDate)}</Text>
            </View>
          </View>

          {/* Content Grid */}
          <View style={styles.grid}>
            {/* Row 1 */}
            <View style={styles.gridItem}>
              <Text style={styles.label}>الكمية</Text>
              <Text style={styles.value}>{quantity}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>المنتج</Text>
              <Text style={styles.value} numberOfLines={1}>{productName}</Text>
            </View>

            {/* Row 2 */}
            <View style={styles.gridItem}>
              <Text style={styles.label}>العنوان</Text>
              <Text style={styles.value} numberOfLines={2}>{deliveryAddress}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>الهاتف</Text>
              <Text style={styles.value} selectable>{phoneNumber}</Text>
            </View>
          </View>

          {/* Action Button */}
          {isPending ? (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleConfirmOrderPress}
              disabled={isConfirming}
              style={styles.actionButtonContainer}
            >
              <LinearGradient
                colors={['#6a1cf6', '#ac8eff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryGradient}
              >
                {isConfirming ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>تثبيت الحجز</Text>
                    <Ionicons name="checkmark-circle" size={24} color="#ffffff" style={styles.buttonIcon} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : isConfirmed ? (
            <View style={styles.disabledButton}>
              <Text style={styles.disabledButtonText}>تم التأكيد مسبقاً</Text>
              <Ionicons name="lock-closed" size={24} color="rgba(103, 83, 124, 0.4)" style={styles.buttonIcon} />
            </View>
          ) : null}

        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    paddingBottom: 24, // Matches styling for gap
  },
  container: {
    backgroundColor: '#ffffff', // surface-container-lowest
    borderRadius: 16, // rounded-lg
    padding: 24, // p-6
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'flex-end', // RTL
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700', // font-bold
    marginRight: 4, // gap-1 in RTL
  },
  date: {
    fontSize: 12,
    color: '#67537c', // text-on-surface-variant
    textAlign: 'right',
    marginTop: 2,
  },
  orderIdText: {
    fontWeight: '700',
    color: '#38274c', // text-on-background
  },
  deleteButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(180, 19, 64, 0.05)', // hover:bg-error/5
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  gridItem: {
    width: '50%',
    alignItems: 'flex-end', // RTL content alignment
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#67537c', // text-on-surface-variant
    marginBottom: 4, 
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38274c', // text-on-background
    textAlign: 'right',
  },
  actionButtonContainer: {
    width: '100%',
    shadowColor: '#6a1cf6', // shadow-primary/20
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  primaryGradient: {
    width: '100%',
    paddingVertical: 16, // py-4
    borderRadius: 12, // rounded-xl
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginLeft: 8, // gap-2 RTL
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18, // text-lg
  },
  disabledButton: {
    width: '100%',
    backgroundColor: '#efdbff', // bg-surface-container-high
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButtonText: {
    color: 'rgba(103, 83, 124, 0.4)', // text-on-surface-variant/40
    fontWeight: '700',
    fontSize: 18,
  },
});

export default OrderCard;
