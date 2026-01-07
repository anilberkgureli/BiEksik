import { ShoppingList } from '../entities/ShoppingList';
import { ShoppingItem } from '../entities/ShoppingItem';
import { IStorageRepository } from '../repositories/IStorageRepository';
import { DEFAULT_CATEGORY, type Category } from '../../shared/constants/categories';

/**
 * Add Item Use Case
 * Encapsulates the business logic for adding an item to a shopping list
 */
export class AddItemUseCase {
    constructor(private readonly repository: IStorageRepository) { }

    /**
     * Execute the use case
     * @param list - The shopping list to add the item to
     * @param name - The name of the item
     * @param quantity - The quantity of the item
     * @param note - Optional note for the item
     * @param category - Optional category (defaults to DEFAULT_CATEGORY)
     * @returns The updated shopping list
     */
    async execute(
        list: ShoppingList,
        name: string,
        quantity: string,
        note?: string,
        category: Category = DEFAULT_CATEGORY
    ): Promise<ShoppingList> {
        // Create new item entity
        const newItem = new ShoppingItem(
            crypto.randomUUID(),
            name.trim(),
            quantity.trim(),
            note?.trim(),
            false,
            category,
            Date.now()
        );

        // Validate item
        const validation = newItem.validate();
        if (!validation.isValid) {
            throw new Error(`Invalid item: ${validation.errors.join(', ')}`);
        }

        // Add item to list
        list.addItem(newItem);

        // Persist to storage
        await this.repository.saveList(list);

        return list;
    }
}
