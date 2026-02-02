import { ProductImage } from '../types/product';
import { config } from '../config/api.config';

/**
 * Convert image to base64 string
 */
export const imageToBase64 = async (uri: string): Promise<string> => {
    try {
        // For React Native, we'll use the fetch API to read the file
        const response = await fetch(uri);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw new Error('فشل تحويل الصورة');
    }
};

/**
 * Validate image size
 */
export const validateImageSize = (fileSize: number): boolean => {
    const maxSizeBytes = config.maxImageSizeMB * 1024 * 1024;
    return fileSize <= maxSizeBytes;
};

/**
 * Get file extension from URI
 */
export const getFileExtension = (uri: string): string => {
    const match = uri.match(/\.(\w+)($|\?)/);
    return match ? match[1] : 'jpg';
};

/**
 * Generate filename from timestamp
 */
export const generateFilename = (extension: string = 'jpg'): string => {
    const timestamp = new Date().getTime();
    return `product_${timestamp}.${extension}`;
};

/**
 * Validate image type
 */
export const isValidImageType = (type: string): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(type.toLowerCase());
};

/**
 * Process images for upload
 * Converts images to base64 and validates them
 */
export const processImagesForUpload = async (
    images: ProductImage[]
): Promise<Record<string, string>> => {
    const imageData: Record<string, string> = {};

    for (let i = 0; i < images.length && i < 4; i++) {
        const image = images[i];

        if (image.uri) {
            const base64 = await imageToBase64(image.uri);
            const fieldNum = i + 1;

            imageData[`image_base64_${fieldNum}`] = base64;
            imageData[`image_name_${fieldNum}`] = image.name || generateFilename();
        }
    }

    return imageData;
};
