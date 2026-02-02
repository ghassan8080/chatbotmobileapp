import React, { useEffect } from 'react';
import { StatusBar, I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './i18n'; // Initialize i18n

import ProductListScreen from './screens/ProductListScreen';
import ProductFormScreen from './screens/ProductFormScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';

import lightTheme from './theme';

const Stack = createStackNavigator();

const App: React.FC = () => {
    useEffect(() => {
        // Force RTL layout for Arabic
        if (!I18nManager.isRTL) {
            I18nManager.forceRTL(true);
        }
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={lightTheme}>
                <NavigationContainer>
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor="#4CAF50"
                    />
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                            cardStyle: { backgroundColor: '#F9F9F9' },
                        }}
                    >
                        <Stack.Screen
                            name="ProductList"
                            component={ProductListScreen}
                        />
                        <Stack.Screen
                            name="ProductForm"
                            component={ProductFormScreen}
                        />
                        <Stack.Screen
                            name="ProductDetail"
                            component={ProductDetailScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </GestureHandlerRootView>
    );
};

export default App;
