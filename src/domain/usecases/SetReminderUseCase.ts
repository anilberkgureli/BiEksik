import type { IStorageRepository } from '../../domain/repositories/IStorageRepository';
import type { ReminderTime } from '../entities/ReminderTime';
import { NotificationService } from '../../infrastructure/notifications/NotificationService';

/**
 * SetReminderUseCase
 * Sets a reminder for a shopping list and schedules the notification
 */
export class SetReminderUseCase {
    constructor(private repository: IStorageRepository) { }

    async execute(listId: string, reminderTime: ReminderTime): Promise<void> {
        // Get the list
        const list = await this.repository.findById(listId);
        if (!list) {
            throw new Error(`List with id ${listId} not found`);
        }

        // Set the reminder
        list.setReminder(reminderTime);

        // Save to repository
        await this.repository.update(list);

        // Schedule notification if enabled
        if (reminderTime.enabled) {
            await NotificationService.scheduleReminder(
                list.id,
                list.title,
                reminderTime,
                list.getPendingCount()
            );
        } else {
            // If disabled, cancel the notification
            await NotificationService.cancelReminder(list.id);
        }
    }
}
