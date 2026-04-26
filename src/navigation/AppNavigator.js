/**
 * AppNavigator Component
 * Main navigation container.
 * - Auth flow: Login → Registration → PendingApproval (Stack)
 * - Authenticated flow: Bottom Tab (Home | Orders | Profile)
 *   with sub-stack for ProductForm and ProductDetail (modals).
 */

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { I18nManager } from 'react-native';

// Screens
import ProductListScreen from '../screens/ProductListScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import OrdersListScreen from '../screens/OrdersListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import PendingApprovalScreen from '../screens/PendingApprovalScreen';
import ChatRequestsScreen from '../screens/ChatRequestsScreen';

// Custom Tab Bar
import CustomTabBar from '../components/CustomTabBar';

// Context & Constants
import { AuthContext } from '../context/AuthContext';
import { SCREEN_NAMES } from '../constants/constants';

// Ensure RTL layout is enabled for Arabic
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom Tab Navigator — authenticated users only.
 * Houses Home (Products), Orders, Profile.
 */
const MainTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    {/* RTL: tabs render right-to-left visually when device is RTL */}
    <Tab.Screen name="Home" component={ProductListScreen} />
    <Tab.Screen name="Orders" component={OrdersListScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

/**
 * Root Stack — sits on top of tabs to allow modal screens (ProductForm, ProductDetail).
 */
const AuthenticatedNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    <Stack.Screen
      name={SCREEN_NAMES.PRODUCT_FORM}
      component={ProductFormScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen
      name={SCREEN_NAMES.PRODUCT_DETAIL}
      component={ProductDetailScreen}
    />
    <Stack.Screen
      name="ChatRequests"
      component={ChatRequestsScreen}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="PendingApproval" component={PendingApprovalScreen} />
          </>
        ) : (
          <Stack.Screen name="Authenticated" component={AuthenticatedNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
