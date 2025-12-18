import React, { useState } from 'react';
import { COLORS, type ListColor } from '../constants';
import { Plus } from 'lucide-react';
import { Button } from './ui';
import { t } from '../utils/i18n';

interface CreateListFormProps {
    onCreate: (title: string, color: ListColor) => void;
}

export const CreateListForm: React.FC<CreateListFormProps> = ({ onCreate }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTitle.trim()) {
            onCreate(newTitle, selectedColor);
            setNewTitle(''); // Reset form
            setIsCreating(false);
        }
    };

    if (isCreating) {
        return (
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-primary animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleCreate}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('dashboard.newListName')}</label>
                    <input
                        autoFocus
                        type="text"
                        placeholder={t('dashboard.newListPlaceholder')}
                        className="w-full text-lg font-medium bg-transparent border-b-2 border-slate-200 dark:border-slate-700 focus:border-primary outline-none px-0 py-2 mb-4 transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('dashboard.colorCode')}</label>
                        <div className="flex gap-2 overflow-x-auto p-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setSelectedColor(c)}
                                    className={`w-8 h-8 rounded-full flex-shrink-0 transition-transform ${selectedColor === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-600' : ''}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            variant="ghost"
                        >
                            {t('dashboard.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={!newTitle.trim()}
                            variant="primary"
                        >
                            {t('dashboard.createList')}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <button onClick={(e) => { e.stopPropagation(); setIsCreating(true); }} className="bg-indigo-50/80 dark:bg-slate-900/50 border-2 border-dashed border-indigo-200 dark:border-indigo-900 rounded-2xl p-6 flex flex-col items-center justify-center text-indigo-500 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group h-32 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <Plus size={24} />
            </div>
            <span className="font-medium">{t('dashboard.createNewList')}</span>
        </button>
    );
};

