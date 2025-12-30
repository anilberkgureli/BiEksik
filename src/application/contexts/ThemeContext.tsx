import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { STORAGE_KEYS } from '../../shared/constants/storage';

/**
 * Theme Context
 * Manages application theme (light/dark mode)
 */

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Theme Provider Component
 * Manages theme state and persistence
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('light');
    const [isLoading, setIsLoading] = useState(true);

    // Load theme from storage on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const { value } = await Preferences.get({ key: STORAGE_KEYS.THEME });
                if (value === 'light' || value === 'dark') {
                    setThemeState(value);
                }
            } catch (error) {
                console.error('Error loading theme:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTheme();
    }, []);

    // Set theme and persist to storage
    const setTheme = useCallback(async (newTheme: Theme) => {
        setThemeState(newTheme);

        try {
            await Preferences.set({
                key: STORAGE_KEYS.THEME,
                value: newTheme
            });
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }, []);

    // Toggle between light and dark
    const toggleTheme = useCallback(() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }, [theme, setTheme]);

    // Apply dark class to HTML element
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const value: ThemeContextType = {
        theme,
        toggleTheme,
        setTheme,
    };

    // Don't render children until theme is loaded
    if (isLoading) {
        return null;
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to access theme context
 * Throws error if used outside of ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
