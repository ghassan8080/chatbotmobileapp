import { Platform } from 'react-native';

/**
 * Convert URI to Base64
 * @param {string} uri - Image URI
 * @returns {Promise<string>} Base64 string
 */
export const uriToBase64 = async (uri) => {
    try {
        console.log('uriToBase64 called with:', uri?.substring(0, 100) + '...');

        if (Platform.OS === 'web') {
            // If it's already a data URL, return it as-is
            if (uri.startsWith('data:image/') || uri.startsWith('data:application/')) {
                console.log('Already a data URL, returning as-is');
                return uri;
            }

            // Handle blob URLs (blob:http://...) or other fetchable URIs
            console.log('Fetching URI to convert to base64...');
            const response = await fetch(uri);
            const blob = await response.blob();
            console.log('Blob received, size:', blob.size, 'type:', blob.type);

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    console.log('Base64 conversion complete, length:', reader.result?.length);
                    resolve(reader.result); // This includes data:image/...;base64,
                };
                reader.onerror = (error) => {
                    console.error('FileReader error:', error);
                    reject(error);
                };
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
