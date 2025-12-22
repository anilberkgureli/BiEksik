import { useState, useEffect, useCallback } from 'react';
import { Language, setLanguage as setI18nLanguage, getCurrentLanguage } from '../utils/i18n';

export const useLanguage = () => {
    const [language, setLanguageState] = useState<Language>(getCurrentLanguage());

    useEffect(() => {
        const savedLanguage = getCurrentLanguage();
        if (savedLanguage) {
            setLanguageState(savedLanguage);
        }
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        setI18nLanguage(lang);
        // Force re-render by updating a timestamp or similar
        window.dispatchEvent(new Event('languagechange'));
    }, []);

    return { language, setLanguage };
};
