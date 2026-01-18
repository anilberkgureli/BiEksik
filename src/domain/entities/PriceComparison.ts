import { PlatformPrice, type PlainPlatformPrice } from './PlatformPrice';

/**
 * Price Comparison Entity
 * Represents the complete price comparison results across all platforms
 */
export class PriceComparison {
    constructor(
        public readonly platforms: PlatformPrice[],
        public readonly comparedAt: number,
        public readonly platformsChecked: number,
        public readonly platformsAvailable: number
    ) { }

    /**
     * Get the cheapest platform
     */
    getCheapestPlatform(): PlatformPrice | undefined {
        const availablePlatforms = this.platforms.filter(p => p.available);
        if (availablePlatforms.length === 0) return undefined;

        return availablePlatforms.reduce((cheapest, current) =>
            current.isCheaperThan(cheapest) ? current : cheapest
        );
    }

    /**
     * Get platforms sorted by price (cheapest first)
     */
    getPlatformsSortedByPrice(): PlatformPrice[] {
        return [...this.platforms].sort((a, b) => a.totalPrice - b.totalPrice);
    }

    /**
     * Get the price difference between cheapest and most expensive
     */
    getPriceDifference(): number {
        const availablePlatforms = this.platforms.filter(p => p.available);
        if (availablePlatforms.length < 2) return 0;

        const prices = availablePlatforms.map(p => p.totalPrice);
        return Math.max(...prices) - Math.min(...prices);
    }

    /**
     * Convert to plain object for storage/transfer
     */
    toPlainObject(): PlainPriceComparison {
        return {
            platforms: this.platforms.map(p => p.toPlainObject()),
            comparedAt: this.comparedAt,
            platformsChecked: this.platformsChecked,
            platformsAvailable: this.platformsAvailable,
        };
    }

    /**
     * Create from plain object
     */
    static fromPlainObject(plain: PlainPriceComparison): PriceComparison {
        return new PriceComparison(
            plain.platforms.map(p => PlatformPrice.fromPlainObject(p)),
            plain.comparedAt,
            plain.platformsChecked,
            plain.platformsAvailable
        );
    }
}

/**
 * Plain object representation
 */
export interface PlainPriceComparison {
    platforms: PlainPlatformPrice[];
    comparedAt: number;
    platformsChecked: number;
    platformsAvailable: number;
}
