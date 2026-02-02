/**
 * Validation utilities for product data
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Validate product name
 */
export const validateProductName = (name: string): ValidationResult => {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
        errors.push('اسم المنتج مطلوب');
    } else if (name.trim().length < 3) {
        errors.push('اسم المنتج يجب أن يكون 3 أحرف على الأقل');
    } else if (name.length > 100) {
        errors.push('اسم المنتج طويل جداً (الحد الأقصى 100 حرف)');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate product description
 */
export const validateProductDescription = (description: string): ValidationResult => {
    const errors: string[] = [];

    if (!description || description.trim().length === 0) {
        errors.push('وصف المنتج مطلوب');
    } else if (description.trim().length < 10) {
        errors.push('وصف المنتج يجب أن يكون 10 أحرف على الأقل');
    } else if (description.length > 500) {
        errors.push('وصف المنتج طويل جداً (الحد الأقصى 500 حرف)');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate product price
 */
export const validateProductPrice = (price: number | string): ValidationResult => {
    const errors: string[] = [];
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
        errors.push('السعر يجب أن يكون رقماً صحيحاً');
    } else if (numPrice <= 0) {
        errors.push('السعر يجب أن يكون أكبر من صفر');
    } else if (numPrice > 1000000) {
        errors.push('السعر كبير جداً');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate complete product form
 */
export const validateProductForm = (
    name: string,
    description: string,
    price: number | string
): ValidationResult => {
    const errors: string[] = [];

    const nameValidation = validateProductName(name);
    const descValidation = validateProductDescription(description);
    const priceValidation = validateProductPrice(price);

    errors.push(...nameValidation.errors);
    errors.push(...descValidation.errors);
    errors.push(...priceValidation.errors);

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Sanitize string input (prevent XSS)
 */
export const sanitizeString = (input: string): string => {
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .trim();
};
