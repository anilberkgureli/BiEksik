import type { IStorageRepository } from '../../domain/repositories/IStorageRepository';
import { NotificationService } from '../../infrastructure/notifications/NotificationService';

/**
 * ClearReminderUseCase
 * Clears a reminder from a shopping list and cancels the notification
 */
export class ClearReminderUseCase {
    constructor(private repository: IStorageRepository) { }

    async execute(listId: string): Promise<void> {
        // Get the list
        const list = await this.repository.findById(listId);
        if (!list) {
            throw new Error(`List with id ${listId} not found`);
        }

        // Clear the reminder
        list.clearReminder();

        // Save to repository
        await this.repository.update(list);

        // Cancel the notification
        await NotificationService.cancelReminder(list.id);
    }
}
