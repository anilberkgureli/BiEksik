import React, { useState, useCallback, useMemo } from 'react';
import { ShoppingList } from '../types';
import type { ListColor } from '../constants';
import { DashboardHeader } from './DashboardHeader';
import { ShoppingListCard } from './ShoppingListCard';
import { CreateListForm } from './CreateListForm';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Language } from '../utils/i18n';
import { Trash2, X } from 'lucide-react';
import { t } from '../utils/i18n';

interface DashboardProps {
  lists: ShoppingList[];
  onSelect: (list: ShoppingList) => void;
  onCreate: (title: string, color: ListColor) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onDeleteList: (id: string) => void;
  onDeleteLists: (ids: string[]) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onClearLists?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  lists,
  onSelect,
  onCreate,
  theme,
  onToggleTheme,
  onDeleteList,
  onDeleteLists,
  language,
  onChangeLanguage,
  onClearLists
}) => {
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleCloseModal = useCallback(() => setListToDelete(null), []);

  const handleConfirmDelete = useCallback(() => {
    if (listToDelete) onDeleteList(listToDelete);
    setListToDelete(null);
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

  // Separate active and completed lists with Filtering
  const { activeLists, completedLists } = useMemo(() => {
    const active: ShoppingList[] = [];
    const completed: ShoppingList[] = [];

    // Normalize search query
    const query = searchQuery.toLowerCase().trim();

    lists.forEach(list => {
      // Filter by name
      if (query && !list.title.toLowerCase().includes(query)) {
        return;
      }

      const isCompleted = list.items.length > 0 && list.items.every(item => item.isCompleted);
      if (isCompleted) {
        completed.push(list);
      } else {
        active.push(list);
      }
    });

    return { activeLists: active, completedLists: completed };
  }, [lists, searchQuery]);

  // Multi-select handlers
  const handleToggleMultiSelect = useCallback(() => {
    if (isMultiSelectMode) {
      setSelectedLists(new Set());
      setIsMultiSelectMode(false);
    } else {
      // Select only ACTIVE (uncompleted) lists when entering multi-select mode
      const activeListsFiltered = activeLists.map(l => l.id);
      const activeIds = new Set(activeListsFiltered);
      setSelectedLists(activeIds);
      setIsMultiSelectMode(true);
    }
  }, [isMultiSelectMode, activeLists]);

  const handleToggleSelection = useCallback((listId: string) => {
    setSelectedLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    onDeleteLists(Array.from(selectedLists));
    setSelectedLists(new Set());
    setIsMultiSelectMode(false);
  }, [selectedLists, onDeleteLists]);

  const handleClearCompletedLists = useCallback(() => {
    const completedIds = completedLists.map(list => list.id);
    onDeleteLists(completedIds);
  }, [completedLists, onDeleteLists]);

  const handleListClick = useCallback((list: ShoppingList) => {
    if (isMultiSelectMode) {
      handleToggleSelection(list.id);
    } else {
      onSelect(list);
    }
  }, [isMultiSelectMode, handleToggleSelection, onSelect]);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <DashboardHeader
        theme={theme}
        onToggleTheme={onToggleTheme}
        language={language}
        onChangeLanguage={onChangeLanguage}
        onClearLists={activeLists.length > 0 ? handleToggleMultiSelect : undefined}
      />

      {/* Multi-Select Action Bar */}
      {isMultiSelectMode && (
        <div className="px-6 pb-3 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleMultiSelect}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {selectedLists.size} {language === 'tr' ? 'seçildi' : 'selected'}
            </span>
          </div>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedLists.size === 0}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 size={18} />
            {language === 'tr' ? 'Sil' : 'Delete'}
          </button>
        </div>
      )}

      {/* Search Bar - Only show if not in multi-select mode */}
      {!isMultiSelectMode && (
        <div className="px-6 mb-2">
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'tr' ? 'Listelerde ara...' : 'Search lists...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6" onClick={() => { /* Close swipe if any? Handled by components */ }}>
        <div className="grid grid-cols-1 gap-4">
          {/* Active Lists */}
          {activeLists.length > 0 ? (
            activeLists.map(list => (
              <ShoppingListCard
                key={list.id}
                list={list}
                onSelect={handleListClick}
                onDelete={onDeleteList}
                setListToDelete={setListToDelete}
                isMultiSelectMode={isMultiSelectMode}
                isSelected={selectedLists.has(list.id)}
                onToggleSelection={() => handleToggleSelection(list.id)}
              />
            ))
          ) : (
            searchQuery && activeLists.length === 0 && completedLists.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <p>{language === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}</p>
              </div>
            )
          )}

          {!searchQuery && <CreateListForm onCreate={onCreate} />}

          {/* Completed Lists Section */}
          {completedLists.length > 0 && (
            <>
              <div className="flex items-center gap-2 mt-4 mb-2">
                <span className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                  {language === 'tr' ? 'Tamamlanan Listeler' : 'Completed Lists'} ({completedLists.length})
                </span>
                <span className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></span>
              </div>

              {/* Clear Completed Lists Button */}
              <button
                onClick={handleClearCompletedLists}
                className="w-full mb-3 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2 border border-red-200 dark:border-red-800"
              >
                <Trash2 size={18} />
                {language === 'tr' ? 'Tamamlanan Listeleri Temizle' : 'Clear Completed Lists'}
              </button>

              <div className="space-y-4 opacity-75">
                {completedLists.map(list => (
                  <ShoppingListCard
                    key={list.id}
                    list={list}
                    onSelect={handleListClick}
                    onDelete={onDeleteList}
                    setListToDelete={setListToDelete}
                    isMultiSelectMode={isMultiSelectMode}
                    isSelected={selectedLists.has(list.id)}
                    onToggleSelection={() => handleToggleSelection(list.id)}
                  />
                ))}
              </div>
            </>
          )}
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