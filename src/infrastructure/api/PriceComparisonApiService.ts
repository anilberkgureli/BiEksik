import { PriceComparison } from '../../domain/entities/PriceComparison';
import type { ShoppingItem } from '../../domain/entities/ShoppingItem';
import type { PriceComparisonRepository } from '../../domain/repositories/PriceComparisonRepository';
import { config } from '../../../config';

/**
 * Price Comparison API Service
 * Implements repository interface using backend REST API
 */
export class PriceComparisonApiService implements PriceComparisonRepository {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = config.api.priceComparisonUrl;
    }

    /**
     * Compare prices across all platforms
     */
    async comparePrices(items: ShoppingItem[]): Promise<PriceComparison> {
        try {
            const response = await fetch(`${this.baseUrl}/price-comparison/compare`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        note: item.note,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform API response to domain entity
            return PriceComparison.fromPlainObject(data);
        } catch (error) {
            console.error('Error comparing prices:', error);
            throw new Error(
                error instanceof Error
                    ? `Failed to compare prices: ${error.message}`
                    : 'Failed to compare prices'
            );
        }
    }
}
