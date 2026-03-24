
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import AppButton from '../components/AppButton';

const PendingApprovalScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email } = route.params || { email: '' };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Icon Section */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⏳</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>حسابك قيد المراجعة</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          نحن نراجع طلبك الآن. سنتواصل معك قريباً عبر:{' '}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* Back to Login Button */}
        <View style={styles.buttonWrapper}>
          <AppButton
            title="العودة لتسجيل الدخول"
            onPress={() => navigation.navigate('Login')}
            size="large"
            icon="log-in-outline"
            iconPosition="right"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F6F7FB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    borderWidth: 3,
    borderColor: COLORS.primaryLight + '30',
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  emailText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 400,
  },
});

export default PendingApprovalScreen;
