import en from '../langs/eng.json';
import tr from '../langs/tr.json';

type TranslationKeys = typeof en;

export type Language = 'en' | 'tr';

const translations: Record<Language, TranslationKeys> = {
    en,
    tr
};

// Detect browser/system language
const detectBrowserLanguage = (): Language => {
    const browserLang = navigator.language || (navigator as any).userLanguage;

    // Extract the primary language code (e.g., 'tr-TR' -> 'tr', 'en-US' -> 'en')
    const primaryLang = browserLang.toLowerCase().split('-')[0];

    // Check if the detected language is supported
    if (primaryLang === 'tr') {
        return 'tr';
    }

    // Default to English if not supported
    return 'en';
};

let currentLanguage: Language = detectBrowserLanguage(); // Default to browser language

export const setLanguage = (lang: Language) => {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
};

export const getCurrentLanguage = (): Language => {
    return currentLanguage;
};

// Translation function that uses the current language
export const t = (key: string, lang?: Language): string => {
    const keys = key.split('.');
    const languageToUse = lang || currentLanguage;
    let value: any = translations[languageToUse];

    for (const k of keys) {
        value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
};

// Initialize language from localStorage or browser
const savedLang = localStorage.getItem('language') as Language;
if (savedLang === 'en' || savedLang === 'tr') {
    currentLanguage = savedLang;
} else {
    currentLanguage = detectBrowserLanguage();
}
