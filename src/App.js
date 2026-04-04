/**
 * App Component
 * Root component of the application
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nManager, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { COLORS } from './constants/colors';
import { APP_CONFIG } from './config/appConfig';
import { NotificationProvider } from './context/NotificationContext';

// Ensure RTL layout is enabled for Arabic
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

// Global fix for web to remove the default focus outline on text inputs
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    input:focus, textarea:focus, *[tabindex]:focus {
      outline: none !important;
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" backgroundColor={COLORS.primary} />
      <AuthProvider>
        <NotificationProvider>
          <AppNavigator />
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
