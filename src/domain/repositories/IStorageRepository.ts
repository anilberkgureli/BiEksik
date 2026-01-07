import { ShoppingList } from '../entities/ShoppingList';

/**
 * Storage Repository Interface
 * Defines contract for storage operations
 * This allows us to swap implementations (localStorage, API, etc.)
 */
export interface IStorageRepository {
    /**
     * Get all shopping lists
     */
    getLists(): Promise<ShoppingList[]>;

    /**
     * Save a shopping list (create or update)
     */
    saveList(list: ShoppingList): Promise<void>;

    /**
     * Delete a shopping list by ID
     */
    deleteList(listId: string): Promise<void>;

    /**
     * Delete multiple shopping lists by IDs
     */
    deleteLists(listIds: string[]): Promise<void>;

    /**
     * Find a shopping list by ID
     */
    findById(listId: string): Promise<ShoppingList | null>;

    /**
     * Update an existing shopping list
     */
    update(list: ShoppingList): Promise<void>;

    /**
     * Clear the in-memory cache
     * Forces a fresh fetch from storage on next getLists() call
     */
    clearCache(): void;
}
