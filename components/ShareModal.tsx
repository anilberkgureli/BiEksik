import React from 'react';
import { X, Copy, Share2 } from 'lucide-react';
import { config, ShareOption } from '../config';
import { translate } from '../utils/i18n';
import { useToast } from '../src/application/contexts/ToastContext';
import { ShoppingList } from '../src/domain/entities/ShoppingList';
import { Share } from '@capacitor/share';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    list: ShoppingList;
}

// Icon mapping for lucide-react
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Copy,
    Share2,
    X
};

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, list }) => {
    const { showSuccess, showError, showInfo } = useToast();

    if (!isOpen) return null;

    // Format shopping list as shareable text
    const formatListAsText = (): string => {
        const title = `📝 ${list.title}\n`;
        const divider = '─'.repeat(30) + '\n';

        const activeItems = list.items
            .filter(item => !item.isCompleted)
            .map(item => {
                const quantity = item.quantity ? ` (${item.quantity})` : '';
                return `☐ ${item.name}${quantity}`;
            })
            .join('\n');

        const completedItems = list.items
            .filter(item => item.isCompleted)
            .map(item => {
                const quantity = item.quantity ? ` (${item.quantity})` : '';
                return `☑ ${item.name}${quantity}`;
            })
            .join('\n');

        let text = title + divider;
        if (activeItems) text += activeItems + '\n';
        if (completedItems) text += '\n' + completedItems;

        return text;
    };

    const handleShareOption = async (option: ShareOption) => {
        const shareText = formatListAsText();

        if (option.action === 'copy') {
            // Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareText);
                showSuccess(translate('share.copied'));
                onClose();
            } catch (err) {
                showError(translate('common.error'));
            }
        } else if (option.action === 'native-share') {
            // Native share using Capacitor Share API
            try {
                await Share.share({
                    title: list.title,
                    text: shareText,
                    dialogTitle: translate('share.title')
                });
                onClose();
            } catch (err: any) {
                // User cancelled or share not supported
                if (err?.message !== 'Share canceled') {
                    showInfo(translate('share.shareNotSupported'));
                }
            }
        } else if (option.getUrl) {
            // Fallback: Open URL for sharing (legacy support)
            const url = option.getUrl(shareText);
            window.open(url, '_blank');
            onClose();
        }
    };

    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName] || Share2;
        return IconComponent;
    };

    const enabledOptions = config.shareOptions.filter(opt => opt.enabled);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 dark:border-slate-800"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {translate('share.title')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {translate('share.description')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Share Options Grid */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                    {enabledOptions.map(option => {
                        const Icon = getIcon(option.icon);
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleShareOption(option)}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                                    <Icon size={24} className="text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {translate(`share.${option.id}`)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
