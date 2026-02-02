import React from 'react';
import { ShoppingItem } from '../types';
import { Trash2 } from 'lucide-react';
import { useSwipe } from '../hooks/useSwipe';
import { Language, translate } from '../utils/i18n';

interface ShoppingItemRowProps {
    item: ShoppingItem;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    language?: Language;
}

export const ShoppingItemRow: React.FC<ShoppingItemRowProps> = ({
    item,
    onToggle,
    onDelete,
    onEdit,
    language = 'en'
}) => {
    // Swipe hook'u - sola kaydırma için
    const { swipedId, resetSwipe, handlers } = useSwipe();
    const isSwiped = swipedId === item.id;

    // Silme onayı fonksiyonu
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        const confirmMessage = language === 'tr'
            ? 'Bu ürünü listeden silmek istediğinize emin misiniz?'
            : 'Are you sure you want to delete this item from the list?';
        if (window.confirm(confirmMessage)) {
            onDelete(item.id);
            if (isSwiped) resetSwipe();
        }
    };

    // Checkbox toggle fonksiyonu
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(item.id);
    };

    // Edit fonksiyonu
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(item.id);
    };

    return (
        <div className="relative overflow-hidden group border-b border-slate-50 dark:border-slate-800 last:border-none">
            {/* Arka plan - Sola kaydırınca görünen kırmızı SİL butonu */}
            <div className={`absolute inset-0 flex justify-end transition-opacity duration-300 ${isSwiped ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    aria-label={`Delete ${item.name} from shopping list`}
                    className="w-20 bg-red-500 flex flex-col items-center justify-center text-white gap-1"
                    onClick={handleDelete}
                >
                    <Trash2 size={20} aria-hidden="true" />
                    <span className="text-[10px] font-bold">
                        {language === 'tr' ? 'SİL' : 'DELETE'}
                    </span>
                </button>
            </div>

            {/* Ön plan - Ürün bilgileri */}
            <div
                {...handlers}
                onPointerDown={(e) => handlers.onPointerDown(e, item.id)}
                onPointerUp={(e) => handlers.onPointerUp(e, item.id)}
                style={{ touchAction: 'pan-y' }} // Dikey scroll'a izin ver, yatay swipe'ı yakala
                className={`relative bg-white/40 dark:bg-slate-900/40 flex items-center p-3 transition-transform duration-300 ease-out z-10 select-none ${isSwiped ? '-translate-x-20' : 'translate-x-0'}`}
                onClick={() => {
                    if (isSwiped) resetSwipe();
                }}
            >
                {/* Checkbox - Ürünü tamamla/tamamlama */}
                <button
                    onClick={handleToggle}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggle(item.id);
                        }
                    }}
                    aria-label={`Mark ${item.name} as ${item.isCompleted ? 'incomplete' : 'complete'}`}
                    aria-checked={item.isCompleted}
                    role="checkbox"
                    className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-transparent hover:border-primary dark:hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors flex-shrink-0"
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-primary transition-transform ${item.isCompleted ? 'scale-100' : 'scale-0'}`}
                        aria-hidden="true"
                    />
                </button>

                {/* Ürün bilgileri - İsim, miktar, not - Tıklanabilir */}
                <div className="flex-1 ml-3 min-w-0 cursor-pointer" onClick={handleEdit}>
                    <p className={`text-slate-800 dark:text-slate-200 font-medium truncate ${item.isCompleted ? 'line-through opacity-50' : ''}`}>
                        {item.name}
                    </p>
                    {(item.quantity || item.note || item.price) && (
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.quantity && (
                                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                    {item.quantity}
                                </span>
                            )}
                            {item.price && (
                                <span className="bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded text-green-700 dark:text-green-400 font-semibold">
                                    ₺{item.price.toFixed(2)}
                                </span>
                            )}
                            {item.note && (
                                <span className="truncate max-w-[150px]">{item.note}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Çöp kutusu butonu - Sadece swipe edilmediğinde göster */}
                {!isSwiped && (
                    <button
                        onClick={handleDelete}
                        onPointerDown={(e) => e.stopPropagation()}
                        aria-label={`Delete ${item.name}`}
                        className="ml-2 p-2 text-slate-300 dark:text-slate-600 active:text-red-500 dark:active:text-red-400 active:bg-red-50 dark:active:bg-red-900/20 rounded-full transition-all cursor-pointer touch-manipulation focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                        <Trash2 size={18} aria-hidden="true" />
                    </button>
                )}
            </div>
        </div>
    );
};
