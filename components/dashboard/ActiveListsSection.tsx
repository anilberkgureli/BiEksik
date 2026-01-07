import React from 'react';
import { ShoppingList } from '../../src/domain/entities/ShoppingList';
import { ShoppingListCard } from '../ShoppingListCard';
import { Language } from '../../utils/i18n';
import type { ReminderTime } from '../../src/domain/entities/ReminderTime';

interface ActiveListsSectionProps {
    lists: ShoppingList[];
    onListClick: (list: ShoppingList) => void;
    onDeleteList: (id: string) => void;
    setListToDelete: (id: string | null) => void;
    isMultiSelectMode: boolean;
    selectedLists: Set<string>;
    onToggleSelection: (id: string) => void;
    language: Language;
    onSetReminder?: (listId: string, reminderTime: ReminderTime) => void;
    onClearReminder?: (listId: string) => void;
}

/**
 * Active Lists Section
 * Displays all active (uncompleted) shopping lists
 */
export const ActiveListsSection: React.FC<ActiveListsSectionProps> = ({
    lists,
    onListClick,
    onDeleteList,
    setListToDelete,
    isMultiSelectMode,
    selectedLists,
    onToggleSelection,
    language,
    onSetReminder,
    onClearReminder
}) => {
    return (
        <div className="space-y-4">
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
                    onSetReminder={onSetReminder}
                    onClearReminder={onClearReminder}
                />
            ))}
        </div>
    );
};
