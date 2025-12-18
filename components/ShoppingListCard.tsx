import React from 'react';
import { ShoppingList } from '../types';
import { ShoppingBag, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { useSwipe } from '../hooks/useSwipe';
import { t } from '../utils/i18n';

interface ShoppingListCardProps {
    list: ShoppingList;
    onSelect: (list: ShoppingList) => void;
    onDelete: (id: string) => void;
    setListToDelete: (id: string) => void;
}

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({ list, onSelect, onDelete, setListToDelete }) => {
    const { swipedId, resetSwipe, handlers } = useSwipe({
        onSwipeLeft: () => { }, // State is handled locally by swipedId
        onSwipeRight: () => { }
    });

    const isSwiped = swipedId === list.id;
    const itemCount = list.items.length;
    const completedCount = list.items.filter(i => i.isCompleted).length;
    const progress = itemCount > 0 ? (completedCount / itemCount) * 100 : 0;

    return (
        <div className="relative group rounded-2xl overflow-hidden touch-none" onClick={e => e.stopPropagation()}>
            {/* Background Delete Action (Swipe) */}
            <div className={`absolute inset-0 flex justify-end transition-opacity duration-300 ${isSwiped ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    className="w-24 h-full bg-red-500 text-white flex flex-col items-center justify-center rounded-r-2xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        setListToDelete(list.id);
                        resetSwipe();
                    }}
                >
                    <Trash2 size={24} />
                    <span className="text-xs font-bold mt-1">{t('dashboard.delete')}</span>
                </button>
            </div>

            {/* Foreground Card */}
            <div
                {...handlers}
                onPointerDown={(e) => handlers.onPointerDown(e, list.id)}
                onPointerUp={(e) => handlers.onPointerUp(e, list.id)}
                onClick={(e) => {
                    if (isSwiped) resetSwipe();
                    else onSelect(list);
                }}
                className={`relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 shadow-sm border border-slate-100/50 dark:border-slate-800/50 transition-transform duration-300 ease-out z-10 rounded-2xl select-none cursor-pointer ${isSwiped ? '-translate-x-24' : 'translate-x-0'}`}
            >
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: list.color }}></div>

                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <ShoppingBag size={20} style={{ color: list.color }} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">{list.title}</h3>
                            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mt-1">
                                <Clock size={12} className="mr-1" />
                                {new Date(list.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Fallback Action Buttons */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setListToDelete(list.id);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-20 touch-manipulation cursor-pointer"
                        >
                            <Trash2 size={18} className="pointer-events-none" />
                        </button>
                        <ChevronRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pointer-events-none">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500 dark:text-slate-400">{completedCount}/{itemCount} {t('dashboard.bought')}</span>
                        <span className="text-slate-400 dark:text-slate-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: list.color }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
