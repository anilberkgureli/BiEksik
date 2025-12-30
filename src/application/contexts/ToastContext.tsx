import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast, ToastVariant } from '../../../components/ui/Toast';
import { registerErrorToast } from '../../shared/services/errorHandler';

interface ToastData {
    id: string;
    message: string;
    variant: ToastVariant;
    duration: number;
}

interface ToastContextValue {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 3000;
const ERROR_DURATION = 5000;

/**
 * Toast Provider Component
 * Manages toast notifications globally
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    // Register error toast handler on mount
    useEffect(() => {
        registerErrorToast((message: string) => {
            showError(message);
        });
    }, []);

    const addToast = useCallback((message: string, variant: ToastVariant, duration: number) => {
        const id = `toast-${Date.now()}-${Math.random()}`;

        setToasts((prev) => {
            // Limit to MAX_TOASTS
            const newToasts = [...prev, { id, message, variant, duration }];
            if (newToasts.length > MAX_TOASTS) {
                return newToasts.slice(-MAX_TOASTS);
            }
            return newToasts;
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message: string) => {
        addToast(message, 'success', DEFAULT_DURATION);
    }, [addToast]);

    const showError = useCallback((message: string) => {
        addToast(message, 'error', ERROR_DURATION);
    }, [addToast]);

    const showWarning = useCallback((message: string) => {
        addToast(message, 'warning', DEFAULT_DURATION);
    }, [addToast]);

    const showInfo = useCallback((message: string) => {
        addToast(message, 'info', DEFAULT_DURATION);
    }, [addToast]);

    const value: ToastContextValue = {
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        variant={toast.variant}
                        duration={toast.duration}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

/**
 * Hook to access toast notifications
 */
export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
