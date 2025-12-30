import { ShoppingList, PlainShoppingList } from '../../domain/entities/ShoppingList';
import { IStorageRepository } from '../../domain/repositories/IStorageRepository';
import { STORAGE_KEYS } from '../../shared/constants/storage';
import { Preferences } from '@capacitor/preferences';

/**
 * Local Storage Repository Implementation
 * Uses Capacitor Preferences for persistent storage
 * Implements the IStorageRepository interface
 */
export class LocalStorageRepository implements IStorageRepository {
    private readonly storageKey = STORAGE_KEYS.LISTS;

    // In-memory cache to prevent race conditions during rapid operations
    private cachedLists: ShoppingList[] | null = null;

    /**
     * Get all shopping lists from storage
     */
    async getLists(): Promise<ShoppingList[]> {
        // Return cache if available
        if (this.cachedLists) {
            return this.cachedLists;
        }

        try {
            const { value } = await Preferences.get({ key: this.storageKey });

            if (!value) {
                this.cachedLists = [];
                return [];
            }

            // Parse plain objects and convert to entities
            const plainLists: PlainShoppingList[] = JSON.parse(value);
            this.cachedLists = plainLists.map(plain => ShoppingList.fromPlainObject(plain));

            return this.cachedLists;
        } catch (error) {
            console.error('Error loading lists from storage:', error);
            this.cachedLists = [];
            return [];
        }
    }

    /**
     * Save a shopping list (create or update)
     */
    async saveList(list: ShoppingList): Promise<void> {
        try {
            // Ensure cache is populated
            const lists = await this.getLists();

            // Find existing list index
            const existingIndex = lists.findIndex(l => l.id === list.id);

            if (existingIndex >= 0) {
                // Update existing list
                lists[existingIndex] = list;
            } else {
                // Add new list
                lists.push(list);
            }

            // Update cache
            this.cachedLists = lists;

            // Persist to storage
            await this.persistCache();
        } catch (error) {
            console.error('Error saving list to storage:', error);
            throw new Error('Failed to save list');
        }
    }

    /**
     * Delete a shopping list by ID
     */
    async deleteList(listId: string): Promise<void> {
        try {
            // Ensure cache is populated
            const lists = await this.getLists();

            // Filter out the deleted list
            this.cachedLists = lists.filter(l => l.id !== listId);

            // Persist to storage
            await this.persistCache();
        } catch (error) {
            console.error('Error deleting list from storage:', error);
            throw new Error('Failed to delete list');
        }
    }

    /**
     * Delete multiple shopping lists by IDs
     */
    async deleteLists(listIds: string[]): Promise<void> {
        try {
            // Ensure cache is populated
            const lists = await this.getLists();

            // Create a set for faster lookup
            const idsToDelete = new Set(listIds);

            // Filter out the deleted lists
            this.cachedLists = lists.filter(l => !idsToDelete.has(l.id));

            // Persist to storage
            await this.persistCache();
        } catch (error) {
            console.error('Error deleting lists from storage:', error);
            throw new Error('Failed to delete lists');
        }
    }

    /**
     * Clear the in-memory cache
     * Useful for testing or forcing a refresh
     */
    clearCache(): void {
        this.cachedLists = null;
    }

    /**
     * Helper method to persist cache to storage
     */
    private async persistCache(): Promise<void> {
        if (!this.cachedLists) {
            return;
        }

        try {
            // Convert entities to plain objects for storage
            const plainLists = this.cachedLists.map(list => list.toPlainObject());

            await Preferences.set({
                key: this.storageKey,
                value: JSON.stringify(plainLists)
            });
        } catch (error) {
            console.error('Error persisting cache to storage:', error);
            throw new Error('Failed to persist data');
        }
    }
}
