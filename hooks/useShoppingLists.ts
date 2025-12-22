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
        // Generate values immediately for optimistic update
        const newList: ShoppingList = {
            id: crypto.randomUUID(),
            title,
            color,
            items: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        // 1. Optimistic Update (Update UI Immediately)
        setLists(prev => [...prev, newList]);

        // 2. Persist to Storage (Background)
        try {
            await storageService.saveList(newList);
        } catch (err) {
            console.error("Failed to create list", err);
            setError(err instanceof Error ? err : new Error('Failed to save list'));
            // Rollback UI if needed (complex, usually not needed for simple apps)
            setLists(prev => prev.filter(l => l.id !== newList.id));
        }

        return newList;
    }, []);

    const updateList = useCallback(async (updatedList: ShoppingList) => {
        // 1. Optimistic Update
        setLists(prev => prev.map(l => l.id === updatedList.id ? updatedList : l));

        // 2. Persist to Storage
        try {
            await storageService.saveList(updatedList);
        } catch (err) {
            console.error("Failed to update list", err);
            // Rollback would go here
        }
    }, []);

    const deleteList = useCallback(async (id: string) => {
        // 1. Optimistic Update
        setLists(prev => prev.filter(l => l.id !== id));

        // 2. Persist to Storage
        try {
            await storageService.deleteList(id);
        } catch (err) {
            console.error("Failed to delete list", err);
            // Reload from storage to rollback
            const actualLists = await storageService.getLists();
            setLists(actualLists);
        }
    }, []);

    const deleteLists = useCallback(async (listIds: string[]) => {
        const idsToDelete = new Set(listIds);

        // 1. Optimistic Update
        setLists(prev => prev.filter(l => !idsToDelete.has(l.id)));

        // 2. Persist to Storage
        try {
            await storageService.deleteLists(listIds);
        } catch (err) {
            console.error("Failed to delete lists", err);
            // Reload from storage to rollback
            const actualLists = await storageService.getLists();
            setLists(actualLists);
        }
    }, []);

    return {
        lists,
        isLoading,
        error,
        createList,
        updateList,
        deleteList,
        deleteLists,
        setLists
    };
};
