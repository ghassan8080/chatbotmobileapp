/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',

  // Collect coverage from all source files (not just those imported by tests)
  collectCoverage: false, // enabled via CLI flag in CI
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
    '!src/i18n/**',   // i18n init files — not business logic
    '!src/App.tsx',   // entry-point bootstrap
    '!src/types/**',  // type-only files
  ],

  // Transform TypeScript/TSX files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Module name mapping for native modules that don't run in Node
  moduleNameMapper: {
    'react-native-encrypted-storage': '<rootDir>/src/__mocks__/react-native-encrypted-storage.ts',
    'react-native-image-picker': '<rootDir>/src/__mocks__/react-native-image-picker.ts',
    'react-native-paper': '<rootDir>/src/__mocks__/react-native-paper.tsx',
    '^react-native-image-crop-picker$': '<rootDir>/src/__mocks__/react-native-image-crop-picker.ts',
    '^react-native-vector-icons/(.*)$': '<rootDir>/src/__mocks__/react-native-vector-icons.ts',
    '^react-native-reanimated$': '<rootDir>/src/__mocks__/react-native-reanimated.ts',
  },

  // Files to run before each test suite
  setupFiles: ['<rootDir>/src/__mocks__/setup.ts'],

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-paper|react-native-vector-icons|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|@react-navigation|react-native-encrypted-storage|react-native-image-picker)/)',
  ],

  testPathPattern: '__tests__',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
};
