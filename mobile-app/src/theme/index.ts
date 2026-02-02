import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#4CAF50',
        primaryContainer: '#C8E6C9',
        secondary: '#FFC107',
        secondaryContainer: '#FFE082',
        error: '#F44336',
        errorContainer: '#FFCDD2',
        background: '#F9F9F9',
        surface: '#FFFFFF',
        surfaceVariant: '#F2F2F2',
        onPrimary: '#FFFFFF',
        onSecondary: '#000000',
        onBackground: '#333333',
        onSurface: '#333333',
    },
    roundness: 8,
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#4CAF50',
        primaryContainer: '#2E7D32',
        secondary: '#FFC107',
        secondaryContainer: '#F57F17',
        error: '#F44336',
        errorContainer: '#C62828',
    },
    roundness: 8,
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const fontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
};

export const shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    fab: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
};

export type Theme = typeof lightTheme;

export default lightTheme;
