import en from '../locales/eng.json';

type TranslationKeys = typeof en;

// Simple translation function
export const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = en;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    return typeof value === 'string' ? value : key;
};

// Export translations object for direct access if needed
export const translations = en;
