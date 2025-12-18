import React from 'react';

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual style variant
     * @default 'primary'
     */
    variant?: ButtonVariant;

    /**
     * Button size
     * @default 'md'
     */
    size?: ButtonSize;

    /**
     * Full width button
     * @default false
     */
    fullWidth?: boolean;

    /**
     * Icon to display before text
     */
    leftIcon?: React.ReactNode;

    /**
     * Icon to display after text
     */
    rightIcon?: React.ReactNode;

    /**
     * Loading state
     * @default false
     */
    isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white hover:bg-indigo-700 shadow-md hover:shadow-lg disabled:opacity-50',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    ghost: 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
};

/**
 * Reusable Button component with variants and sizes
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leftIcon,
    rightIcon,
    isLoading = false,
    className = '',
    children,
    disabled,
    ...props
}) => {
    const baseStyles = 'font-medium rounded-xl transition-colors flex items-center justify-center gap-2';
    const widthStyles = fullWidth ? 'w-full' : '';
    const disabledStyles = disabled || isLoading ? 'cursor-not-allowed' : 'cursor-pointer';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {!isLoading && leftIcon}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
};
