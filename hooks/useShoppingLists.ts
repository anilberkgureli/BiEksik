import { useState, useEffect, useCallback } from 'react';
import { ShoppingList } from '../types';
import { storageService } from '../services/storageService';
import type { ListColor } from '../constants';

export const useShoppingLists = () => {
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await storageService.getLists();
                setLists(data);
            } catch (err) {
                console.error("Failed to load lists", err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const createList = useCallback(async (title: string, color: ListColor) => {
        try {
            const newList = await storageService.createList(title, color);
            setLists(prev => [...prev, newList]);
            return newList;
        } catch (err) {
            console.error("Failed to create list", err);
        }
    }, []);

    const updateList = useCallback(async (updatedList: ShoppingList) => {
        try {
            // Optimistic update
            setLists(prev => prev.map(l => l.id === updatedList.id ? updatedList : l));
            await storageService.saveList(updatedList);
        } catch (err) {
            console.error("Failed to update list", err);
            // Rollback could be implemented here
        }
    }, []);

    const deleteList = useCallback(async (id: string, activeListId?: string) => {
        try {
            setLists(prev => prev.filter(l => l.id !== id));
            await storageService.deleteList(id);
        } catch (err) {
            console.error("Failed to delete list", err);
        }
    }, []);

    return {
        lists,
        isLoading,
        error,
        createList,
        updateList,
        deleteList,
        setLists // Exposed for local updates if needed, though use actions preferably
    };
};
