import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal, Button } from './ui';
import { t } from '../utils/i18n';

export interface DeleteConfirmationModalProps {
    /**
     * Whether the modal is open
     */
    isOpen: boolean;

    /**
     * Callback when modal should close
     */
    onClose: () => void;

    /**
     * Callback when delete is confirmed
     */
    onConfirm: () => void;

    /**
     * Title of the modal
     * @default 'deleteConfirmation.deleteList'
     */
    title?: string;

    /**
     * Description/warning message
     */
    message: string;
}

/**
 * Reusable delete confirmation modal
 */
export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = t('deleteConfirmation.deleteList'),
    message,
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                    <Trash2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    {message}
                </p>
                <div className="flex gap-3 w-full">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        fullWidth
                    >
                        {t('deleteConfirmation.cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="danger"
                        fullWidth
                    >
                        {t('deleteConfirmation.delete')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
