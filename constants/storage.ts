/**
 * Storage keys for localStorage
 * Centralized to avoid typos and enable easy migration
 */
export const STORAGE_KEYS = {
    /**
     * Main storage key for shopping lists data
     * Version suffix allows for future migrations
     */
    LISTS: 'smartlist_data_v1',

    /**
     * User theme preference (light/dark)
     */
    THEME: 'smartlist_theme',

    /**
     * User language preference
     */
    LANGUAGE: 'smartlist_language',
} as const;

/**
 * Simulate network delay for realistic feel
 * Useful for development and testing
 */
export const NETWORK_DELAY_MS = 300;
