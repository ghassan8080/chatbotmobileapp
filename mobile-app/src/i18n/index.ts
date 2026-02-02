import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ar from './locales/ar.json';
import en from './locales/en.json';

const LANGUAGE_KEY = 'app_language';

// Get stored language or default to Arabic
const getStoredLanguage = async (): Promise<string> => {
    try {
        const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        return stored || 'ar';
    } catch {
        return 'ar';
    }
};

// Store language preference
export const setStoredLanguage = async (lang: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (error) {
        console.error('Error storing language:', error);
    }
};

// Initialize i18n
const initI18n = async () => {
    const language = await getStoredLanguage();

    // Set RTL if Arabic
    const isRTL = language === 'ar';
    I18nManager.forceRTL(isRTL);

    await i18n
        .use(initReactI18next)
        .init({
            resources: {
                ar: { translation: ar },
                en: { translation: en },
            },
            lng: language,
            fallbackLng: 'ar',
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
        });
};

// Change language at runtime
export const changeLanguage = async (lang: 'ar' | 'en') => {
    await setStoredLanguage(lang);
    await i18n.changeLanguage(lang);

    // Update RTL
    const isRTL = lang === 'ar';
    I18nManager.forceRTL(isRTL);
};

initI18n();

export default i18n;
