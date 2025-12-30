import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { STORAGE_KEYS } from '../../shared/constants/storage';

/**
 * Language Context
 * Manages application language (i18n)
 */

export type Language = 'en' | 'tr';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

/**
 * Detect browser/system language
 */
const detectBrowserLanguage = (): Language => {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const primaryLang = browserLang.toLowerCase().split('-')[0];

    return primaryLang === 'tr' ? 'tr' : 'en';
};

/**
 * Language Provider Component
 * Manages language state and persistence
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(detectBrowserLanguage());
    const [isLoading, setIsLoading] = useState(true);

    // Load language from storage on mount
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const { value } = await Preferences.get({ key: STORAGE_KEYS.LANGUAGE });
                if (value === 'en' || value === 'tr') {
                    setLanguageState(value);
                }
            } catch (error) {
                console.error('Error loading language:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLanguage();
    }, []);

    // Set language and persist to storage
    const setLanguage = useCallback(async (newLanguage: Language) => {
        setLanguageState(newLanguage);

        try {
            await Preferences.set({
                key: STORAGE_KEYS.LANGUAGE,
                value: newLanguage
            });
        } catch (error) {
            console.error('Error saving language:', error);
        }
    }, []);

    const value: LanguageContextType = {
        language,
        setLanguage,
    };

    // Don't render children until language is loaded
    if (isLoading) {
        return null;
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

/**
 * Hook to access language context
 * Throws error if used outside of LanguageProvider
 */
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }

    return context;
};
