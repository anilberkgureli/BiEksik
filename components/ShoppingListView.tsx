import React, { useState, useMemo, useCallback } from 'react';
import { ShoppingList, ShoppingItem } from '../types';
import { DEFAULT_CATEGORY } from '../constants';
import { Plus, SortAsc, Clock, LayoutGrid, List as ListIcon, Check, Trash2 } from 'lucide-react';
import { FilterChip } from './ui';
import AddItemModal from './AddItemModal';
import { ShoppingListHeader } from './ShoppingListHeader';
import { ShoppingItemRow } from './ShoppingItemRow';
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

      <div className="px-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {config.features.enableCategorization && (
          <FilterChip
            label={isGrouped ? t('shoppingList.grouped') : t('shoppingList.listView')}
            isActive={isGrouped}
            onClick={() => setIsGrouped(!isGrouped)}
            icon={isGrouped ? <LayoutGrid size={14} /> : <ListIcon size={14} />}
          />
        )}

        <FilterChip
          label="A-Z"
          isActive={sortBy === 'name'}
          onClick={() => setSortBy('name')}
          icon={<SortAsc size={14} />}
        />

        <FilterChip
          label={t('shoppingList.newest')}
          isActive={sortBy === 'addedAt'}
          onClick={() => setSortBy('addedAt')}
          icon={<Clock size={14} />}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {list.items.length === 0 && (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <p className="text-lg mb-2">{t('shoppingList.listIsEmpty')}</p>
          </div>
        )}

        {(Object.entries(groupedItems) as [string, ShoppingItem[]][]).map(([category, items]) => (
          items.length > 0 && (
            <div key={category} className="space-y-2">
              {isGrouped && (
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{category}</h3>

                </div>
              )}
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 dark:border-slate-700/50 overflow-hidden">
                {items.map(item => (
                  <ShoppingItemRow
                    key={item.id}
                    item={item}
                    onToggle={toggleItem}
                    onDelete={deleteItem}
                    language={language}
                  />
                ))}
              </div>
            </div>
          )
        ))}

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">{t('shoppingList.completed')} ({completedItems.length})</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
            </div>

            {/* Bulk Actions for Completed Items */}
            <div className="flex items-center justify-between mb-2 px-2">
              <button
                onClick={selectedCompletedItems.size === completedItems.length ? handleDeselectAllCompleted : handleSelectAllCompleted}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {selectedCompletedItems.size === completedItems.length
                  ? (language === 'tr' ? 'Tümünü Kaldır' : 'Deselect All')
                  : (language === 'tr' ? 'Tümünü Seç' : 'Select All')
                }
              </button>

              {selectedCompletedItems.size > 0 && (
                <button
                  onClick={handleDeleteSelectedCompleted}
                  className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  {language === 'tr' ? `Seçilenleri Sil (${selectedCompletedItems.size})` : `Delete Selected (${selectedCompletedItems.size})`}
                </button>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl opacity-75">
              {completedItems.map(item => (
                <div key={item.id} className="flex items-center p-3 border-b border-slate-100 dark:border-slate-800 last:border-none">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleCompletedItem(item.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all mr-3 flex-shrink-0 ${selectedCompletedItems.has(item.id)
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                      }`}
                  >
                    {selectedCompletedItems.has(item.id) && <Check size={12} />}
                  </button>

                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-white transition-colors flex-shrink-0"
                  >
                    <Check size={14} />
                  </button>
                  <div className="flex-1 ml-3 text-slate-400 dark:text-slate-600 line-through min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-slate-300 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={28} />
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