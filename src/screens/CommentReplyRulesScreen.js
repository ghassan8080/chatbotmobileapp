/**
 * CommentReplyRulesScreen Component
 * Screen for managing comment reply rules
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { getCommentRules, addCommentRule, deleteCommentRule } from '../api/commentRulesApi';
import AppInput from '../components/AppInput';

const CommentReplyRulesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { products, fetchProducts, loading: loadingProducts } = useProducts();

  const [rules, setRules] = useState([]);
  const [loadingRules, setLoadingRules] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [platform, setPlatform] = useState('Facebook');
  const [postId, setPostId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [enabled, setEnabled] = useState(true);

  // Modal State
  const [productModalVisible, setProductModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingRules(true);
    try {
      await fetchProducts();
      if (user?.user_id) {
        const rulesData = await getCommentRules(user.user_id);
        setRules(rulesData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('خطأ', 'فشل في تحميل القواعد الحالية.');
    } finally {
      setLoadingRules(false);
    }
  };

  const handleSave = async () => {
    if (!postId || postId.trim().length < 5) {
      Alert.alert('تنبيه', 'معرف المنشور مطلوب ويجب أن لا يقل عن 5 أحرف.');
      return;
    }
    if (!selectedProduct) {
      Alert.alert('تنبيه', 'يرجى اختيار منتج.');
      return;
    }
    if (!messageTemplate || messageTemplate.trim().length === 0) {
      Alert.alert('تنبيه', 'يرجى كتابة قالب الرسالة.');
      return;
    }

    try {
      setSubmitting(true);
      const ruleData = {
        seller_id: user.user_id,
        platform: platform,
        post_id: postId.trim(),
        product_id: selectedProduct.id,
        enabled: enabled,
        message_template: messageTemplate.trim()
      };

      await addCommentRule(ruleData);
      Alert.alert('نجاح', 'تمت إضافة القاعدة بنجاح.');
      
      // Reset form
      setPostId('');
      setSelectedProduct(null);
      setMessageTemplate('');
      setEnabled(true);
      
      // Reload rules
      loadData();
    } catch (error) {
      console.error('Error saving rule:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ القاعدة.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (ruleId) => {
    Alert.alert(
      'حذف القاعدة',
      'هل تريد حذف هذه القاعدة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoadingRules(true);
              await deleteCommentRule(ruleId);
              loadData();
            } catch (error) {
              console.error('Error deleting rule:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف القاعدة.');
              setLoadingRules(false);
            }
          } 
        }
      ]
    );
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productModalItem}
      onPress={() => {
        setSelectedProduct(item);
        setProductModalVisible(false);
      }}
    >
      <Text style={styles.productModalItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === 'android' && <StatusBar backgroundColor="#fdf3ff" barStyle="dark-content" />}
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}></View>
        <View style={styles.headerRight}>
          <Text style={styles.headerTitle}>ردود التعليقات</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} hitSlop={{top:10, bottom:10, left:10, right:10}}>
            <Ionicons name="arrow-forward" size={24} color="#38274c" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Note Banner */}
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={20} color="#b41340" style={styles.warningIcon} />
            <Text style={styles.warningText}>
              ملاحظة: هذه الميزة تتطلب موافقة Meta على صلاحية "pages_manage_posts" لاستقبال التعليقات.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>إضافة قاعدة جديدة</Text>

            {/* Platform Picker */}
            <Text style={styles.inputLabel}>المنصة</Text>
            <View style={styles.platformSelector}>
              <TouchableOpacity
                style={[styles.platformOption, platform === 'Facebook' && styles.platformOptionActive]}
                onPress={() => setPlatform('Facebook')}
              >
                <Ionicons name="logo-facebook" size={20} color={platform === 'Facebook' ? '#1877F2' : '#67537c'} />
                <Text style={[styles.platformOptionText, platform === 'Facebook' && styles.platformOptionTextActive]}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.platformOption, platform === 'Instagram' && styles.platformOptionActive]}
                onPress={() => setPlatform('Instagram')}
              >
                <Ionicons name="logo-instagram" size={20} color={platform === 'Instagram' ? '#E4405F' : '#67537c'} />
                <Text style={[styles.platformOptionText, platform === 'Instagram' && styles.platformOptionTextActive]}>Instagram</Text>
              </TouchableOpacity>
            </View>

            <AppInput
              label="معرف المنشور (Post ID)"
              value={postId}
              onChangeText={setPostId}
              placeholder="أدخل معرف المنشور هنا"
              icon="document-text-outline"
            />

            {/* Product Picker */}
            <Text style={styles.inputLabel}>المنتج المرتبط</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setProductModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.dropdownContent}>
                <Ionicons name="cube-outline" size={20} color="#67537c" style={styles.dropdownIcon} />
                <Text style={[styles.dropdownText, !selectedProduct && styles.dropdownPlaceholder]}>
                  {selectedProduct ? selectedProduct.name : 'اختر المنتج...'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#67537c" />
            </TouchableOpacity>

            <AppInput
              label="قالب الرسالة"
              value={messageTemplate}
              onChangeText={setMessageTemplate}
              placeholder="اكتب رسالة الرد هنا..."
              multiline
              numberOfLines={4}
              icon="chatbubble-ellipses-outline"
            />

            {/* Enabled Toggle */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>تفعيل القاعدة</Text>
              <Switch
                trackColor={{ false: '#d1c4e9', true: '#ac8eff' }}
                thumbColor={enabled ? '#6a1cf6' : '#f4f3f4'}
                ios_backgroundColor="#d1c4e9"
                onValueChange={setEnabled}
                value={enabled}
              />
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={submitting}
              style={styles.actionButtonContainer}
            >
              <LinearGradient
                colors={submitting ? ['#efdbff', '#efdbff'] : ['#6a1cf6', '#ac8eff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryGradient}
              >
                <Text style={[styles.buttonText, submitting && styles.disabledButtonText]}>
                  حفظ القاعدة
                </Text>
                {!submitting && <Ionicons name="save-outline" size={20} color="#ffffff" style={styles.buttonIcon} />}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* List Section */}
          <Text style={styles.listTitle}>القواعد الحالية</Text>
          
          {loadingRules ? (
            <ActivityIndicator size="large" color="#6a1cf6" style={{ marginTop: 20 }} />
          ) : rules.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#d1c4e9" />
              <Text style={styles.emptyText}>لا توجد قواعد مسجلة حالياً</Text>
            </View>
          ) : (
            rules.map((rule, index) => {
              // Find product name if not provided by backend
              const prodName = rule.product_name || 
                               products.find(p => String(p.id) === String(rule.product_id))?.name || 
                               `منتج #${rule.product_id}`;

              return (
                <View key={rule.id || index} style={styles.ruleCard}>
                  <View style={styles.ruleHeader}>
                    <View style={styles.rulePlatform}>
                      <Ionicons 
                        name={rule.platform === 'Instagram' ? 'logo-instagram' : 'logo-facebook'} 
                        size={18} 
                        color={rule.platform === 'Instagram' ? '#E4405F' : '#1877F2'} 
                      />
                      <Text style={styles.rulePlatformText}>{rule.platform}</Text>
                    </View>
                    <View style={[styles.statusBadge, !rule.enabled && styles.statusBadgeDisabled]}>
                      <Text style={[styles.statusText, !rule.enabled && styles.statusTextDisabled]}>
                        {rule.enabled ? 'مفعل' : 'معطل'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.ruleDetails}>
                    <Text style={styles.rulePostId}>المنشور: {rule.post_id}</Text>
                    <Text style={styles.ruleProductName}>المنتج: {prodName}</Text>
                  </View>
                  
                  <View style={styles.ruleFooter}>
                    <Text style={styles.ruleMessage} numberOfLines={2}>"{rule.message_template}"</Text>
                    <TouchableOpacity onPress={() => handleDelete(rule.id)} style={styles.deleteButton}>
                      <Ionicons name="trash-outline" size={20} color="#b41340" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Product Selection Modal */}
      <Modal
        visible={productModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر المنتج</Text>
              <TouchableOpacity onPress={() => setProductModalVisible(false)}>
                <Ionicons name="close" size={24} color="#38274c" />
              </TouchableOpacity>
            </View>
            
            {loadingProducts ? (
              <ActivityIndicator size="large" color="#6a1cf6" style={{ padding: 40 }} />
            ) : (
              <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderProductItem}
                ListEmptyComponent={<Text style={styles.emptyText}>لا توجد منتجات</Text>}
                contentContainerStyle={{ padding: 16 }}
              />
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdf3ff',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(253, 243, 255, 0.8)',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38274c',
    marginRight: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 999,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: '#fff0f4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(180, 19, 64, 0.15)',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    color: '#b41340',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#38274c',
    marginBottom: 20,
    textAlign: 'right',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8e7aa8',
    marginBottom: 8,
    marginLeft: 4,
    textAlign: 'right',
  },
  platformSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  platformOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#faf7ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#faf7ff',
  },
  platformOptionActive: {
    backgroundColor: 'rgba(106, 28, 246, 0.05)',
    borderColor: '#6a1cf6',
  },
  platformOptionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#67537c',
  },
  platformOptionTextActive: {
    color: '#6a1cf6',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#faf7ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 20,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 15,
    color: '#38274c',
    textAlign: 'right',
  },
  dropdownPlaceholder: {
    color: '#a094b3',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#38274c',
  },
  actionButtonContainer: {
    width: '100%',
    shadowColor: '#6a1cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryGradient: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
  disabledButtonText: {
    color: 'rgba(103, 83, 124, 0.4)',
  },
  buttonIcon: {
    marginLeft: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#38274c',
    marginBottom: 16,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f5eeff',
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8e7aa8',
    textAlign: 'center',
  },
  ruleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#fdf3ff',
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rulePlatform: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rulePlatformText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#38274c',
  },
  statusBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeDisabled: {
    backgroundColor: 'rgba(142, 122, 168, 0.15)',
  },
  statusText: {
    color: '#248a3d',
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextDisabled: {
    color: '#67537c',
  },
  ruleDetails: {
    backgroundColor: '#faf7ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  rulePostId: {
    fontSize: 13,
    color: '#67537c',
    marginBottom: 4,
    textAlign: 'right',
  },
  ruleProductName: {
    fontSize: 14,
    color: '#38274c',
    fontWeight: '600',
    textAlign: 'right',
  },
  ruleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f5eeff',
    paddingTop: 12,
  },
  ruleMessage: {
    flex: 1,
    fontSize: 13,
    color: '#67537c',
    fontStyle: 'italic',
    textAlign: 'right',
    marginRight: 12,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fff0f4',
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(56, 39, 76, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5eeff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#38274c',
  },
  productModalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5eeff',
  },
  productModalItemText: {
    fontSize: 16,
    color: '#38274c',
    textAlign: 'right',
  },
});

export default CommentReplyRulesScreen;
