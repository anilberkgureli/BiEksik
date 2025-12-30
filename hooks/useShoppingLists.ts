import { useState, useEffect, useCallback } from 'react';
import { ShoppingList } from '../src/domain/entities/ShoppingList';
import { useStorageRepository } from '../src/application/contexts/RepositoryContext';
import { useToast } from '../src/application/contexts/ToastContext';
import { CreateListUseCase } from '../src/domain/usecases/CreateListUseCase';
import { UpdateListUseCase } from '../src/domain/usecases/UpdateListUseCase';
import { DeleteListUseCase } from '../src/domain/usecases/DeleteListUseCase';
import type { ListColor } from '../src/shared/constants/colors';

/**
 * Shopping Lists Hook
 * Manages shopping lists state using Clean Architecture use cases
 */
export const useShoppingLists = () => {
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Get repository and toast from context (Dependency Injection)
    const repository = useStorageRepository();
    const { showError } = useToast();

    // Initialize use cases
    const createListUseCase = new CreateListUseCase(repository);
    const updateListUseCase = new UpdateListUseCase(repository);
    const deleteListUseCase = new DeleteListUseCase(repository);

    // Load lists on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await repository.getLists();
                setLists(data);
            } catch (err) {
                console.error('Failed to load lists', err);
                const error = err instanceof Error ? err : new Error('Unknown error');
                setError(error);
                showError('Failed to load your lists. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [repository]);

    /**
     * Create a new shopping list
     */
    const createList = useCallback(async (title: string, color: ListColor) => {
        try {
            // Execute use case (saves to repository)
            const newList = await createListUseCase.execute(title, color);

            // Clear cache to force fresh data fetch (fixes Android UI refresh issue)
            repository.clearCache();

            // Reload lists from repository to get the actual saved state
            // This prevents duplicates and ensures UI updates correctly
            const updatedLists = await repository.getLists();
            setLists(updatedLists);

            return newList;
        } catch (err) {
            console.error('Failed to create list', err);
            const error = err instanceof Error ? err : new Error('Failed to save list');
            setError(error);
            showError('Failed to create list. Please try again.');
            throw err;
        }
    }, [createListUseCase, repository, showError]);

    /**
     * Update an existing shopping list
     */
    const updateList = useCallback(async (updatedList: ShoppingList) => {
        try {
            // Execute use case (saves to repository)
            await updateListUseCase.execute(updatedList);

            // Clear cache to force fresh data fetch (fixes Android UI refresh issue)
            repository.clearCache();

            // Reload lists from repository to get the actual saved state
            const actualLists = await repository.getLists();
            setLists(actualLists);
        } catch (err) {
            console.error('Failed to update list', err);
            const error = err instanceof Error ? err : new Error('Failed to update list');
            setError(error);
            showError('Failed to update list. Please try again.');

            // Rollback: reload from repository
            repository.clearCache();
            const actualLists = await repository.getLists();
            setLists(actualLists);

            throw err;
        }
    }, [updateListUseCase, repository, showError]);

    /**
     * Delete a shopping list
     */
    const deleteList = useCallback(async (id: string) => {
        try {
            // Optimistic update
            setLists(prev => prev.filter(l => l.id !== id));

            // Execute use case
            await deleteListUseCase.execute(id);
        } catch (err) {
            console.error('Failed to delete list', err);
            const error = err instanceof Error ? err : new Error('Failed to delete list');
            setError(error);
            showError('Failed to delete list. Please try again.');

            // Rollback: reload from repository
            const actualLists = await repository.getLists();
            setLists(actualLists);

            throw err;
        }
    }, [deleteListUseCase, repository, showError]);

    /**
     * Delete multiple shopping lists
     */
    const deleteLists = useCallback(async (listIds: string[]) => {
        try {
            const idsToDelete = new Set(listIds);

            // Optimistic update
            setLists(prev => prev.filter(l => !idsToDelete.has(l.id)));

            // Execute use case
            await deleteListUseCase.executeMultiple(listIds);
        } catch (err) {
            console.error('Failed to delete lists', err);
            const error = err instanceof Error ? err : new Error('Failed to delete lists');
            setError(error);
            showError('Failed to delete lists. Please try again.');

            // Rollback: reload from repository
            const actualLists = await repository.getLists();
            setLists(actualLists);

            throw err;
        }
    }, [deleteListUseCase, repository, showError]);

    return {
        lists,
        isLoading,
        error,
        createList,
        updateList,
        deleteList,
        deleteLists,
        setLists, // Keep for backward compatibility (will be removed later)
    };
};
