import React, { useState } from 'react';
import { ShoppingItem } from '../../types';
import { Language } from '../../utils/i18n';
import { translate } from '../../utils/i18n';

interface TotalCostSummaryProps {
    items: ShoppingItem[];
    language?: Language;
}

/**
 * TotalCostSummary Component
 * Compact oval badge in bottom-left with expandable details
 */
export const TotalCostSummary: React.FC<TotalCostSummaryProps> = ({
    items,
    language = 'en',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Separate active and completed items with prices
    const activeItemsWithPrice = items.filter(item => !item.isCompleted && item.price !== undefined && item.price > 0);
    const completedItemsWithPrice = items.filter(item => item.isCompleted && item.price !== undefined && item.price > 0);

    const activeTotal = activeItemsWithPrice.reduce((sum, item) => sum + (item.price || 0), 0);
    const spentTotal = completedItemsWithPrice.reduce((sum, item) => sum + (item.price || 0), 0);
    const grandTotal = activeTotal + spentTotal;

    // Don't show if no items have prices or if remaining balance is 0
    const totalItemsWithPrice = activeItemsWithPrice.length + completedItemsWithPrice.length;
    if (totalItemsWithPrice === 0 || activeTotal === 0) {
        return null;
    }

    return (
        <>
            {/* Compact Oval Badge - Bottom Left */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="fixed bottom-20 left-6 z-30 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full px-4 py-2 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 font-bold"
            >
                <span className="text-sm">₺{activeTotal.toFixed(0)}</span>
            </button>

            {/* Expanded Details Panel */}
            {isExpanded && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setIsExpanded(false)}
                    />

                    {/* Details Panel */}
                    <div className="fixed bottom-20 left-6 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-80 p-4">
                        {/* Total Cost */}
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                {translate('shoppingList.totalCost')}
                            </span>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                ₺{grandTotal.toFixed(2)}
                            </span>
                        </div>

                        {/* Spent Total */}
                        {spentTotal > 0 && (
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {translate('shoppingList.spentCost')}
                                </span>
                                <span className="text-xl font-bold text-red-600 dark:text-red-500">
                                    ₺{spentTotal.toFixed(2)}
                                </span>
                            </div>
                        )}

                        {/* Remaining Total */}
                        {activeTotal > 0 && (
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {translate('shoppingList.remainingCost')}
                                </span>
                                <span className="text-xl font-bold text-green-600 dark:text-green-500">
                                    ₺{activeTotal.toFixed(2)}
                                </span>
                            </div>
                        )}

                        {/* Items Count */}
                        <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-200 dark:border-slate-700">
                            {translate('shoppingList.itemsWithPrice')
                                .replace('{priced}', totalItemsWithPrice.toString())
                                .replace('{total}', items.length.toString())}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
