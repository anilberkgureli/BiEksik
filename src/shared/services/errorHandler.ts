/**
 * Error Handler Service
 * Centralized error handling and logging
 */

import { getErrorMessage } from '../constants/errorTypes';
import type { OperationErrorMessages } from '../constants/errorTypes';

type ToastFunction = (message: string) => void;

/**
 * Global toast function reference
 * Set by ToastContext when initialized
 */
let showErrorToast: ToastFunction | null = null;

/**
 * Register toast notification function
 * Called by ToastContext on initialization
 */
export function registerErrorToast(toastFn: ToastFunction): void {
    showErrorToast = toastFn;
}

/**
 * Handle error with logging and user notification
 * @param error - The error object
 * @param operation - Optional operation context for specific error messages
 * @param context - Optional additional context for debugging
 */
export function handleError(
    error: Error,
    operation?: keyof typeof OperationErrorMessages,
    context?: string
): void {
    // Log to console for debugging
    const logMessage = context
        ? `[${context}] ${error.message}`
        : error.message;

    console.error(logMessage, error);

    // Show user-friendly toast notification
    const userMessage = getErrorMessage(error, operation);

    if (showErrorToast) {
        showErrorToast(userMessage);
    } else {
        // Fallback if toast system not initialized
        console.warn('Toast system not initialized. Error:', userMessage);
    }
}

/**
 * Create a user-friendly error message
 * @param error - The error object
 * @param operation - Optional operation context
 * @returns User-friendly error message
 */
export function createUserFriendlyMessage(
    error: Error,
    operation?: keyof typeof OperationErrorMessages
): string {
    return getErrorMessage(error, operation);
}

/**
 * Wrap async function with error handling
 * @param fn - Async function to wrap
 * @param operation - Operation context for error messages
 * @returns Wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    operation?: keyof typeof OperationErrorMessages
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            handleError(
                error instanceof Error ? error : new Error('Unknown error'),
                operation
            );
            throw error; // Re-throw for caller to handle
        }
    }) as T;
}
