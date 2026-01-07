/**
 * Shopping item categories
 * Used for grouping and organizing shopping list items
 */
export const CATEGORIES = [
    "Produce",
    "Dairy & Cheese",
    "Meat & Seafood",
    "Bakery",
    "Pantry",
    "Frozen Foods",
    "Beverages",
    "Snacks",
    "Personal Care",
    "Household",
    "Other"
] as const;

/**
 * Type-safe category type derived from CATEGORIES array
 */
export type Category = typeof CATEGORIES[number];

/**
 * Default category for uncategorized items
 */
export const DEFAULT_CATEGORY: Category = "Other";
