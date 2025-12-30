import { ShoppingList } from '../entities/ShoppingList';
import { IStorageRepository } from '../repositories/IStorageRepository';

/**
 * Update List Use Case
 * Encapsulates the business logic for updating a shopping list
 */
export class UpdateListUseCase {
    constructor(private readonly repository: IStorageRepository) { }

    /**
     * Execute the use case
     * @param list - The shopping list to update
     */
    async execute(list: ShoppingList): Promise<void> {
        // Validate input
        if (!list.id) {
            throw new Error('List ID is required');
        }

        if (!list.title || list.title.trim().length === 0) {
            throw new Error('List title is required');
        }

        // Update timestamp
        list.updatedAt = Date.now();

        // Persist to storage
        await this.repository.saveList(list);
    }
}
