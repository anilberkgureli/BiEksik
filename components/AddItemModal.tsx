import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Modal, Button } from './ui';
import { translate } from '../utils/i18n';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, quantity: string, note: string, price?: number) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const priceValue = price ? parseFloat(price) : undefined;
      onAdd(name, quantity.toString(), note, priceValue);
      setName('');
      setQuantity(1);
      setNote('');
      setPrice('');
      onClose();
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translate('addItem.title')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translate('addItem.itemName')}</label>
          <input
            autoFocus
            type="text"
            placeholder={translate('addItem.itemNamePlaceholder')}
            className="w-full px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-slate-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translate('addItem.quantity')}</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decrementQuantity}
                className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <div className="flex-1 px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-center font-medium">
                {quantity}
              </div>
              <button
                type="button"
                onClick={incrementQuantity}
                className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translate('addItem.price')}</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder={translate('addItem.pricePlaceholder')}
            className="w-full px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-slate-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translate('addItem.notes')}</label>
          <textarea
            rows={2}
            placeholder={translate('addItem.notesPlaceholder')}
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
            {translate('addItem.addItem')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddItemModal;
