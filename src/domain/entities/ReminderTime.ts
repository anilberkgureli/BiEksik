/**
 * ReminderTime Value Object
 * Represents a scheduled time for reminder notifications
 */

export interface PlainReminderTime {
    hour: number;
    minute: number;
    enabled: boolean;
}

export class ReminderTime {
    constructor(
        public readonly hour: number,
        public readonly minute: number,
        public readonly enabled: boolean = true
    ) {
        this.validate();
    }

    /**
     * Validate reminder time values
     */
    private validate(): void {
        if (this.hour < 0 || this.hour > 23) {
            throw new Error('Hour must be between 0 and 23');
        }
        if (this.minute < 0 || this.minute > 59) {
            throw new Error('Minute must be between 0 and 59');
        }
    }

    /**
     * Get formatted time string (HH:MM)
     */
    getFormattedTime(): string {
        const h = this.hour.toString().padStart(2, '0');
        const m = this.minute.toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    /**
     * Get next occurrence of this time as Date
     */
    getNextOccurrence(): Date {
        const now = new Date();
        const scheduled = new Date();
        scheduled.setHours(this.hour, this.minute, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (scheduled <= now) {
            scheduled.setDate(scheduled.getDate() + 1);
        }

        return scheduled;
    }

    /**
     * Check if this time is in the past today
     */
    isPastToday(): boolean {
        const now = new Date();
        const scheduled = new Date();
        scheduled.setHours(this.hour, this.minute, 0, 0);
        return scheduled <= now;
    }

    /**
     * Create a new ReminderTime with enabled toggled
     */
    toggleEnabled(): ReminderTime {
        return new ReminderTime(this.hour, this.minute, !this.enabled);
    }

    /**
     * Serialize to plain object for storage
     */
    toPlainObject(): PlainReminderTime {
        return {
            hour: this.hour,
            minute: this.minute,
            enabled: this.enabled
        };
    }

    /**
     * Deserialize from plain object
     */
    static fromPlainObject(plain: PlainReminderTime): ReminderTime {
        return new ReminderTime(plain.hour, plain.minute, plain.enabled);
    }

    /**
     * Create from time string (HH:MM)
     */
    static fromTimeString(time: string, enabled: boolean = true): ReminderTime {
        const [hourStr, minuteStr] = time.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        return new ReminderTime(hour, minute, enabled);
    }
}
