import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const getSecureItem = async (key) => {
    if (isWeb) {
        return await AsyncStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
};

export const setSecureItem = async (key, value) => {
    if (isWeb) {
        return await AsyncStorage.setItem(key, value);
    }
    return await SecureStore.setItemAsync(key, value);
};

export const deleteSecureItem = async (key) => {
    if (isWeb) {
        return await AsyncStorage.removeItem(key);
    }
    return await SecureStore.deleteItemAsync(key);
};
