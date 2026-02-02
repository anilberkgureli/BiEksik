import React, { useState, useMemo, useCallback } from 'react';
import { ShoppingList } from '../src/domain/entities/ShoppingList';
import { ShoppingItem } from '../src/domain/entities/ShoppingItem';
import { DEFAULT_CATEGORY } from '../constants';
import { Plus, Trash2, TrendingDown } from 'lucide-react';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import { ShoppingListHeader } from './ShoppingListHeader';
import { FilterBar, ActiveItemsList, CompletedItemsSection, TotalCostSummary } from './ShoppingList';
import { Language } from '../utils/i18n';
import { translate } from '../utils/i18n';
import { config } from '../config';
import { PriceComparisonModal } from './PriceComparison/PriceComparisonModal';
import { usePriceComparison } from '../src/application/contexts/PriceComparisonContext';
import { ShareModal } from './ShareModal';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isDeletingList, setIsDeletingList] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { comparePrices } = usePriceComparison();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('addedAt');
  const [isGrouped, setIsGrouped] = useState(config.features.enableCategorization);
  const [selectedCompletedItems, setSelectedCompletedItems] = useState<Set<string>>(new Set());

  const handleAddItem = useCallback(async (name: string, quantity: string, note: string, price?: number) => {
    // Check if item with same name exists (and no note on either)
    const existingItemIndex = list.items.findIndex(
      item => item.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        !item.note &&
        !note &&
        !item.isCompleted // Only match active items
    );

    let updatedItems;
    if (existingItemIndex !== -1) {
      // Item exists - increment quantity and calculate price intelligently
      const existingItem = list.items[existingItemIndex];
      const currentQty = parseInt(existingItem.quantity) || 1;
      const addedQty = parseInt(quantity) || 1;
      const newQty = currentQty + addedQty;

      // Calculate new price intelligently
      const existingPrice = existingItem.price || 0;
      let totalPrice: number | undefined;

      if (existingPrice > 0) {
        // Calculate unit price from existing item
        const unitPrice = existingPrice / currentQty;

        if (price !== undefined && price > 0) {
          // New price given - add it to existing total
          totalPrice = existingPrice + price;
        } else {
          // No new price - calculate based on unit price
          totalPrice = unitPrice * newQty;
        }
      } else if (price !== undefined && price > 0) {
        // No existing price, but new price given
        totalPrice = price;
      }

      updatedItems = list.items.map((item, index) => {
        if (index === existingItemIndex) {
          return new ShoppingItem(
            item.id,
            item.name,
            newQty.toString(),
            item.note,
            item.isCompleted,
            item.category,
            item.addedAt,
            totalPrice
          );
        }
        return item;
      });
    } else {
      // New item - add to list
      const newItem = new ShoppingItem(
        crypto.randomUUID(),
        name,
        quantity,
        note,
        false,
        DEFAULT_CATEGORY,
        Date.now(),
        price
      );
      updatedItems = [...list.items, newItem];
    }

    const updatedList = new ShoppingList(
      list.id,
      list.title,
      updatedItems,
      list.createdAt,
      Date.now(),
      list.color
    );
    onUpdateList(updatedList);
  }, [list, onUpdateList]);

  const toggleItem = useCallback((itemId: string) => {
    const updatedItems = list.items.map(item => {
      if (item.id === itemId) {
        return new ShoppingItem(
          item.id,
          item.name,
          item.quantity,
          item.note,
          !item.isCompleted,
          item.category,
          item.addedAt,
          item.price // Preserve price when toggling
        );
      }
      return item;
    });
    const updatedList = new ShoppingList(
      list.id,
      list.title,
      updatedItems,
      list.createdAt,
      Date.now(),
      list.color
    );
    onUpdateList(updatedList);
  }, [list, onUpdateList]);

  const deleteItem = useCallback((itemId: string) => {
    const updatedItems = list.items.filter(item => item.id !== itemId);
    const updatedList = new ShoppingList(
      list.id,
      list.title,
      updatedItems,
      list.createdAt,
      Date.now(),
      list.color
    );
    onUpdateList(updatedList);
  }, [list, onUpdateList]);

  const handleEditItem = useCallback((itemId: string) => {
    const item = list.items.find(i => i.id === itemId);
    if (item) {
      setEditingItem(item);
      setIsEditModalOpen(true);
    }
  }, [list.items]);

  const handleSaveEdit = useCallback((name: string, quantity: string, note: string, price?: number) => {
    if (!editingItem) return;

    const updatedItems = list.items.map(item => {
      if (item.id === editingItem.id) {
        return new ShoppingItem(
          item.id,
          name,
          quantity,
          note,
          item.isCompleted,
          item.category,
          item.addedAt,
          price
        );
      }
      return item;
    });

    const updatedList = new ShoppingList(
      list.id,
      list.title,
      updatedItems,
      list.createdAt,
      Date.now(),
      list.color
    );
    onUpdateList(updatedList);
    setEditingItem(null);
  }, [list, editingItem, onUpdateList]);

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
    const updatedList = new ShoppingList(
      list.id,
      list.title,
      updatedItems,
      list.createdAt,
      Date.now(),
      list.color
    );
    onUpdateList(updatedList);
    setSelectedCompletedItems(new Set());
  }, [list, selectedCompletedItems, onUpdateList]);

  const handleUnmarkSelectedCompleted = useCallback(() => {
    const updatedItems = list.items.map(item => {
      if (selectedCompletedItems.has(item.id)) {
        return new ShoppingItem(
          item.id,
          item.name,
          item.quantity,
          item.note,
          false, // Mark as uncompleted
          item.category,
          item.addedAt,
          item.price // Preserve price
        );
      }
      return item;
    });
    const updatedList = new ShoppingList(
      list.id,
      list.title,
      updatedItems,
      list.createdAt,
      Date.now(),
      list.color
    );
    onUpdateList(updatedList);
    setSelectedCompletedItems(new Set());
  }, [list, selectedCompletedItems, onUpdateList]);

  const handleComparePrices = useCallback(async () => {
    setIsPriceModalOpen(true);
    await comparePrices(list);
  }, [list, comparePrices]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-transparent">
      <ShoppingListHeader
        title={list.title}
        onBack={onBack}
        onShare={() => setIsShareModalOpen(true)}
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

      {config.features.enablePriceComparison && list.items.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={handleComparePrices}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <TrendingDown size={20} />
            <span>{language === 'tr' ? 'Fiyatları Karşılaştır' : 'Compare Prices'}</span>
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-6 min-h-0">
        <ActiveItemsList
          groupedItems={groupedItems}
          isGrouped={isGrouped}
          isEmpty={Object.values(groupedItems).flat().length === 0}
          onToggleItem={toggleItem}
          onDeleteItem={deleteItem}
          onEditItem={handleEditItem}
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
          onUnmarkSelected={handleUnmarkSelectedCompleted}
          language={language}
        />

        <TotalCostSummary items={list.items} language={language} />
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

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
        item={editingItem}
      />

      <PriceComparisonModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        list={list}
      />

      {isDeletingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsDeletingList(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 dark:border-slate-800 scale-100" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{translate('deleteConfirmation.deleteList')}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                {list.items.some(i => !i.isCompleted)
                  ? translate('deleteConfirmation.deleteListWithItems')
                  : translate('deleteConfirmation.deleteListConfirm')}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeletingList(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {translate('deleteConfirmation.cancel')}
                </button>
                <button
                  onClick={() => onDeleteList(list.id)}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  {translate('deleteConfirmation.delete')}
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
