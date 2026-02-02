import React, { useState, useEffect } from 'react';
import { ShoppingItem } from '../types';
import { translate } from '../utils/i18n';
import { Minus, Plus, Save } from 'lucide-react';

interface EditItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, quantity: string, note: string, price?: number) => void;
    item: ShoppingItem | null;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, onSave, item }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState('');
    const [price, setPrice] = useState('');
    const [originalQuantity, setOriginalQuantity] = useState(1);
    const [originalPrice, setOriginalPrice] = useState<number | undefined>();

    // Populate form when item changes
    useEffect(() => {
        if (item) {
            setName(item.name);
            const qty = item.quantity ? parseInt(item.quantity) || 1 : 1;
            setQuantity(qty);
            setNote(item.note || '');
            setPrice(item.price ? item.price.toString() : '');
            setOriginalQuantity(qty);
            setOriginalPrice(item.price);

            console.log('EditItemModal - Item loaded:', {
                name: item.name,
                quantity: qty,
                price: item.price,
                originalQuantity: qty,
                originalPrice: item.price
            });
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            const priceValue = price ? parseFloat(price) : undefined;
            onSave(name, quantity.toString(), note, priceValue);
            onClose();
        }
    };

    const incrementQuantity = () => {
        setQuantity(prev => {
            const newQty = prev + 1;
            console.log('Increment - Before calculation:', {
                newQty,
                originalPrice,
                originalQuantity,
                hasPrice: originalPrice && originalQuantity > 0
            });

            // Auto-update price based on unit price if original price exists
            if (originalPrice && originalQuantity > 0) {
                const unitPrice = originalPrice / originalQuantity;
                const newPrice = (unitPrice * newQty).toFixed(2);
                console.log('Increment - Price calculation:', {
                    unitPrice,
                    newQty,
                    newPrice
                });
                setPrice(newPrice);
            }
            return newQty;
        });
    };

    const decrementQuantity = () => {
        setQuantity(prev => {
            if (prev <= 1) return prev;
            const newQty = prev - 1;
            // Auto-update price based on unit price if original price exists
            if (originalPrice && originalQuantity > 0) {
                const unitPrice = originalPrice / originalQuantity;
                setPrice((unitPrice * newQty).toFixed(2));
            }
            return newQty;
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{translate('editItem.title')}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translate('addItem.itemName')}</label>
                            <input
                                type="text"
                                autoFocus
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
                                placeholder={translate('addItem.notesPlaceholder')}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none placeholder:text-slate-500"
                                rows={3}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                            >
                                {translate('addItem.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {translate('editItem.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditItemModal;
