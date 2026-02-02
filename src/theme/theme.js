/**
 * Enhanced Theme System
 * Modern color palette and typography for improved UI/UX
 */

import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Modern Color Palette
export const COLORS = {
  // Primary Brand Colors - Modern Green
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  primaryLighter: '#81C784',

  // Secondary Brand Colors - Warm Orange
  secondary: '#FF8F00',
  secondaryDark: '#FF6F00',
  secondaryLight: '#FFA000',
  secondaryLighter: '#FFB74D',

  // Status Colors
  success: '#2E7D32',
  warning: '#FF8F00',
  error: '#D32F2F',
  errorLight: '#FFCDD2',
  info: '#1976D2',
  infoLight: '#BBDEFB',

  // Neutral Colors - Modern Gray Scale
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Background Colors
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  surface: '#FFFFFF',

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
    hint: '#757575',
  },

  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  borderDark: '#BDBDBD',

  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Input Colors
  input: {
    background: '#FFFFFF',
    border: '#E0E0E0',
    borderFocused: '#2E7D32',
    placeholder: '#9E9E9E',
    error: '#D32F2F',
  },

  // Gradient Colors
  gradient: {
    primary: ['#2E7D32', '#4CAF50'],
    secondary: ['#FF8F00', '#FFA000'],
  },
};

// Typography System
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing System
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadow System
export const SHADOWS = {
  sm: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  md: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  lg: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  xl: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.25)',
    elevation: 8,
  },
};

// Layout Constants
export const LAYOUT = {
  screenWidth: width,
  screenHeight: height,
  padding: SPACING.lg,
  margin: SPACING.lg,
  borderRadius: BORDER_RADIUS.lg,
};

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Z-Index Scale
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Export default theme
export const theme = {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  LAYOUT,
  ANIMATION,
  Z_INDEX,
};
