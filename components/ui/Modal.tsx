import React from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface ModalProps {
    /**
     * Whether the modal is open
     */
    isOpen: boolean;

    /**
     * Callback when modal should close
     */
    onClose: () => void;

    /**
     * Modal title
     */
    title?: string;

    /**
     * Modal content
     */
    children: React.ReactNode;

    /**
     * Footer content (typically action buttons)
     */
    footer?: React.ReactNode;

    /**
     * Size of the modal
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Whether clicking outside closes the modal
     * @default true
     */
    closeOnOutsideClick?: boolean;

    /**
     * Whether to show close button
     * @default true
     */
    showCloseButton?: boolean;
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

/**
 * Reusable Modal/Dialog component
 */
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOutsideClick = true,
    showCloseButton = true,
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = () => {
        if (closeOnOutsideClick) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ${sizeClasses[size]} w-full border border-slate-100 dark:border-slate-800`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        {title && (
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <IconButton
                                icon={<X size={20} />}
                                onClick={onClose}
                                aria-label="Close modal"
                                className="ml-auto"
                            />
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-4">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
