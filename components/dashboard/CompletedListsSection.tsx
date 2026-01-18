import React from 'react';
import { Trash2 } from 'lucide-react';
import { ShoppingList } from '../../src/domain/entities/ShoppingList';
import { ShoppingListCard } from '../ShoppingListCard';
import { Language } from '../../utils/i18n';

interface CompletedListsSectionProps {
    lists: ShoppingList[];
    onListClick: (list: ShoppingList) => void;
    onDeleteList: (id: string) => void;
    onClearCompleted: () => void;
    setListToDelete: (id: string | null) => void;
    isMultiSelectMode: boolean;
    selectedLists: Set<string>;
    onToggleSelection: (id: string) => void;
    language: Language;
}

/**
 * Completed Lists Section
 * Displays all completed shopping lists with option to clear them
 */
export const CompletedListsSection: React.FC<CompletedListsSectionProps> = ({
    lists,
    onListClick,
    onDeleteList,
    onClearCompleted,
    setListToDelete,
    isMultiSelectMode,
    selectedLists,
    onToggleSelection,
    language
}) => {
    if (lists.length === 0) {
        return null;
    }

    return (
        <>
            <div className="flex items-center gap-2 mt-4 mb-2">
                <span className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                    {language === 'tr' ? 'Tamamlanan Listeler' : 'Completed Lists'} ({lists.length})
                </span>
                <span className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></span>
            </div>

            <button
                onClick={onClearCompleted}
                className="w-full mb-3 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2 border border-red-200 dark:border-red-800"
            >
                <Trash2 size={18} />
                {language === 'tr' ? 'Tamamlanan Listeleri Temizle' : 'Clear Completed Lists'}
            </button>

            <div className="space-y-4 opacity-75">
                {lists.map(list => (
                    <ShoppingListCard
                        key={list.id}
                        list={list.toPlainObject()}
                        onSelect={() => onListClick(list)}
                        onDelete={onDeleteList}
                        setListToDelete={setListToDelete}
                        isMultiSelectMode={isMultiSelectMode}
                        isSelected={selectedLists.has(list.id)}
                        onToggleSelection={() => onToggleSelection(list.id)}
                    />
                ))}
            </div>
        </>
    );
};

