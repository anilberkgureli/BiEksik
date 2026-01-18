import type { PriceComparison } from '../entities/PriceComparison';
import type { ShoppingList } from '../entities/ShoppingList';
import type { PriceComparisonRepository } from '../repositories/PriceComparisonRepository';

/**
 * Compare Prices Use Case
 * Orchestrates price comparison for a shopping list
 */
export class ComparePricesUseCase {
    constructor(private repository: PriceComparisonRepository) { }

    /**
     * Execute price comparison for a shopping list
     * @param shoppingList The shopping list to compare prices for
     * @returns Price comparison results
     * @throws Error if list is empty or repository fails
     */
    async execute(shoppingList: ShoppingList): Promise<PriceComparison> {
        // Validate list has items
        if (shoppingList.items.length === 0) {
            throw new Error('Cannot compare prices for empty shopping list');
        }

        // Filter out completed items (only compare pending items)
        const pendingItems = shoppingList.items.filter(item => !item.isCompleted);

        if (pendingItems.length === 0) {
            throw new Error('No pending items to compare');
        }

        // Call repository to compare prices
        return await this.repository.comparePrices(pendingItems);
    }
}
