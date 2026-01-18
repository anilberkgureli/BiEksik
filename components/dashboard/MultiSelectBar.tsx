import React from 'react';
import { X } from 'lucide-react';
import { Language } from '../../utils/i18n';

interface MultiSelectBarProps {
    selectedCount: number;
    onCancel: () => void;
    onDelete: () => void;
    language: Language;
}

/**
 * Multi-Select Action Bar
 * Shows when user is in multi-select mode for bulk operations
 */
export const MultiSelectBar: React.FC<MultiSelectBarProps> = ({
    selectedCount,
    onCancel,
    onDelete,
    language
}) => {
    return (
        <div className="px-6 pb-3 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-3">
                <button
                    onClick={onCancel}
                    className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {selectedCount} {language === 'tr' ? 'seçildi' : 'selected'}
                </span>
            </div>
            <button
                onClick={onDelete}
                disabled={selectedCount === 0}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                {language === 'tr' ? 'Sil' : 'Delete'}
            </button>
        </div>
    );
};

