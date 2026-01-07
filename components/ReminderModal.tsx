import React, { useState, useEffect } from 'react';
import { X, Bell, BellOff, Trash2 } from 'lucide-react';
import { ReminderTime } from '../src/domain/entities/ReminderTime';
import { t } from '../utils/i18n';

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
    const [hour, setHour] = useState(currentReminder?.hour ?? 9);
    const [minute, setMinute] = useState(currentReminder?.minute ?? 0);
    const [enabled, setEnabled] = useState(currentReminder?.enabled ?? true);

    // Update state when currentReminder changes
    useEffect(() => {
        if (currentReminder) {
            setHour(currentReminder.hour);
            setMinute(currentReminder.minute);
            setEnabled(currentReminder.enabled);
        } else {
            setHour(9);
            setMinute(0);
            setEnabled(true);
        }
    }, [currentReminder]);

    const handleSave = () => {
        try {
            const reminderTime = new ReminderTime(hour, minute, enabled);
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
                                {currentReminder ? t('reminder.edit') : t('reminder.add')}
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

                {/* Time Picker */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        {t('reminder.time')}
                    </label>
                    <div className="flex items-center gap-3">
                        <select
                            value={hour}
                            onChange={(e) => setHour(parseInt(e.target.value))}
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i}>
                                    {i.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        <span className="text-2xl font-bold text-slate-400">:</span>
                        <select
                            value={minute}
                            onChange={(e) => setMinute(parseInt(e.target.value))}
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={i}>
                                    {i.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                    </div>
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
                                    {enabled ? t('reminder.enabled') : t('reminder.disabled')}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {enabled ? t('reminder.willNotify') : t('reminder.wontNotify')}
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
                            {t('common.delete')}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                    >
                        {t('common.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};
