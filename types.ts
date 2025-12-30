/**
 * Legacy Types File
 * This file re-exports types from the new domain layer for backward compatibility
 * Will be removed once all components are migrated
 */

import { ShoppingList as DomainShoppingList, PlainShoppingList } from './src/domain/entities/ShoppingList';
import { ShoppingItem as DomainShoppingItem, PlainShoppingItem } from './src/domain/entities/ShoppingItem';

// Re-export domain types for backward compatibility
export type ShoppingList = PlainShoppingList;
export type ShoppingItem = PlainShoppingItem;

// Helper functions to convert between domain entities and plain objects
export const toDomainShoppingList = (plain: PlainShoppingList): DomainShoppingList => {
  return DomainShoppingList.fromPlainObject(plain);
};

export const toPlainShoppingList = (domain: DomainShoppingList): PlainShoppingList => {
  return domain.toPlainObject();
};

export const toDomainShoppingItem = (plain: PlainShoppingItem): DomainShoppingItem => {
  return DomainShoppingItem.fromPlainObject(plain);
};

export const toPlainShoppingItem = (domain: DomainShoppingItem): PlainShoppingItem => {
  return domain.toPlainObject();
};