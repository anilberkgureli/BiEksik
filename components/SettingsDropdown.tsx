import React, { useState, useRef, useEffect } from 'react';
import { Settings, Moon, Sun, Globe, Trash2 } from 'lucide-react';
import { Language } from '../utils/i18n';
import { LanguageSelectionModal } from './LanguageSelectionModal';
import { config } from '../config';

interface SettingsDropdownProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    language: Language;
    onChangeLanguage: (lang: Language) => void;
    onClearLists?: () => void;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
    theme,
    onToggleTheme,
    language,
    onChangeLanguage,
    onClearLists
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languageNames: Record<Language, string> = {
        'tr': 'Türkçe',
        'en': 'English'
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLanguageClick = () => {
        setIsOpen(false);
        setShowLanguageModal(true);
    };

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                {/* Settings Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md"
                    aria-label="Settings"
                >
                    <Settings size={20} className={isOpen ? 'rotate-90 transition-transform duration-300' : 'transition-transform duration-300'} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-fade-in">
                        {/* Language Option */}
                        <button
                            onClick={handleLanguageClick}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700"
                        >
                            <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {language === 'tr' ? 'Dil' : 'Language'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {languageNames[language]}
                                </p>
                            </div>
                        </button>

                        {/* Clear Lists Option */}
                        {onClearLists && (
                            <button
                                onClick={() => {
                                    onClearLists();
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700"
                            >
                                <Trash2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {language === 'tr' ? 'Listeleri Temizle' : 'Clear Lists'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {language === 'tr' ? 'Aktif listeleri sil' : 'Delete active lists'}
                                    </p>
                                </div>
                            </button>
                        )}

                        {/* Dark Mode Toggle */}
                        {config.features.enableDarkMode && (
                            <button
                                onClick={() => {
                                    onToggleTheme();
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                {theme === 'light' ? (
                                    <Moon size={18} className="text-indigo-600 dark:text-indigo-400" />
                                ) : (
                                    <Sun size={18} className="text-indigo-600 dark:text-indigo-400" />
                                )}
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {language === 'tr' ? 'Tema' : 'Theme'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {theme === 'light'
                                            ? (language === 'tr' ? 'Açık Mod' : 'Light Mode')
                                            : (language === 'tr' ? 'Koyu Mod' : 'Dark Mode')
                                        }
                                    </p>
                                </div>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Language Selection Modal */}
            <LanguageSelectionModal
                isOpen={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                currentLanguage={language}
                onSelectLanguage={onChangeLanguage}
            />
        </>
    );
};
