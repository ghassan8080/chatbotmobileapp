/**
 * App Component
 * Root component of the application
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nManager } from 'react-native';
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
