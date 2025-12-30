import React from 'react';
import { ShoppingItem } from '../../types';
import { Check, Trash2 } from 'lucide-react';
import { Language } from '../../utils/i18n';
import { t } from '../../utils/i18n';

interface CompletedItemsSectionProps {
    completedItems: ShoppingItem[];
    selectedItems: Set<string>;
    onToggleItem: (itemId: string) => void;
    onDeleteItem: (itemId: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onToggleSelection: (itemId: string) => void;
    onDeleteSelected: () => void;
    language?: Language;
}

/**
 * CompletedItemsSection Component
 * Displays completed items with bulk selection and deletion capabilities
 */
export const CompletedItemsSection: React.FC<CompletedItemsSectionProps> = ({
    completedItems,
    selectedItems,
    onToggleItem,
    onDeleteItem,
    onSelectAll,
    onDeselectAll,
    onToggleSelection,
    onDeleteSelected,
    language = 'en',
}) => {
    if (completedItems.length === 0) {
        return null;
    }

    const allSelected = selectedItems.size === completedItems.length;

    return (
        <div className="pt-2">
            {/* Section Divider */}
            <div className="flex items-center gap-2 mb-3">
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">
                    {t('shoppingList.completed')} ({completedItems.length})
                </span>
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center justify-between mb-2 px-2">
                <button
                    onClick={allSelected ? onDeselectAll : onSelectAll}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    {allSelected
                        ? (language === 'tr' ? 'Tümünü Kaldır' : 'Deselect All')
                        : (language === 'tr' ? 'Tümünü Seç' : 'Select All')
                    }
                </button>

                {selectedItems.size > 0 && (
                    <button
                        onClick={onDeleteSelected}
                        className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                    >
                        <Trash2 size={12} />
                        {language === 'tr'
                            ? `Seçilenleri Sil (${selectedItems.size})`
                            : `Delete Selected (${selectedItems.size})`
                        }
                    </button>
                )}
            </div>

            {/* Completed Items List */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl opacity-75">
                {completedItems.map(item => (
                    <div
                        key={item.id}
                        className="flex items-center p-3 border-b border-slate-100 dark:border-slate-800 last:border-none"
                    >
                        {/* Selection Checkbox */}
                        <button
                            onClick={() => onToggleSelection(item.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all mr-3 flex-shrink-0 ${selectedItems.has(item.id)
                                    ? 'bg-indigo-500 border-indigo-500 text-white'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                                }`}
                        >
                            {selectedItems.has(item.id) && <Check size={12} />}
                        </button>

                        {/* Completion Toggle */}
                        <button
                            onClick={() => onToggleItem(item.id)}
                            className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-white transition-colors flex-shrink-0"
                        >
                            <Check size={14} />
                        </button>

                        {/* Item Name */}
                        <div className="flex-1 ml-3 text-slate-400 dark:text-slate-600 line-through min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={() => onDeleteItem(item.id)}
                            className="text-slate-300 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 p-2"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
