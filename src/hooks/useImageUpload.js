/**
 * useImageUpload Hook
 * Custom hook for handling image uploads
 */

import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadImages } from '../api/uploadApi';
import { IMAGE_UPLOAD_CONFIG, IMAGE_PICKER_OPTIONS } from '../config/apiConfig';

export const useImageUpload = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Pick an image from camera or gallery
   */
  const pickImage = useCallback(async (source = 'gallery') => {
    try {
      setError(null);

      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access camera roll is required');
        return null;
      }

      // If camera is selected, also request camera permissions
      if (source === 'camera') {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
          setError('Permission to access camera is required');
          return null;
        }
      }

      // Pick image
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          ...IMAGE_PICKER_OPTIONS,
          allowsEditing: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          ...IMAGE_PICKER_OPTIONS,
          allowsMultiple: false,
        });
      }

      if (result.canceled) {
        return null;
      }

      // Get the first asset
      const asset = result.assets[0];

      // Validate image
      if (asset.fileSize > IMAGE_UPLOAD_CONFIG.maxImageSize) {
        setError(`Image size exceeds limit of ${IMAGE_UPLOAD_CONFIG.maxImageSize / (1024 * 1024)}MB`);
        return null;
      }

      // Create file object
      const file = {
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || `image_${Date.now()}.jpg`,
        size: asset.fileSize,
      };

      return file;
    } catch (err) {
      setError(err.message || 'Failed to pick image');
      return null;
    }
  }, []);

  /**
   * Add an image to the list
   */
  const addImage = useCallback((file) => {
    if (!file) return;

    if (images.length >= IMAGE_UPLOAD_CONFIG.maxImages) {
      setError(`Maximum ${IMAGE_UPLOAD_CONFIG.maxImages} images allowed`);
      return;
    }

    setImages([...images, file]);
  }, [images]);

  /**
   * Remove an image from the list
   */
  const removeImage = useCallback((index) => {
    setImages(images.filter((_, i) => i !== index));
  }, [images]);

  /**
   * Clear all images
   */
  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  /**
   * Prepare images for upload (convert to Base64)
   */
  const prepareImagesForUpload = useCallback(async () => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      if (images.length === 0) {
        return [];
      }

      // Convert all images to Base64 if needed
      const processedImages = await Promise.all(images.map(async (file, index) => {
        let base64 = file.base64;

        // If base64 is missing (e.g. web or not requested), try to convert
        if (!base64 && file.uri) {
          // Import here to avoid circular dep issues if any, or just use the helper
          const { uriToBase64 } = require('../utils/fileUtils');
          base64 = await uriToBase64(file.uri);
        }

        // Ensure base64 string is clean (some APIs might want it without prefix, but n8n code splits it)
        // n8n code: const base64Data = data[imageKey].split(',')[1];
        // So we should KEEP the prefix if uriToBase64 returns it.
        // expo-image-picker base64 usually DOES NOT have prefix. 
        // We need to standardize.

        // Check if it has prefix
        if (base64 && !base64.startsWith('data:image')) {
          // Add prefix for consistency with n8n expectation (which splits by comma)
          // "data:image/jpeg;base64," + base64
          const mimeType = file.type || 'image/jpeg';
          base64 = `data:${mimeType};base64,${base64}`;
        }

        return {
          ...file,
          base64,
          name: file.name
        };
      }));

      setUploadProgress(100);
      return processedImages;
    } catch (err) {
      setError(err.message || 'Failed to process images');
      throw err;
    } finally {
      setUploading(false);
    }
  }, [images]);

  /**
   * Replace an image at a specific index
   */
  const replaceImage = useCallback((index, file) => {
    if (!file) return;

    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  }, [images]);

  return {
    images,
    uploading,
    uploadProgress,
    error,
    pickImage,
    addImage,
    removeImage,
    clearImages,
    prepareImagesForUpload,
    replaceImage,
  };
};
