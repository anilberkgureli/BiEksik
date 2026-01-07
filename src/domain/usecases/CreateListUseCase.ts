import { ShoppingList } from '../entities/ShoppingList';
import { IStorageRepository } from '../repositories/IStorageRepository';
import type { ListColor } from '../../shared/constants/colors';

/**
 * Create List Use Case
 * Encapsulates the business logic for creating a new shopping list
 */
export class CreateListUseCase {
    constructor(private readonly repository: IStorageRepository) { }

    /**
     * Execute the use case
     * @param title - The title of the new list
     * @param color - The color of the new list
     * @returns The newly created shopping list
     */
    async execute(title: string, color: ListColor): Promise<ShoppingList> {
        // Validate input
        if (!title || title.trim().length === 0) {
            throw new Error('List title is required');
        }

        if (title.length > 100) {
            throw new Error('List title is too long (max 100 characters)');
        }

        // Create new list entity
        const newList = new ShoppingList(
            crypto.randomUUID(),
            title.trim(),
            [],
            Date.now(),
            Date.now(),
            color
        );

        // Persist to storage
        await this.repository.saveList(newList);

        return newList;
    }
}
