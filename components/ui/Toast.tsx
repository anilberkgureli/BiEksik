import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './Toast.css';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string;
    message: string;
    variant?: ToastVariant;
    duration?: number;
    onClose: (id: string) => void;
}

/**
 * Toast Notification Component
 * Displays temporary notification messages with auto-dismiss
 */
export const Toast: React.FC<ToastProps> = ({
    id,
    message,
    variant = 'info',
    duration = 3000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const enterTimer = setTimeout(() => setIsVisible(true), 10);

        // Auto-dismiss timer
        const dismissTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(dismissTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Match CSS animation duration
    };

    const getIcon = () => {
        switch (variant) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
            default:
                return 'ℹ';
        }
    };

    return (
        <div
            className={`toast toast--${variant} ${isVisible && !isExiting ? 'toast--visible' : ''} ${isExiting ? 'toast--exiting' : ''}`}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="toast__icon">{getIcon()}</div>
            <div className="toast__message">{message}</div>
            <button
                className="toast__close"
                onClick={handleClose}
                aria-label="Close notification"
                type="button"
            >
                <X size={16} />
            </button>
        </div>
    );
};

