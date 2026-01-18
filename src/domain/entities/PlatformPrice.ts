import { ItemPrice, type PlainItemPrice } from './ItemPrice';

/**
 * Platform Price Entity
 * Represents pricing information for a single delivery platform
 */
export class PlatformPrice {
    constructor(
        public readonly platformName: string,
        public readonly totalPrice: number,
        public readonly available: boolean,
        public readonly items: ItemPrice[],
        public readonly scrapedAt: number,
        public readonly errorMessage?: string
    ) { }

    /**
     * Check if this platform is cheaper than another
     */
    isCheaperThan(other: PlatformPrice): boolean {
        return this.totalPrice < other.totalPrice;
    }

    /**
     * Get the number of available items
     */
    getAvailableItemsCount(): number {
        return this.items.filter(item => item.available).length;
    }

    /**
     * Get the number of unavailable items
     */
    getUnavailableItemsCount(): number {
        return this.items.filter(item => !item.available).length;
    }

    /**
     * Convert to plain object for storage/transfer
     */
    toPlainObject(): PlainPlatformPrice {
        return {
            platformName: this.platformName,
            totalPrice: this.totalPrice,
            available: this.available,
            items: this.items.map(item => item.toPlainObject()),
            scrapedAt: this.scrapedAt,
            errorMessage: this.errorMessage,
        };
    }

    /**
     * Create from plain object
     */
    static fromPlainObject(plain: PlainPlatformPrice): PlatformPrice {
        return new PlatformPrice(
            plain.platformName,
            plain.totalPrice,
            plain.available,
            plain.items.map(item => ItemPrice.fromPlainObject(item)),
            plain.scrapedAt,
            plain.errorMessage
        );
    }
}

/**
 * Plain object representation
 */
export interface PlainPlatformPrice {
    platformName: string;
    totalPrice: number;
    available: boolean;
    items: PlainItemPrice[];
    scrapedAt: number;
    errorMessage?: string;
}
