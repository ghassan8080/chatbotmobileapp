/**
 * ProfileScreen Component
 * Displays user profile info with logout functionality
 */

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { SCREEN_NAMES } from '../constants/constants';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('هل تريد تسجيل الخروج؟');
      if (confirmed) logout();
    } else {
      Alert.alert(
        'تسجيل الخروج',
        'هل تريد تسجيل الخروج؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'تسجيل الخروج', style: 'destructive', onPress: () => logout() },
        ]
      );
    }
  };

  const displayName = user?.name || user?.username || user?.email || 'المستخدم';
  const displayEmail = user?.email || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === 'android' && <StatusBar backgroundColor="#fdf3ff" barStyle="dark-content" />}
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>حسابي</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#6a1cf6" />
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          {!!displayEmail && <Text style={styles.displayEmail}>{displayEmail}</Text>}
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{displayName}</Text>
            <Text style={styles.infoLabel}>الاسم</Text>
          </View>
          {!!displayEmail && (
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoValue}>{displayEmail}</Text>
              <Text style={styles.infoLabel}>البريد الإلكتروني</Text>
            </View>
          )}
          {!!user?.phone && (
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoValue}>{user.phone}</Text>
              <Text style={styles.infoLabel}>رقم الهاتف</Text>
            </View>
          )}
        </View>

        {/* Features Card */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.featureRow}
            onPress={() => navigation.navigate(SCREEN_NAMES.COMMENT_REPLY_RULES)}
            activeOpacity={0.7}
          >
            <View style={styles.featureRowContent}>
              <Ionicons name="chatbubbles-outline" size={20} color="#6a1cf6" />
              <Text style={styles.featureText}>إدارة ردود التعليقات</Text>
            </View>
            <Ionicons name="chevron-back" size={20} color="#c0b3cf" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
          <Ionicons name="log-out-outline" size={20} color="#b41340" style={styles.logoutIcon} />
        </TouchableOpacity>

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
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38274c',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ede9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6a1cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38274c',
    textAlign: 'center',
  },
  displayEmail: {
    fontSize: 14,
    color: '#67537c',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f5eeff',
  },
  infoLabel: {
    fontSize: 13,
    color: '#67537c',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#38274c',
    fontWeight: '600',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  featureRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#38274c',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f4',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(180, 19, 64, 0.15)',
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b41340',
  },
  logoutIcon: {
    // icon is on left in RTL, text on right
  },
});

export default ProfileScreen;
