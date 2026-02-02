/**
 * App Color Palette
 * Centralized color definitions for consistent theming
 */

// Primary Colors
export const COLORS = {
  // Main brand colors
  primary: '#4CAF50',
  primaryDark: '#45a049',
  primaryLight: '#81C784',

  // Secondary colors
  secondary: '#FF9800',
  secondaryDark: '#F57C00',
  secondaryLight: '#FFB74D',

  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Background colors
  background: '#F9F9F9',
  cardBackground: '#FFFFFF',

  // Text colors
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: '#DDDDDD',

  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Input colors
  input: {
    background: '#FFFFFF',
    border: '#DDDDDD',
    placeholder: '#999999',
  },
};

// Color utilities
export const withOpacity = (color, opacity) => {
  // Add opacity to hex color
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
