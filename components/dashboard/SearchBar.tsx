import React from 'react';
import { X } from 'lucide-react';
import { Language } from '../../utils/i18n';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    language: Language;
}

/**
 * Search Bar Component
 * Allows users to filter shopping lists by name
 */
export const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    onSearchChange,
    language
}) => {
    return (
        <div className="px-6 mb-2">
            <div className="relative">
                <input
                    type="text"
                    placeholder={language === 'tr' ? 'Listelerde ara...' : 'Search lists...'}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};
