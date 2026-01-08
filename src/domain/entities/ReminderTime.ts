/**
 * ReminderTime Value Object
 * Represents a scheduled date and time for reminder notifications
 */

export interface PlainReminderTime {
    scheduledDate: number; // timestamp
    enabled: boolean;
}

export class ReminderTime {
    constructor(
        public readonly scheduledDate: Date,
        public readonly enabled: boolean = true
    ) {
        this.validate();
    }

    /**
     * Validate reminder time values
     */
    private validate(): void {
        if (!(this.scheduledDate instanceof Date) || isNaN(this.scheduledDate.getTime())) {
            throw new Error('Invalid date');
        }
    }

    /**
     * Get formatted date and time string
     */
    getFormattedDateTime(): string {
        const year = this.scheduledDate.getFullYear();
        const month = (this.scheduledDate.getMonth() + 1).toString().padStart(2, '0');
        const day = this.scheduledDate.getDate().toString().padStart(2, '0');
        const hours = this.scheduledDate.getHours().toString().padStart(2, '0');
        const minutes = this.scheduledDate.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    /**
     * Get formatted time string (HH:MM) for backward compatibility
     */
    getFormattedTime(): string {
        const h = this.scheduledDate.getHours().toString().padStart(2, '0');
        const m = this.scheduledDate.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    /**
     * Get the scheduled date (already set, no need to calculate next occurrence)
     */
    getScheduledDate(): Date {
        return this.scheduledDate;
    }

    /**
     * Check if this reminder is in the past
     */
    isPast(): boolean {
        return this.scheduledDate <= new Date();
    }

    /**
     * Create a new ReminderTime with enabled toggled
     */
    toggleEnabled(): ReminderTime {
        return new ReminderTime(this.scheduledDate, !this.enabled);
    }

    /**
     * Serialize to plain object for storage
     */
    toPlainObject(): PlainReminderTime {
        return {
            scheduledDate: this.scheduledDate.getTime(),
            enabled: this.enabled
        };
    }

    /**
     * Deserialize from plain object
     */
    static fromPlainObject(plain: PlainReminderTime): ReminderTime {
        return new ReminderTime(new Date(plain.scheduledDate), plain.enabled);
    }

    /**
     * Create from ISO date string
     */
    static fromISOString(isoString: string, enabled: boolean = true): ReminderTime {
        return new ReminderTime(new Date(isoString), enabled);
    }
}
