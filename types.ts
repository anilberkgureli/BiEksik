import type { Category } from './constants/categories';
import type { ListColor } from './constants/colors';

/**
 * Individual shopping item interface
 */
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string; // e.g., "2 kg", "1 pack"
  note?: string;
  isCompleted: boolean;
  category: Category;
  addedAt: number;
}

/**
 * Shopping list interface
 */
export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingItem[];
  createdAt: number;
  updatedAt: number;
  color: ListColor; // Hex code for visual distinction
}

/**
 * Grouped items by category
 */
export interface CategoryGroup {
  name: string;
  items: ShoppingItem[];
}