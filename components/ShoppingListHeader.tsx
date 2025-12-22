import React from 'react';
import { ArrowLeft, Share2, Trash2, Search, X } from 'lucide-react';
import { t } from '../utils/i18n';

import { config } from '../config';

interface ShoppingListHeaderProps {
    title: string;
    onBack: () => void;
    onShare: () => void;
    onDeleteList: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}

export const ShoppingListHeader: React.FC<ShoppingListHeaderProps> = ({ title, onBack, onShare, onDeleteList, searchQuery, setSearchQuery }) => (
    <div className="bg-transparent sticky top-0 z-10 pb-2">
        <header className="px-4 py-4 flex items-center justify-between">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/20 dark:hover:bg-slate-800/50 rounded-full text-slate-800 dark:text-slate-100 transition-colors">
                <ArrowLeft size={24} />
            </button>
            <div className="flex-1 ml-2 overflow-hidden">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate">{title}</h1>
            </div>
            <div className="flex gap-1">
                {config.features.enableShareButton && (
                    <button onClick={onShare} className="p-2 text-slate-700 dark:text-slate-200 hover:bg-white/20 dark:hover:bg-slate-800/50 rounded-full transition-colors">
                        <Share2 size={20} />
                    </button>
                )}
                <button onClick={onDeleteList} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                    <Trash2 size={20} />
                </button>
            </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 mb-2">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <input
                    type="text"
                    placeholder={t('shoppingList.findItem')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-lg text-sm text-slate-800 dark:text-white focus:bg-white/80 dark:focus:bg-slate-800/80 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    </div>
);
