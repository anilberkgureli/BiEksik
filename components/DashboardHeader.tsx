import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { t } from '../utils/i18n';
import { config } from '../config';

interface DashboardHeaderProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ theme, onToggleTheme }) => (
    <header className="px-6 py-8 bg-transparent border-none flex justify-between items-start">
        <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-xl shadow-sm" />
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('app.name')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{t('app.tagline')}</p>
            </div>
        </div>
        {config.features.enableDarkMode && (
            <button
                onClick={onToggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        )}
    </header>
);
