/**
 * Form Validators
 * Utility functions for form validation
 */

import { PRODUCT_FORM_CONFIG } from '../config/appConfig';
import { IMAGE_UPLOAD_CONFIG } from '../config/apiConfig';

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate price
 * @param {number} price - Price to validate
 * @returns {Object} Validation result with isValid and error properties
 */
export const validatePrice = (price) => {
  const parsedPrice = parseFloat(price);

  if (isNaN(parsedPrice)) {
    return {
      isValid: false,
      error: 'Invalid price',
    };
  }

  if (parsedPrice < PRODUCT_FORM_CONFIG.minPrice) {
    return {
      isValid: false,
      error: `Price must be greater than ${PRODUCT_FORM_CONFIG.minPrice}`,
    };
  }

  if (parsedPrice > PRODUCT_FORM_CONFIG.maxPrice) {
    return {
      isValid: false,
      error: `Price must be less than ${PRODUCT_FORM_CONFIG.maxPrice}`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate product name
 * @param {string} name - Product name to validate
 * @returns {Object} Validation result with isValid and error properties
 */
export const validateProductName = (name) => {
  if (!isRequired(name)) {
    return {
      isValid: false,
      error: 'Product name is required',
    };
  }

  if (name.length > PRODUCT_FORM_CONFIG.maxNameLength) {
    return {
      isValid: false,
      error: `Product name must be less than ${PRODUCT_FORM_CONFIG.maxNameLength} characters`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate product description
 * @param {string} description - Product description to validate
 * @returns {Object} Validation result with isValid and error properties
 */
export const validateProductDescription = (description) => {
  if (!isRequired(description)) {
    return {
      isValid: false,
      error: 'Product description is required',
    };
  }

  if (description.length > PRODUCT_FORM_CONFIG.maxDescriptionLength) {
    return {
      isValid: false,
      error: `Description must be less than ${PRODUCT_FORM_CONFIG.maxDescriptionLength} characters`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate image
 * @param {Object} image - Image object to validate
 * @returns {Object} Validation result with isValid and error properties
 */
export const validateImage = (image) => {
  if (!image) {
    return {
      isValid: true, // Image is optional
      error: null,
    };
  }

  // Check image type
  if (image.type && !IMAGE_UPLOAD_CONFIG.allowedTypes.includes(image.type)) {
    return {
      isValid: false,
      error: 'Invalid image type. Only JPEG and PNG are supported.',
    };
  }

  // Check image size
  if (image.size && image.size > IMAGE_UPLOAD_CONFIG.maxImageSize) {
    return {
      isValid: false,
      error: `Image size exceeds the limit of ${IMAGE_UPLOAD_CONFIG.maxImageSize / (1024 * 1024)}MB`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate product form
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result with isValid, errors properties
 */
export const validateProductForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Validate name
  const nameValidation = validateProductName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
    isValid = false;
  }

  // Validate description
  const descriptionValidation = validateProductDescription(formData.description);
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.error;
    isValid = false;
  }

  // Validate price
  const priceValidation = validatePrice(formData.price);
  if (!priceValidation.isValid) {
    errors.price = priceValidation.error;
    isValid = false;
  }

  // Validate images
  if (formData.images) {
    const imageErrors = [];
    formData.images.forEach((image, index) => {
      const imageValidation = validateImage(image);
      if (!imageValidation.isValid) {
        imageErrors.push(`Image ${index + 1}: ${imageValidation.error}`);
      }
    });

    if (imageErrors.length > 0) {
      errors.images = imageErrors;
      isValid = false;
    }
  }

  return {
    isValid,
    errors,
  };
};
