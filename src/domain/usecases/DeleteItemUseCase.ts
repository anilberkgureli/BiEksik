import { ShoppingList } from '../entities/ShoppingList';
import { IStorageRepository } from '../repositories/IStorageRepository';

/**
 * Delete Item Use Case
 * Encapsulates the business logic for deleting an item from a shopping list
 */
export class DeleteItemUseCase {
    constructor(private readonly repository: IStorageRepository) { }

    /**
     * Execute the use case - delete a single item
     * @param list - The shopping list containing the item
     * @param itemId - The ID of the item to delete
     * @returns The updated shopping list
     */
    async execute(list: ShoppingList, itemId: string): Promise<ShoppingList> {
        // Validate that item exists
        const itemExists = list.items.some(i => i.id === itemId);

        if (!itemExists) {
            throw new Error(`Item with ID ${itemId} not found`);
        }

        // Remove the item
        list.removeItem(itemId);

        // Persist to storage
        await this.repository.saveList(list);

        return list;
    }

    /**
     * Execute bulk delete - delete multiple items
     * @param list - The shopping list containing the items
     * @param itemIds - Array of item IDs to delete
     * @returns The updated shopping list
     */
    async executeMultiple(list: ShoppingList, itemIds: string[]): Promise<ShoppingList> {
        // Validate input
        if (!itemIds || itemIds.length === 0) {
            throw new Error('At least one item ID is required');
        }

        // Remove all items
        itemIds.forEach(itemId => {
            list.removeItem(itemId);
        });

        // Persist to storage
        await this.repository.saveList(list);

        return list;
    }
}
