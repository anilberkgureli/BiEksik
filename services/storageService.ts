import { ShoppingList, ShoppingItem } from '../types';
import { STORAGE_KEYS, type ListColor } from '../constants';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = STORAGE_KEYS.LISTS;

// In-memory cache to prevent race conditions during rapid operations
let cachedLists: ShoppingList[] | null = null;

// Helper to persist current cache to storage
const persistCache = async () => {
  if (cachedLists) {
    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(cachedLists)
    });
  }
};

export const storageService = {
  getLists: async (): Promise<ShoppingList[]> => {
    // Return cache if available
    if (cachedLists) return cachedLists;

    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      cachedLists = value ? JSON.parse(value) : [];
      return cachedLists!;
    } catch (error) {
      console.error('Error loading lists:', error);
      return [];
    }
  },

  saveList: async (list: ShoppingList): Promise<void> => {
    const lists = await storageService.getLists(); // Ensures cache is populated
    const existingIndex = lists.findIndex(l => l.id === list.id);

    if (existingIndex >= 0) {
      lists[existingIndex] = { ...list, updatedAt: Date.now() };
    } else {
      lists.push({ ...list, updatedAt: Date.now() });
    }

    // Cache is already mutated because 'lists' is a reference to cachedLists
    await persistCache();
  },

  deleteList: async (listId: string): Promise<void> => {
    const lists = await storageService.getLists(); // Ensures cache is populated
    // Update cache
    cachedLists = lists.filter(l => l.id !== listId);
    await persistCache();
  },

  // New method for atomic bulk delete
  deleteLists: async (listIds: string[]): Promise<void> => {
    const lists = await storageService.getLists(); // Ensures cache is populated
    const idsToDelete = new Set(listIds);
    // Update cache
    cachedLists = lists.filter(l => !idsToDelete.has(l.id));
    await persistCache();
  },

  createList: async (title: string, color: ListColor): Promise<ShoppingList> => {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      title,
      color,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await storageService.saveList(newList);
    return newList;
  }
};