interface Config {
    apiBaseUrl: string;
    apiKey: string;
    apiTimeout: number;
    maxImageSizeMB: number;
    imageQuality: number;
    enableDebugLogs: boolean;
}

// Default configuration - will be overridden by .env
const defaultConfig: Config = {
    apiBaseUrl: 'https://n8n-n8n.17m6co.easypanel.host/webhook',
    apiKey: '', // MUST be set in .env file
    apiTimeout: 30000,
    maxImageSizeMB: 5,
    imageQuality: 0.8,
    enableDebugLogs: __DEV__,
};

// Environment-based configuration
// Note: For React Native, you'll need react-native-config or similar
// For now, we'll use the default config
export const config: Config = {
    ...defaultConfig,
    // Override with environment variables when available
    // apiBaseUrl: process.env.API_BASE_URL || defaultConfig.apiBaseUrl,
    // apiKey: process.env.API_KEY || defaultConfig.apiKey,
};

export const API_ENDPOINTS = {
    ADD_PRODUCT: '/add-product',
    UPDATE_PRODUCT: '/update-product',
    DELETE_PRODUCT: '/delete-product',
    GET_PRODUCTS: '/get-products', // Add this endpoint to your n8n if needed
};

export default config;
