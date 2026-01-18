import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Icon element to display
     */
    icon: React.ReactNode;

    /**
     * Accessible label for screen readers
     */
    'aria-label': string;

    /**
     * Button size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Visual variant
     * @default 'ghost'
     */
    variant?: 'ghost' | 'danger' | 'primary';
}

const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
};

const variantClasses = {
    ghost: 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
    primary: 'text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
};

/**
 * Icon-only button component for actions
 */
export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    size = 'md',
    variant = 'ghost',
    className = '',
    ...props
}) => {
    return (
        <button
            className={`rounded-full transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {icon}
        </button>
    );
};

