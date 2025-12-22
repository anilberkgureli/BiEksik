import React from 'react';
import { Check, X } from 'lucide-react';
import { Language } from '../utils/i18n';

interface LanguageSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLanguage: Language;
    onSelectLanguage: (lang: Language) => void;
}

interface LanguageOption {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
}

const languages: LanguageOption[] = [
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' }
];

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
    isOpen,
    onClose,
    currentLanguage,
    onSelectLanguage
}) => {
    if (!isOpen) return null;

    const handleLanguageSelect = (lang: Language) => {
        onSelectLanguage(lang);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-[90%] max-w-md mx-4 overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {currentLanguage === 'tr' ? 'Dil Seçin' : 'Select Language'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Language Options */}
                <div className="p-4">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`w-full px-4 py-4 rounded-xl flex items-center gap-4 mb-2 transition-all ${currentLanguage === lang.code
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-500'
                                    : 'bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            {/* Flag */}
                            <span className="text-4xl">{lang.flag}</span>

                            {/* Language Info */}
                            <div className="flex-1 text-left">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {lang.nativeName}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {lang.name}
                                </p>
                            </div>

                            {/* Check Icon */}
                            {currentLanguage === lang.code && (
                                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <Check size={18} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                        {currentLanguage === 'tr'
                            ? 'Seçilen dil otomatik olarak kaydedilir'
                            : 'Selected language will be saved automatically'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};
