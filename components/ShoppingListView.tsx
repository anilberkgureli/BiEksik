import React, { useState, useMemo, useCallback } from 'react';
import { ShoppingList, ShoppingItem } from '../types';
import { DEFAULT_CATEGORY } from '../constants';
import { Plus, Trash2 } from 'lucide-react';
import AddItemModal from './AddItemModal';
import { ShoppingListHeader } from './ShoppingListHeader';
import { FilterBar, ActiveItemsList, CompletedItemsSection } from './ShoppingList';
import { Language } from '../utils/i18n';
import { t } from '../utils/i18n';
import { config } from '../config';

interface ShoppingListViewProps {
  list: ShoppingList;
  onBack: () => void;
  onUpdateList: (updatedList: ShoppingList) => void;
  onDeleteList: (id: string) => void;
  language?: Language;
}

type SortOption = 'addedAt' | 'name';

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ list, onBack, onUpdateList, onDeleteList, language = 'en' }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('addedAt');
  const [isGrouped, setIsGrouped] = useState(config.features.enableCategorization);
  const [selectedCompletedItems, setSelectedCompletedItems] = useState<Set<string>>(new Set());

  const handleAddItem = useCallback(async (name: string, quantity: string, note: string) => {
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name,
      quantity,
      note,
      isCompleted: false,
      category: DEFAULT_CATEGORY,
      addedAt: Date.now(),
    };
    onUpdateList({ ...list, items: [...list.items, newItem] });
  }, [list, onUpdateList]);

  const toggleItem = useCallback((itemId: string) => {
    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );
    onUpdateList({ ...list, items: updatedItems });
  }, [list, onUpdateList]);

  const deleteItem = useCallback((itemId: string) => {
    const updatedItems = list.items.filter(item => item.id !== itemId);
    onUpdateList({ ...list, items: updatedItems });
  }, [list, onUpdateList]);

  // Logic: Filtering, Sorting, Grouping
  const groupedItems = useMemo<Record<string, ShoppingItem[]>>(() => {
    let filtered = list.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const pendingItems = filtered.filter(i => !i.isCompleted);

    pendingItems.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.addedAt - a.addedAt;
    });

    const groups: Record<string, ShoppingItem[]> = {};

    if (!isGrouped) {
      return { "Items": pendingItems };
    }

    pendingItems.forEach(item => {
      const cat = item.category || DEFAULT_CATEGORY;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [list.items, searchQuery, sortBy, isGrouped]);

  const completedItems = useMemo(() =>
    list.items.filter(i => i.isCompleted && i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [list.items, searchQuery]
  );

  const handleSelectAllCompleted = useCallback(() => {
    const allCompletedIds = new Set(completedItems.map(i => i.id));
    setSelectedCompletedItems(allCompletedIds);
  }, [completedItems]);

  const handleDeselectAllCompleted = useCallback(() => {
    setSelectedCompletedItems(new Set());
  }, []);

  const handleToggleCompletedItem = useCallback((itemId: string) => {
    setSelectedCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleDeleteSelectedCompleted = useCallback(() => {
    const updatedItems = list.items.filter(item => !selectedCompletedItems.has(item.id));
    onUpdateList({ ...list, items: updatedItems });
    setSelectedCompletedItems(new Set());
  }, [list, selectedCompletedItems, onUpdateList]);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <ShoppingListHeader
        title={list.title}
        onBack={onBack}
        onShare={() => alert("Sharing link copied!")}
        onDeleteList={() => setIsDeletingList(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <FilterBar
        sortBy={sortBy}
        isGrouped={isGrouped}
        onSortChange={setSortBy}
        onGroupToggle={() => setIsGrouped(!isGrouped)}
        language={language}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <ActiveItemsList
          groupedItems={groupedItems}
          isGrouped={isGrouped}
          isEmpty={list.items.length === 0}
          onToggleItem={toggleItem}
          onDeleteItem={deleteItem}
          language={language}
        />

        <CompletedItemsSection
          completedItems={completedItems}
          selectedItems={selectedCompletedItems}
          onToggleItem={toggleItem}
          onDeleteItem={deleteItem}
          onSelectAll={handleSelectAllCompleted}
          onDeselectAll={handleDeselectAllCompleted}
          onToggleSelection={handleToggleCompletedItem}
          onDeleteSelected={handleDeleteSelectedCompleted}
          language={language}
        />
      </div>

      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={() => setIsAddModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsAddModalOpen(true);
            }
          }}
          aria-label="Add new item"
          className="w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
        >
          <Plus size={28} aria-hidden="true" />
        </button>
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      {isDeletingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsDeletingList(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 dark:border-slate-800 scale-100" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('deleteConfirmation.deleteList')}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                {list.items.some(i => !i.isCompleted)
                  ? t('deleteConfirmation.deleteListWithItems')
                  : t('deleteConfirmation.deleteListConfirm')}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeletingList(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('deleteConfirmation.cancel')}
                </button>
                <button
                  onClick={() => onDeleteList(list.id)}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  {t('deleteConfirmation.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListView;