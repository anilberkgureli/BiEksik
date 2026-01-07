import React from 'react';
import { t } from '../utils/i18n';
import { SettingsDropdown } from './SettingsDropdown';
import { Language } from '../utils/i18n';

interface DashboardHeaderProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    language: Language;
    onChangeLanguage: (lang: Language) => void;
    onClearLists?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    theme,
    onToggleTheme,
    language,
    onChangeLanguage,
    onClearLists
}) => (
    <header className="px-6 py-8 bg-transparent border-none flex justify-between items-start">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl shadow-lg overflow-hidden flex items-center justify-center bg-white">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('app.name')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{t('app.tagline')}</p>
            </div>
        </div>
        <SettingsDropdown
            theme={theme}
            onToggleTheme={onToggleTheme}
            language={language}
            onChangeLanguage={onChangeLanguage}
            onClearLists={onClearLists}
        />
    </header>
);
