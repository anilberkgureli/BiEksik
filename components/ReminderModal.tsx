import React, { useState, useEffect } from 'react';
import { X, Bell, BellOff, Trash2 } from 'lucide-react';
import { ReminderTime } from '../src/domain/entities/ReminderTime';
import { translate } from '../utils/i18n';

interface ReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reminderTime: ReminderTime) => void;
    onDelete?: () => void;
    currentReminder?: ReminderTime;
    listTitle: string;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    currentReminder,
    listTitle
}) => {
    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const formatDateTimeLocal = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Default to 1 hour from now
    const getDefaultDateTime = (): string => {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return formatDateTimeLocal(date);
    };

    const [dateTime, setDateTime] = useState(
        currentReminder
            ? formatDateTimeLocal(currentReminder.scheduledDate)
            : getDefaultDateTime()
    );
    const [enabled, setEnabled] = useState(currentReminder?.enabled ?? true);

    // Update state when currentReminder changes
    useEffect(() => {
        if (currentReminder) {
            setDateTime(formatDateTimeLocal(currentReminder.scheduledDate));
            setEnabled(currentReminder.enabled);
        } else {
            setDateTime(getDefaultDateTime());
            setEnabled(true);
        }
    }, [currentReminder]);

    const handleSave = () => {
        try {
            const scheduledDate = new Date(dateTime);
            const reminderTime = new ReminderTime(scheduledDate, enabled);
            onSave(reminderTime);
            onClose();
        } catch (error) {
            console.error('Invalid reminder time:', error);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
            onClose();
        }
    };

    if (!isOpen) return null;

    // Get minimum datetime (now)
    const minDateTime = formatDateTimeLocal(new Date());

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {currentReminder ? translate('reminder.edit') : translate('reminder.add')}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{listTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Date Time Picker */}
                <div className="mb-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        {translate('reminder.dateTime')}
                    </label>

                    {/* Date Picker */}
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                            {translate('reminder.date')}
                        </label>
                        <input
                            type="date"
                            value={dateTime.split('T')[0]}
                            min={minDateTime.split('T')[0]}
                            onChange={(e) => {
                                const time = dateTime.split('T')[1] || '09:00';
                                setDateTime(`${e.target.value}T${time}`);
                            }}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Time Picker - 24 hour format */}
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                            {translate('reminder.time')}
                        </label>
                        <div className="flex items-center gap-3">
                            <select
                                value={dateTime.split('T')[1]?.split(':')[0] || '09'}
                                onChange={(e) => {
                                    const date = dateTime.split('T')[0];
                                    const minute = dateTime.split('T')[1]?.split(':')[1] || '00';
                                    setDateTime(`${date}T${e.target.value}:${minute}`);
                                }}
                                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                            <span className="text-2xl font-bold text-slate-400">:</span>
                            <select
                                value={dateTime.split('T')[1]?.split(':')[1] || '00'}
                                onChange={(e) => {
                                    const date = dateTime.split('T')[0];
                                    const hour = dateTime.split('T')[1]?.split(':')[0] || '09';
                                    setDateTime(`${date}T${hour}:${e.target.value}`);
                                }}
                                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {translate('reminder.selectFutureTime')}
                    </p>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {enabled ? (
                                <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                                <BellOff className="w-5 h-5 text-slate-400" />
                            )}
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {enabled ? translate('reminder.enabled') : translate('reminder.disabled')}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {enabled ? translate('reminder.willNotify') : translate('reminder.wontNotify')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setEnabled(!enabled)}
                            className={`relative w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                        >
                            <div
                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {currentReminder && onDelete && (
                        <button
                            onClick={handleDelete}
                            className="flex-1 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            {translate('common.delete')}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        {translate('common.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                    >
                        {translate('common.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

