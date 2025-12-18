import React from 'react';

export interface FilterChipProps {
    /**
     * Chip label
     */
    label: string;

    /**
     * Whether chip is active/selected
     */
    isActive: boolean;

    /**
     * Click handler
     */
    onClick: () => void;

    /**
     * Optional icon to display
     */
    icon?: React.ReactNode;

    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Filter chip component for toggleable options
 */
export const FilterChip: React.FC<FilterChipProps> = ({
    label,
    isActive,
    onClick,
    icon,
    className = '',
}) => {
    const activeStyles = isActive
        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-primary dark:text-indigo-400'
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${activeStyles} ${className}`}
        >
            {icon}
            {label}
        </button>
    );
};
