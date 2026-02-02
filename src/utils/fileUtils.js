import { Platform } from 'react-native';

/**
 * Convert URI to Base64
 * @param {string} uri - Image URI
 * @returns {Promise<string>} Base64 string
 */
export const uriToBase64 = async (uri) => {
    try {
        if (Platform.OS === 'web') {
            const response = await fetch(uri);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result); // This includes data:image/...;base64,
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } else {
            // For native, we rely on Expo Image Picker returning base64
            // If it's not present (e.g. from an old cache or different picker), we'd need expo-file-system
            // handled by the caller checking file.base64
            return null;
        }
    } catch (error) {
        console.error('Error converting to base64:', error);
        throw error;
    }
};
