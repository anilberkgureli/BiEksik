import { ShoppingList } from '../entities/ShoppingList';
import { IStorageRepository } from '../repositories/IStorageRepository';

/**
 * Toggle Item Use Case
 * Encapsulates the business logic for toggling an item's completion status
 */
export class ToggleItemUseCase {
    constructor(private readonly repository: IStorageRepository) { }

    /**
     * Execute the use case
     * @param list - The shopping list containing the item
     * @param itemId - The ID of the item to toggle
     * @returns The updated shopping list
     */
    async execute(list: ShoppingList, itemId: string): Promise<ShoppingList> {
        // Find the item
        const item = list.items.find(i => i.id === itemId);

        if (!item) {
            throw new Error(`Item with ID ${itemId} not found`);
        }

        // Toggle the item
        item.toggle();

        // Update the list's updatedAt timestamp
        list.updatedAt = Date.now();

        // Persist to storage
        await this.repository.saveList(list);

        return list;
    }
}
