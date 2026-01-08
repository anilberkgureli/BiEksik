import React, { useState, useCallback, useMemo } from 'react';
import { useTheme } from './src/application/contexts/ThemeContext';
import { useLanguage } from './src/application/contexts/LanguageContext';
import { useShoppingLists } from './hooks/useShoppingLists';
import { ShoppingList } from './src/domain/entities/ShoppingList';
import { ListColor } from './src/shared/constants/colors';
import Dashboard from './components/Dashboard';
import ShoppingListView from './components/ShoppingListView';
import { SplashScreen } from './components/SplashScreen';
import { t } from './utils/i18n';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [activeListId, setActiveListId] = useState<string | null>(null); // Reverted to ID tracking
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  const {
    lists,
    isLoading,
    error,
    createList,
    updateList,
    deleteList,
    deleteLists,
    setReminder,
    clearReminder
  } = useShoppingLists();

  // DERIVE ACTIVE LIST FROM LISTS STATE
  // This ensures that when lists are updated (e.g. item added), activeList reflects the changes immediately
  const activeList = useMemo(() =>
    lists.find(l => l.id === activeListId) || null,
    [lists, activeListId]);

  const handleCreateList = useCallback((title: string, color: ListColor) => {
    createList(title, color);
  }, [createList]);

  const handleBackToDashboard = useCallback(() => setActiveListId(null), []);

  const handleDeleteList = useCallback(async (id: string) => {
    if (activeListId === id) {
      setActiveListId(null);
    }
    await deleteList(id);
  }, [activeListId, deleteList]);

  const handleDeleteLists = useCallback(async (ids: string[]) => {
    if (activeListId && ids.includes(activeListId)) {
      setActiveListId(null);
    }
    await deleteLists(ids);
  }, [activeListId, deleteLists]);

  const handleSelectList = useCallback((list: ShoppingList) => {
    setActiveListId(list.id);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[url('/ui-bg.jpg')] bg-cover bg-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full max-w-lg mx-auto bg-cover bg-center shadow-2xl overflow-hidden relative transition-colors duration-300 flex flex-col ${theme === 'dark' ? 'bg-slate-900' : "bg-[url('/ui-bg.jpg')]"}`}>
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative h-full bg-transparent">
        {activeList ? (
          <ShoppingListView
            list={activeList}
            onBack={handleBackToDashboard}
            onUpdateList={updateList}
            onDeleteList={handleDeleteList}
            language={language}
          />
        ) : (
          <Dashboard
            lists={lists}
            onSelect={handleSelectList}
            onCreate={handleCreateList}
            theme={theme}
            onToggleTheme={toggleTheme}
            onDeleteList={handleDeleteList}
            onDeleteLists={handleDeleteLists}
            language={language}
            onChangeLanguage={setLanguage}
            onSetReminder={setReminder}
            onClearReminder={clearReminder}
          />
        )}
      </div>

      {/* Majestic Footer */}
      <div className="py-4 bg-white/50 backdrop-blur-md border-t border-white/20 text-center shrink-0">
        <p className="text-[11px] font-serif tracking-[0.25em] text-slate-800 uppercase select-none font-bold">
          {t('app.createdBy')}
        </p>
      </div>
    </div>
  );
};

export default App;