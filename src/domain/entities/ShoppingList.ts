import { ShoppingItem } from './ShoppingItem';
import type { ListColor } from '../../shared/constants/colors';
import { ReminderTime, type PlainReminderTime } from './ReminderTime';

/**
 * ShoppingList Entity
 * Represents a shopping list with business logic methods
 */
export class ShoppingList {
    constructor(
        public readonly id: string,
        public title: string,
        public items: ShoppingItem[],
        public readonly createdAt: number,
        public updatedAt: number,
        public color: ListColor,
        public reminder?: ReminderTime
    ) { }

    /**
     * Check if all items in the list are completed
     */
    isCompleted(): boolean {
        return this.items.length > 0 && this.items.every(item => item.isCompleted);
    }

    /**
     * Get the number of completed items
     */
    getCompletedCount(): number {
        return this.items.filter(item => item.isCompleted).length;
    }

    /**
     * Get the number of pending items
     */
    getPendingCount(): number {
        return this.items.filter(item => !item.isCompleted).length;
    }

    /**
     * Get completion progress as a percentage (0-100)
     */
    getProgress(): number {
        if (this.items.length === 0) return 0;
        return Math.round((this.getCompletedCount() / this.items.length) * 100);
    }

    /**
     * Add an item to the list
     */
    addItem(item: ShoppingItem): void {
        this.items.push(item);
        this.updatedAt = Date.now();
    }

    /**
     * Remove an item from the list
     */
    removeItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
        this.updatedAt = Date.now();
    }

    /**
     * Update an item in the list
     */
    updateItem(updatedItem: ShoppingItem): void {
        const index = this.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            this.items[index] = updatedItem;
            this.updatedAt = Date.now();
        }
    }

    /**
     * Set a reminder for this list
     */
    setReminder(reminder: ReminderTime): void {
        this.reminder = reminder;
        this.updatedAt = Date.now();
    }

    /**
     * Clear the reminder for this list
     */
    clearReminder(): void {
        this.reminder = undefined;
        this.updatedAt = Date.now();
    }

    /**
     * Convert entity to plain object (for storage)
     */
    toPlainObject(): PlainShoppingList {
        return {
            id: this.id,
            title: this.title,
            items: this.items.map(item => item.toPlainObject()),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            color: this.color,
            reminder: this.reminder?.toPlainObject(),
        };
    }

    /**
     * Create entity from plain object (from storage)
     */
    static fromPlainObject(plain: PlainShoppingList): ShoppingList {
        return new ShoppingList(
            plain.id,
            plain.title,
            plain.items.map(item => ShoppingItem.fromPlainObject(item)),
            plain.createdAt,
            plain.updatedAt,
            plain.color,
            plain.reminder ? ReminderTime.fromPlainObject(plain.reminder) : undefined
        );
    }
}

/**
 * Plain object representation for storage
 */
export interface PlainShoppingList {
    id: string;
    title: string;
    items: Array<{
        id: string;
        name: string;
        quantity: string;
        note?: string;
        isCompleted: boolean;
        category: string;
        addedAt: number;
    }>;
    createdAt: number;
    updatedAt: number;
    color: ListColor;
    reminder?: PlainReminderTime;
}
