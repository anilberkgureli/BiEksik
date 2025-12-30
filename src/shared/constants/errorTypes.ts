/**
 * Error Types and User-Friendly Messages
 * Centralized error handling constants
 */

export enum ErrorType {
    STORAGE_ERROR = 'STORAGE_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export const ErrorMessages: Record<ErrorType, string> = {
    [ErrorType.STORAGE_ERROR]: 'Failed to save data. Please try again.',
    [ErrorType.NETWORK_ERROR]: 'Network connection failed. Please check your internet.',
    [ErrorType.VALIDATION_ERROR]: 'Invalid data provided. Please check your input.',
    [ErrorType.NOT_FOUND]: 'The requested item was not found.',
    [ErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Operation-specific error messages
 */
export const OperationErrorMessages = {
    CREATE_LIST: 'Failed to create list. Please try again.',
    UPDATE_LIST: 'Failed to update list. Please try again.',
    DELETE_LIST: 'Failed to delete list. Please try again.',
    DELETE_LISTS: 'Failed to delete lists. Please try again.',
    LOAD_LISTS: 'Failed to load your lists. Please refresh the page.',
    ADD_ITEM: 'Failed to add item. Please try again.',
    UPDATE_ITEM: 'Failed to update item. Please try again.',
    DELETE_ITEM: 'Failed to delete item. Please try again.',
} as const;

/**
 * Get user-friendly error message from Error object
 */
export function getErrorMessage(error: Error, operation?: keyof typeof OperationErrorMessages): string {
    // If operation is specified, use operation-specific message
    if (operation && OperationErrorMessages[operation]) {
        return OperationErrorMessages[operation];
    }

    // Try to match error type from error message
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('storage') || errorMessage.includes('preferences')) {
        return ErrorMessages[ErrorType.STORAGE_ERROR];
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return ErrorMessages[ErrorType.NETWORK_ERROR];
    }

    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
        return ErrorMessages[ErrorType.VALIDATION_ERROR];
    }

    if (errorMessage.includes('not found')) {
        return ErrorMessages[ErrorType.NOT_FOUND];
    }

    return ErrorMessages[ErrorType.UNKNOWN_ERROR];
}
