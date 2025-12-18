import { ShoppingList, ShoppingItem } from '../types';
import { STORAGE_KEYS, type ListColor } from '../constants';

const STORAGE_KEY = STORAGE_KEYS.LISTS;

// Simulate network delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  getLists: async (): Promise<ShoppingList[]> => {
    // await delay(300); // Simulate network
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveList: async (list: ShoppingList): Promise<void> => {
    const lists = await storageService.getLists();
    const existingIndex = lists.findIndex(l => l.id === list.id);

    if (existingIndex >= 0) {
      lists[existingIndex] = { ...list, updatedAt: Date.now() };
    } else {
      lists.push({ ...list, updatedAt: Date.now() });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  },

  deleteList: async (listId: string): Promise<void> => {
    const lists = await storageService.getLists();
    const newLists = lists.filter(l => l.id !== listId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLists));
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