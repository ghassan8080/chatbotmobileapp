/**
 * AppNavigator Component
 * Main navigation container for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager } from 'react-native';

// Screens
import ProductListScreen from '../screens/ProductListScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import OrdersListScreen from '../screens/OrdersListScreen';
import LoginScreen from '../screens/LoginScreen';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Constants
import { SCREEN_NAMES } from '../constants/constants';

// Ensure RTL layout is enabled for Arabic
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? SCREEN_NAMES.PRODUCT_LIST : 'Login'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen 
              name={SCREEN_NAMES.PRODUCT_LIST} 
              component={ProductListScreen} 
            />
            <Stack.Screen 
              name={SCREEN_NAMES.PRODUCT_FORM} 
              component={ProductFormScreen} 
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name={SCREEN_NAMES.PRODUCT_DETAIL} 
              component={ProductDetailScreen} 
            />
            <Stack.Screen 
              name={SCREEN_NAMES.ORDERS_LIST} 
              component={OrdersListScreen} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
