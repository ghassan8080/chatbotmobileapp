import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    if (!email) newErrors.email = STRINGS.requiredField || 'هذا الحقل مطلوب';
    if (!password) newErrors.password = STRINGS.requiredField || 'هذا الحقل مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    console.log('Login Button Pressed');
    if (!validate()) return;

    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      const credentials = { email, password };
      await login(credentials);
      console.log('Login successful');
    } catch (err) {
      console.error('Login failed in screen:', err);
      setErrors({ general: err.message || 'Login failed' });
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
            <Text style={styles.iconText}>🛍️</Text>
          </View>
          <Text style={styles.welcomeText}>مرحباً بك!</Text>
          <Text style={styles.subtitle}>{STRINGS.login}</Text>
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
          {errors.general && (
            <View style={styles.generalError}>
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

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
            label={STRINGS.password}
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

          <View style={styles.buttonWrapper}>
            <AppButton
              title={loading ? STRINGS.loading : STRINGS.login}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              size="large"
              icon={loading ? undefined : 'log-in-outline'}
              iconPosition="right"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.primaryLight + '30',
  },
  iconText: {
    fontSize: 42,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 6,
    fontWeight: '500',
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  generalError: {
    backgroundColor: COLORS.errorLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  generalErrorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: 8,
  },
});

export default LoginScreen;
