// Global test setup
import 'react-native-gesture-handler/jestSetup';

// Mock i18next / react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ar', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// Silence console.error noise from expected test scenarios
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress react-native act() warnings in tests
    if (typeof args[0] === 'string' && args[0].includes('Warning:')) return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
