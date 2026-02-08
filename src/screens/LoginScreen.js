import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('Login Button Pressed');
    if (!email || !password) {
        Alert.alert(STRINGS.error, STRINGS.requiredField || 'All fields are required');
        return;
    }

    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      const credentials = { email, password };
      await login(credentials);
      console.log('Login successful');
    } catch (err) {
      console.error('Login failed in screen:', err);
      Alert.alert(STRINGS.error, err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
            <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🛍️</Text>
            </View>
            <Text style={styles.welcomeText}>مرحباً بك!</Text>
            <Text style={styles.subtitle}>{STRINGS.login}</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{STRINGS.email}</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="example@mail.com"
                    placeholderTextColor={COLORS.input.placeholder}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{STRINGS.password}</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.input.placeholder}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin} 
                disabled={loading}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>
                    {loading ? STRINGS.loading : STRINGS.login}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconText: {
    fontSize: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 8,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.input.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.input.background,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 18,
  },
});

export default LoginScreen;
