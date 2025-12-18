import React, { useState, useCallback, useMemo } from 'react';
import { ShoppingList } from '../types';
import type { ListColor } from '../constants';
import { DashboardHeader } from './DashboardHeader';
import { ShoppingListCard } from './ShoppingListCard';
import { CreateListForm } from './CreateListForm';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { t } from '../utils/i18n';

interface DashboardProps {
  lists: ShoppingList[];
  onSelect: (list: ShoppingList) => void;
  onCreate: (title: string, color: ListColor) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onDeleteList: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lists, onSelect, onCreate, theme, onToggleTheme, onDeleteList }) => {
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  const handleCloseModal = useCallback(() => setListToDelete(null), []);

  const handleConfirmDelete = useCallback(() => {
    if (listToDelete) onDeleteList(listToDelete);
  }, [listToDelete, onDeleteList]);

  const listToDeleteData = useMemo(
    () => lists.find(l => l.id === listToDelete),
    [lists, listToDelete]
  );

  const hasUncompletedItems = useMemo(
    () => listToDeleteData?.items.some(i => !i.isCompleted),
    [listToDeleteData]
  );

  const deleteMessage = useMemo(
    () => hasUncompletedItems
      ? t('deleteConfirmation.deleteListWithItems')
      : t('deleteConfirmation.deleteListConfirm'),
    [hasUncompletedItems]
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      <DashboardHeader theme={theme} onToggleTheme={onToggleTheme} />

      <div className="flex-1 overflow-y-auto p-6" onClick={() => { /* Close swipe if any? Handled by components */ }}>
        <div className="grid grid-cols-1 gap-4">
          {lists.map(list => (
            <ShoppingListCard
              key={list.id}
              list={list}
              onSelect={onSelect}
              onDelete={onDeleteList}
              setListToDelete={setListToDelete}
            />
          ))}

          <CreateListForm onCreate={onCreate} />
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={!!listToDelete}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message={deleteMessage}
      />
    </div>
  );
};

export default Dashboard;