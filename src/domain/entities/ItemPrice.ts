/**
 * Item Price Model
 * Represents the price of a single item on a platform
 */
export class ItemPrice {
    constructor(
        public readonly name: string,
        public readonly price: number | null,
        public readonly available: boolean,
        public readonly productUrl?: string
    ) { }

    /**
     * Convert to plain object for storage/transfer
     */
    toPlainObject(): PlainItemPrice {
        return {
            name: this.name,
            price: this.price,
            available: this.available,
            productUrl: this.productUrl,
        };
    }

    /**
     * Create from plain object
     */
    static fromPlainObject(plain: PlainItemPrice): ItemPrice {
        return new ItemPrice(
            plain.name,
            plain.price,
            plain.available,
            plain.productUrl
        );
    }
}

/**
 * Plain object representation
 */
export interface PlainItemPrice {
    name: string;
    price: number | null;
    available: boolean;
    productUrl?: string;
}
