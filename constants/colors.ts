/**
 * Color palette for shopping lists
 * Provides visual distinction between different lists
 */
export const COLORS = [
    "#ef4444", // Red
    "#f97316", // Orange
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#8b5cf6", // Violet
] as const;

/**
 * Type-safe color type derived from COLORS array
 */
export type ListColor = typeof COLORS[number];

/**
 * Default color for new lists
 */
export const DEFAULT_COLOR: ListColor = COLORS[4]; // Violet (#8b5cf6)
