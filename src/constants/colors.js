/**
 * App Color Palette
 * Centralized color definitions for consistent theming
 */

// Primary Colors
export const COLORS = {
  // Modern Vibrant Palette
  primary: '#6200EA', // Deep Purple
  primaryDark: '#3700B3',
  primaryLight: '#B388FF',

  // Secondary
  secondary: '#FFAB00', // Vibrant Amber
  secondaryDark: '#FF6D00',
  secondaryLight: '#FFD180',

  // UI Colors
  background: '#F5F6FA', // Very light blue-gray
  cardBackground: '#FFFFFF',
  
  // Text
  text: {
    primary: '#1A237E', // Dark Blue for text
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
    highlight: '#6200EA',
  },

  // Status & Categories (Matching the reference image)
  purple: '#6200EA',
  red: '#D50000',
  blue: '#2962FF',
  green: '#00C853',
  orange: '#FF6D00',
  teal: '#00BFA5',
  
  // Functional
  success: '#00C853',
  warning: '#FFAB00',
  error: '#D50000',
  info: '#2962FF',

  // Neutrals
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

  // Input
  input: {
    background: '#FFFFFF',
    border: '#E0E0E0',
    placeholder: '#9E9E9E',
    focus: '#6200EA',
  },
  
  // Shadows
  shadow: 'rgba(98, 0, 234, 0.15)', // Purple-tinted shadow
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
