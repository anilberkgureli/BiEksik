import React from 'react';
import { ShoppingItem } from '../../types';
import { ShoppingItemRow } from '../ShoppingItemRow';
import { Language } from '../../utils/i18n';
import { translate } from '../../utils/i18n';

interface ActiveItemsListProps {
    groupedItems: Record<string, ShoppingItem[]>;
    isGrouped: boolean;
    isEmpty: boolean;
    onToggleItem: (itemId: string) => void;
    onDeleteItem: (itemId: string) => void;
    onEditItem: (itemId: string) => void;
    language?: Language;
}

/**
 * ActiveItemsList Component
 * Displays active (non-completed) shopping items with optional grouping by category
 */
export const ActiveItemsList: React.FC<ActiveItemsListProps> = ({
    groupedItems,
    isGrouped,
    isEmpty,
    onToggleItem,
    onDeleteItem,
    onEditItem,
    language = 'en',
}) => {
    if (isEmpty) {
        return (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                <p className="text-lg mb-2">{translate('shoppingList.listIsEmpty')}</p>
            </div>
        );
    }

    return (
        <>
            {(Object.entries(groupedItems) as [string, ShoppingItem[]][]).map(([category, items]) =>
                items.length > 0 && (
                    <div key={category} className="space-y-2">
                        {isGrouped && (
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {category}
                                </h3>
                            </div>
                        )}
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 dark:border-slate-700/50 overflow-hidden">
                            {items.map(item => (
                                <ShoppingItemRow
                                    key={item.id}
                                    item={item}
                                    onToggle={onToggleItem}
                                    onDelete={onDeleteItem}
                                    onEdit={onEditItem}
                                    language={language}
                                />
                            ))}
                        </div>
                    </div>
                )
            )}
        </>
    );
};

