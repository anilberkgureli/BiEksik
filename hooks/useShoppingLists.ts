import { useState, useEffect, useCallback } from 'react';
import { ShoppingList } from '../src/domain/entities/ShoppingList';
import { useStorageRepository } from '../src/application/contexts/RepositoryContext';
import { useToast } from '../src/application/contexts/ToastContext';
import { CreateListUseCase } from '../src/domain/usecases/CreateListUseCase';
import { UpdateListUseCase } from '../src/domain/usecases/UpdateListUseCase';
import { DeleteListUseCase } from '../src/domain/usecases/DeleteListUseCase';
import { SetReminderUseCase } from '../src/domain/usecases/SetReminderUseCase';
import { ClearReminderUseCase } from '../src/domain/usecases/ClearReminderUseCase';
import { NotificationService } from '../src/infrastructure/notifications/NotificationService';
import type { ListColor } from '../src/shared/constants/colors';
import type { ReminderTime } from '../src/domain/entities/ReminderTime';

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
    const setReminderUseCase = new SetReminderUseCase(repository);
    const clearReminderUseCase = new ClearReminderUseCase(repository);

    // Load lists on mount and sync notifications
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await repository.getLists();
                setLists(data);

                // Sync notifications after loading lists
                await NotificationService.syncReminders(data);
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
            // Cancel reminder notification before deleting
            await NotificationService.cancelReminder(id);

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

    /**
     * Set a reminder for a shopping list
     */
    const setReminder = useCallback(async (listId: string, reminderTime: ReminderTime) => {
        try {
            await setReminderUseCase.execute(listId, reminderTime);

            // Reload lists to reflect changes
            repository.clearCache();
            const updatedLists = await repository.getLists();
            setLists(updatedLists);
        } catch (err) {
            console.error('Failed to set reminder', err);
            const error = err instanceof Error ? err : new Error('Failed to set reminder');
            setError(error);
            showError('Failed to set reminder. Please try again.');
            throw err;
        }
    }, [setReminderUseCase, repository, showError]);

    /**
     * Clear a reminder from a shopping list
     */
    const clearReminder = useCallback(async (listId: string) => {
        try {
            await clearReminderUseCase.execute(listId);

            // Reload lists to reflect changes
            repository.clearCache();
            const updatedLists = await repository.getLists();
            setLists(updatedLists);
        } catch (err) {
            console.error('Failed to clear reminder', err);
            const error = err instanceof Error ? err : new Error('Failed to clear reminder');
            setError(error);
            showError('Failed to clear reminder. Please try again.');
            throw err;
        }
    }, [clearReminderUseCase, repository, showError]);

    return {
        lists,
        isLoading,
        error,
        createList,
        updateList,
        deleteList,
        deleteLists,
        setReminder,
        clearReminder,
        setLists, // Keep for backward compatibility (will be removed later)
    };
};
