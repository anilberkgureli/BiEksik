import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal, Button } from './ui';
import { t } from '../utils/i18n';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, quantity: string, note: string) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, quantity, note);
      setName('');
      setQuantity('');
      setNote('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('addItem.title')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('addItem.itemName')}</label>
          <input
            autoFocus
            type="text"
            placeholder={t('addItem.itemNamePlaceholder')}
            className="w-full px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-slate-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('addItem.quantity')}</label>
            <input
              type="text"
              placeholder={t('addItem.quantityPlaceholder')}
              className="w-full px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-slate-500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('addItem.notes')}</label>
          <textarea
            rows={2}
            placeholder={t('addItem.notesPlaceholder')}
            className="w-full px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none placeholder:text-slate-500"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={!name.trim()}
            variant="primary"
            fullWidth
            leftIcon={<Plus size={20} />}
          >
            {t('addItem.addItem')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddItemModal;