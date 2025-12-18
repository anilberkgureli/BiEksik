import React, { useState, useCallback, useMemo } from 'react';
import { useTheme } from './hooks/useTheme';
import { useShoppingLists } from './hooks/useShoppingLists';
import Dashboard from './components/Dashboard';
import ShoppingListView from './components/ShoppingListView';
import { SplashScreen } from './components/SplashScreen';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { lists, isLoading, createList, updateList, deleteList } = useShoppingLists();
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  const handleBackToDashboard = useCallback(() => setActiveListId(null), []);

  const handleSelectList = useCallback((listId: string) => setActiveListId(listId), []);

  const handleDeleteList = useCallback(async (id: string) => {
    if (activeListId === id) setActiveListId(null);
    await deleteList(id);
  }, [activeListId, deleteList]);

  const activeList = useMemo(
    () => lists.find(l => l.id === activeListId),
    [lists, activeListId]
  );

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
    <div className="h-full w-full max-w-lg mx-auto bg-[url('/ui-bg.jpg')] bg-cover bg-center shadow-2xl overflow-hidden relative transition-colors duration-300 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative h-full bg-transparent">
        {activeList ? (
          <ShoppingListView
            list={activeList}
            onBack={handleBackToDashboard}
            onUpdateList={updateList}
            onDeleteList={handleDeleteList}
          />
        ) : (
          <Dashboard
            lists={lists}
            onSelect={(list) => handleSelectList(list.id)}
            onCreate={createList}
            theme={theme}
            onToggleTheme={toggleTheme}
            onDeleteList={handleDeleteList}
          />
        )}
      </div>

      {/* Majestic Footer */}
      <div className="py-4 bg-white/50 backdrop-blur-md border-t border-white/20 text-center shrink-0">
        <p className="text-[11px] font-serif tracking-[0.25em] text-slate-800 uppercase select-none font-bold">
          Created by Anil Gureli
        </p>
      </div>
    </div>
  );
};

export default App;