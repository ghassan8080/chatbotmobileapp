import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/apiConfig';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = STRINGS.requiredField || 'هذا الحقل مطلوب';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = STRINGS.requiredField || 'هذا الحقل مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    // Password validation
    if (!password) {
      newErrors.password = STRINGS.requiredField || 'هذا الحقل مطلوب';
    } else if (password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    // Store name validation
    if (!storeName.trim()) {
      newErrors.storeName = STRINGS.requiredField || 'هذا الحقل مطلوب';
    }

    // Phone validation - Iraqi format: 07XXXXXXXXX
    if (!phone.trim()) {
      newErrors.phone = STRINGS.requiredField || 'هذا الحقل مطلوب';
    } else if (!/^07\d{9}$/.test(phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 07 ويتكون من 11 رقم)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      console.log('Sending registration request to:', `${API_BASE_URL}/register`);
      console.log('Registration data:', {
        name: name.trim(),
        email: email.trim(),
        store_name: storeName.trim(),
        phone: phone.trim(),
      });

      const response = await axios.post(
        `${API_BASE_URL}/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password,
          store_name: storeName.trim(),
          phone: phone.trim(),
        },
        {
          timeout: API_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Registration response status:', response.status);
      console.log('Registration response data:', response.data);

      // Check for success - accept either success: true or status: 'success' or HTTP 200-299
      const isSuccess = response.data?.success === true ||
                       response.data?.status === 'success' ||
                       (response.status >= 200 && response.status < 300);

      if (isSuccess) {
        const successMessage = response.data?.message || 'تم التسجيل بنجاح! انتظر الموافقة من الإدارة';

        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        setStoreName('');
        setPhone('');
        setErrors({});

        // Show success message
        setSuccessMessage(successMessage);

        // Navigate to Login screen after 2 seconds
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        // Handle case where request succeeded but API returned an error
        const errorMessage = response.data?.message ||
                           response.data?.error ||
                           'فشل التسجيل. يرجى المحاولة مرة أخرى.';
        setErrorMessage(errorMessage);
      }
    } catch (err) {
      console.error('Registration error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      let errorMessage = 'حدث خطأ أثناء التسجيل';

      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message ||
                      err.response.data?.error ||
                      err.response.data?.details ||
                      `خطأ في الخادم: ${err.response.status}`;
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
      } else {
        // Error in request setup
        errorMessage = err.message || errorMessage;
      }

      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📝</Text>
          </View>
          <Text style={styles.welcomeText}>إنشاء حساب جديد</Text>
          <Text style={styles.subtitle}>أكمل بياناتك للتسجيل</Text>
        </View>

        {/* Form Section */}
        <Animated.View
          style={[
            styles.form,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Success Message */}
          {successMessage ? (
            <View style={styles.messageContainer}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.messageContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <AppInput
            label="الاسم الكامل"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: null }));
            }}
            placeholder="محمد أحمد"
            icon="person-outline"
            error={errors.name}
          />

          <AppInput
            label={STRINGS.email}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: null }));
            }}
            placeholder="example@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            error={errors.email}
          />

          <AppInput
            label="كلمة المرور"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: null }));
            }}
            placeholder="••••••••"
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
          />

          <AppInput
            label="اسم المتجر"
            value={storeName}
            onChangeText={(text) => {
              setStoreName(text);
              if (errors.storeName) setErrors(prev => ({ ...prev, storeName: null }));
            }}
            placeholder="متجر العطور"
            icon="storefront-outline"
            error={errors.storeName}
          />

          <AppInput
            label="رقم الهاتف"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
            }}
            placeholder="07701234567"
            keyboardType="phone-pad"
            maxLength={11}
            icon="call-outline"
            error={errors.phone}
          />

          <View style={styles.buttonWrapper}>
            <AppButton
              title={loading ? STRINGS.loading : 'تسجيل'}
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              size="large"
              icon={loading ? undefined : 'person-add-outline'}
              iconPosition="right"
            />
          </View>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>لديك حساب بالفعل؟ </Text>
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              سجل دخولك
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.primaryLight + '30',
  },
  iconText: {
    fontSize: 42,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 6,
    fontWeight: '500',
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonWrapper: {
    marginTop: 8,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginLinkText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegistrationScreen;
