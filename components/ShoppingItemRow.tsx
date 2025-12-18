import React from 'react';
import { ShoppingItem } from '../types';
import { Check, Trash2 } from 'lucide-react';
import { useSwipe } from '../hooks/useSwipe';

interface ShoppingItemRowProps {
    item: ShoppingItem;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ShoppingItemRow: React.FC<ShoppingItemRowProps> = ({ item, onToggle, onDelete }) => {
    const { swipedId, resetSwipe, handlers } = useSwipe();
    const isSwiped = swipedId === item.id;

    return (
        <div className="relative overflow-hidden group border-b border-slate-50 dark:border-slate-800 last:border-none" onClick={e => e.stopPropagation()}>
            {/* Swipe Delete Background */}
            <div className={`absolute inset-0 flex justify-end transition-opacity duration-300 ${isSwiped ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    className="w-20 bg-red-500 flex items-center justify-center text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                        resetSwipe();
                    }}
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Foreground Item */}
            <div
                {...handlers}
                onPointerDown={(e) => handlers.onPointerDown(e, item.id)}
                onPointerUp={(e) => handlers.onPointerUp(e, item.id)}
                className={`relative bg-white/40 dark:bg-slate-900/40 flex items-center p-3 transition-transform duration-300 ease-out z-10 select-none cursor-grab active:cursor-grabbing ${isSwiped ? '-translate-x-20' : 'translate-x-0'}`}
                onClick={() => {
                    if (isSwiped) resetSwipe();
                }}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
                    className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-transparent hover:border-primary dark:hover:border-primary focus:outline-none transition-colors flex-shrink-0"
                >
                    <div className={`w-4 h-4 rounded-full bg-primary transition-transform ${item.isCompleted ? 'scale-100' : 'scale-0'}`} />
                </button>
                <div className="flex-1 ml-3 min-w-0" onClick={() => onToggle(item.id)}>
                    <p className="text-slate-800 dark:text-slate-200 font-medium truncate">{item.name}</p>
                    {(item.quantity || item.note) && (
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.quantity && <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">{item.quantity}</span>}
                            {item.note && <span className="truncate max-w-[150px]">{item.note}</span>}
                        </div>
                    )}
                </div>

                {/* Fallback Delete Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="ml-2 p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer touch-manipulation"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};
