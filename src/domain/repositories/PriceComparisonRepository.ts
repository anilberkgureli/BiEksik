import type { PriceComparison } from '../entities/PriceComparison';
import type { ShoppingItem } from '../entities/ShoppingItem';

/**
 * Price Comparison Repository Interface
 * Defines contract for price comparison data access
 */
export interface PriceComparisonRepository {
    /**
     * Compare prices for shopping items across all platforms
     * @param items List of shopping items to compare
     * @returns Price comparison results
     */
    comparePrices(items: ShoppingItem[]): Promise<PriceComparison>;
}
