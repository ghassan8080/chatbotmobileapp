import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * Secure storage for sensitive data using encrypted storage
 */

const KEYS = {
    API_KEY: 'api_key',
    USER_TOKEN: 'user_token',
};

export const secureStorage = {
    /**
     * Store API key securely
     */
    async setApiKey(apiKey: string): Promise<void> {
        try {
            await EncryptedStorage.setItem(KEYS.API_KEY, apiKey);
        } catch (error) {
            console.error('Error storing API key:', error);
            throw new Error('فشل حفظ مفتاح API');
        }
    },

    /**
     * Retrieve API key
     */
    async getApiKey(): Promise<string | null> {
        try {
            return await EncryptedStorage.getItem(KEYS.API_KEY);
        } catch (error) {
            console.error('Error retrieving API key:', error);
            return null;
        }
    },

    /**
     * Remove API key
     */
    async removeApiKey(): Promise<void> {
        try {
            await EncryptedStorage.removeItem(KEYS.API_KEY);
        } catch (error) {
            console.error('Error removing API key:', error);
        }
    },

    /**
     * Store user token
     */
    async setUserToken(token: string): Promise<void> {
        try {
            await EncryptedStorage.setItem(KEYS.USER_TOKEN, token);
        } catch (error) {
            console.error('Error storing user token:', error);
            throw new Error('فشل حفظ رمز المستخدم');
        }
    },

    /**
     * Retrieve user token
     */
    async getUserToken(): Promise<string | null> {
        try {
            return await EncryptedStorage.getItem(KEYS.USER_TOKEN);
        } catch (error) {
            console.error('Error retrieving user token:', error);
            return null;
        }
    },

    /**
     * Clear all secure storage
     */
    async clearAll(): Promise<void> {
        try {
            await EncryptedStorage.clear();
        } catch (error) {
            console.error('Error clearing secure storage:', error);
        }
    },
};
