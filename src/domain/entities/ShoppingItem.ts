import type { Category } from '../../shared/constants/categories';

/**
 * ShoppingItem Entity
 * Represents a single item in a shopping list
 */
export class ShoppingItem {
    constructor(
        public readonly id: string,
        public name: string,
        public quantity: string,
        public note: string | undefined,
        public isCompleted: boolean,
        public category: Category,
        public readonly addedAt: number,
        public price?: number
    ) { }

    /**
     * Toggle the completion status of the item
     */
    toggle(): void {
        this.isCompleted = !this.isCompleted;
    }

    /**
     * Mark the item as completed
     */
    complete(): void {
        this.isCompleted = true;
    }

    /**
     * Mark the item as pending
     */
    uncomplete(): void {
        this.isCompleted = false;
    }

    /**
     * Validate item data
     */
    validate(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Item name is required');
        }

        if (this.name.length > 100) {
            errors.push('Item name is too long (max 100 characters)');
        }

        if (this.quantity.length > 50) {
            errors.push('Quantity is too long (max 50 characters)');
        }

        if (this.note && this.note.length > 200) {
            errors.push('Note is too long (max 200 characters)');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Convert entity to plain object (for storage)
     */
    toPlainObject(): PlainShoppingItem {
        return {
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            note: this.note,
            isCompleted: this.isCompleted,
            category: this.category,
            addedAt: this.addedAt,
            price: this.price
        };
    }

    /**
     * Create entity from plain object (from storage)
     */
    static fromPlainObject(plain: PlainShoppingItem): ShoppingItem {
        return new ShoppingItem(
            plain.id,
            plain.name,
            plain.quantity,
            plain.note,
            plain.isCompleted,
            plain.category,
            plain.addedAt,
            plain.price
        );
    }
}

/**
 * Plain object representation for storage
 */
export interface PlainShoppingItem {
    id: string;
    name: string;
    quantity: string;
    note?: string;
    isCompleted: boolean;
    category: Category;
    addedAt: number;
    price?: number;
}
