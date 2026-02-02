/**
 * App Constants
 * General constants used throughout the application
 */

// Screen Names
export const SCREEN_NAMES = {
  PRODUCT_LIST: 'ProductList',
  PRODUCT_FORM: 'ProductForm',
  PRODUCT_DETAIL: 'ProductDetail',
  SETTINGS: 'Settings',
};

// Image Picker Options
export const IMAGE_PICKER_OPTIONS = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

// Image Source Types
export const IMAGE_SOURCE = {
  CAMERA: 'camera',
  GALLERY: 'gallery',
};

// Form Field Names
export const FORM_FIELDS = {
  ID: 'id',
  NAME: 'name',
  DESCRIPTION: 'description',
  PRICE: 'price',
  IMAGE_1: 'image_url_1',
  IMAGE_2: 'image_url_2',
  IMAGE_3: 'image_url_3',
  IMAGE_4: 'image_url_4',
};

// Image Field Names for Upload
export const IMAGE_UPLOAD_FIELDS = {
  IMAGE_BASE64_1: 'image_base64_1',
  IMAGE_NAME_1: 'image_name_1',
  IMAGE_BASE64_2: 'image_base64_2',
  IMAGE_NAME_2: 'image_name_2',
  IMAGE_BASE64_3: 'image_base64_3',
  IMAGE_NAME_3: 'image_name_3',
  IMAGE_BASE64_4: 'image_base64_4',
  IMAGE_NAME_4: 'image_name_4',
};

// Default Seller ID
export const DEFAULT_SELLER_ID = 1;

// API Request Methods
export const API_METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
