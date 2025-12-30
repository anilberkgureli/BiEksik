import { IStorageRepository } from '../repositories/IStorageRepository';

/**
 * Delete List Use Case
 * Encapsulates the business logic for deleting a shopping list
 */
export class DeleteListUseCase {
    constructor(private readonly repository: IStorageRepository) { }

    /**
     * Execute the use case - delete a single list
     * @param listId - The ID of the list to delete
     */
    async execute(listId: string): Promise<void> {
        // Validate input
        if (!listId) {
            throw new Error('List ID is required');
        }

        // Delete from storage
        await this.repository.deleteList(listId);
    }

    /**
     * Execute bulk delete - delete multiple lists
     * @param listIds - Array of list IDs to delete
     */
    async executeMultiple(listIds: string[]): Promise<void> {
        // Validate input
        if (!listIds || listIds.length === 0) {
            throw new Error('At least one list ID is required');
        }

        // Delete from storage
        await this.repository.deleteLists(listIds);
    }
}
