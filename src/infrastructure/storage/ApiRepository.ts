import { ShoppingList } from '../../domain/entities/ShoppingList';
import { IStorageRepository } from '../../domain/repositories/IStorageRepository';

/**
 * API Repository Implementation (Future)
 * Will be used when backend is ready
 * Implements the IStorageRepository interface
 */
export class ApiRepository implements IStorageRepository {
    private readonly baseUrl: string;

    constructor(baseUrl: string = '/api') {
        this.baseUrl = baseUrl;
    }

    /**
     * Get all shopping lists from API
     */
    async getLists(): Promise<ShoppingList[]> {
        try {
            const response = await fetch(`${this.baseUrl}/lists`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.map((plain: any) => ShoppingList.fromPlainObject(plain));
        } catch (error) {
            console.error('Error fetching lists from API:', error);
            throw new Error('Failed to fetch lists from server');
        }
    }

    /**
     * Save a shopping list to API (create or update)
     */
    async saveList(list: ShoppingList): Promise<void> {
        try {
            const method = list.createdAt === list.updatedAt ? 'POST' : 'PUT';
            const url = method === 'POST'
                ? `${this.baseUrl}/lists`
                : `${this.baseUrl}/lists/${list.id}`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(list.toPlainObject()),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error saving list to API:', error);
            throw new Error('Failed to save list to server');
        }
    }

    /**
     * Delete a shopping list from API
     */
    async deleteList(listId: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/lists/${listId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting list from API:', error);
            throw new Error('Failed to delete list from server');
        }
    }

    /**
     * Delete multiple shopping lists from API
     */
    async deleteLists(listIds: string[]): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/lists/bulk-delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: listIds }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting lists from API:', error);
            throw new Error('Failed to delete lists from server');
        }
    }
}
