import { LocalNotifications } from '@capacitor/local-notifications';
import type { ReminderTime } from '../../domain/entities/ReminderTime';

/**
 * NotificationService
 * Handles scheduling and managing local notifications using Capacitor
 */
export class NotificationService {
    /**
     * Request notification permission from the user
     */
    static async requestPermission(): Promise<boolean> {
        try {
            const result = await LocalNotifications.requestPermissions();
            return result.display === 'granted';
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            return false;
        }
    }

    /**
     * Check if notification permission is granted
     */
    static async checkPermission(): Promise<boolean> {
        try {
            const result = await LocalNotifications.checkPermissions();
            return result.display === 'granted';
        } catch (error) {
            console.error('Failed to check notification permission:', error);
            return false;
        }
    }

    /**
     * Schedule a reminder notification for a shopping list
     */
    static async scheduleReminder(
        listId: string,
        listTitle: string,
        reminderTime: ReminderTime,
        pendingCount: number
    ): Promise<void> {
        try {
            // Check permission first
            const hasPermission = await this.checkPermission();
            if (!hasPermission) {
                const granted = await this.requestPermission();
                if (!granted) {
                    throw new Error('Notification permission not granted');
                }
            }

            // Cancel existing notification for this list
            await this.cancelReminder(listId);

            // Get next occurrence time
            const scheduledDate = reminderTime.getNextOccurrence();

            // Schedule the notification
            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: this.getNotificationId(listId),
                        title: listTitle,
                        body: pendingCount > 0
                            ? `${pendingCount} öğe bekliyor`
                            : 'Alışveriş listenizi kontrol edin',
                        schedule: {
                            at: scheduledDate,
                            allowWhileIdle: true
                        },
                        extra: {
                            listId: listId
                        }
                    }
                ]
            });

            console.log(`Scheduled reminder for list ${listId} at ${scheduledDate.toLocaleString()}`);
        } catch (error) {
            console.error('Failed to schedule reminder:', error);
            throw error;
        }
    }

    /**
     * Cancel a reminder notification for a shopping list
     */
    static async cancelReminder(listId: string): Promise<void> {
        try {
            const notificationId = this.getNotificationId(listId);
            await LocalNotifications.cancel({
                notifications: [{ id: notificationId }]
            });
            console.log(`Cancelled reminder for list ${listId}`);
        } catch (error) {
            console.error('Failed to cancel reminder:', error);
            // Don't throw - cancelling a non-existent notification is not an error
        }
    }

    /**
     * Cancel all reminder notifications
     */
    static async cancelAllReminders(): Promise<void> {
        try {
            await LocalNotifications.removeAllDeliveredNotifications();
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel({
                    notifications: pending.notifications.map(n => ({ id: n.id }))
                });
            }
            console.log('Cancelled all reminders');
        } catch (error) {
            console.error('Failed to cancel all reminders:', error);
        }
    }

    /**
     * Sync reminders for all lists
     * Cancels old reminders and schedules new ones
     */
    static async syncReminders(
        lists: Array<{ id: string; title: string; reminder?: ReminderTime; getPendingCount: () => number }>
    ): Promise<void> {
        try {
            // Get all pending notifications
            const pending = await LocalNotifications.getPending();
            const existingIds = new Set(pending.notifications.map(n => n.id));

            // Get list IDs that should have reminders
            const activeListIds = new Set(
                lists
                    .filter(list => list.reminder?.enabled)
                    .map(list => this.getNotificationId(list.id))
            );

            // Cancel notifications for lists that no longer exist or have no reminder
            const toCancel = Array.from(existingIds).filter(id => !activeListIds.has(id));
            if (toCancel.length > 0) {
                await LocalNotifications.cancel({
                    notifications: toCancel.map(id => ({ id }))
                });
            }

            // Schedule reminders for active lists
            for (const list of lists) {
                if (list.reminder?.enabled) {
                    await this.scheduleReminder(
                        list.id,
                        list.title,
                        list.reminder,
                        list.getPendingCount()
                    );
                }
            }

            console.log('Synced all reminders');
        } catch (error) {
            console.error('Failed to sync reminders:', error);
        }
    }

    /**
     * Generate a unique notification ID for a list
     * Uses a hash of the list ID to ensure consistent IDs
     */
    private static getNotificationId(listId: string): number {
        // Simple hash function to convert string to number
        let hash = 0;
        for (let i = 0; i < listId.length; i++) {
            const char = listId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}
