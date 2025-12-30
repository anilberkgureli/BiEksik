import React from 'react';
import { SortAsc, Clock, LayoutGrid, List as ListIcon } from 'lucide-react';
import { FilterChip } from '../ui';
import { t } from '../../utils/i18n';
import { Language } from '../../utils/i18n';
import { config } from '../../config';

type SortOption = 'addedAt' | 'name';

interface FilterBarProps {
    sortBy: SortOption;
    isGrouped: boolean;
    onSortChange: (sort: SortOption) => void;
    onGroupToggle: () => void;
    language?: Language;
}

/**
 * FilterBar Component
 * Displays filter and sort controls for the shopping list
 */
export const FilterBar: React.FC<FilterBarProps> = ({
    sortBy,
    isGrouped,
    onSortChange,
    onGroupToggle,
    language = 'en',
}) => {
    return (
        <div className="px-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {config.features.enableCategorization && (
                <FilterChip
                    label={isGrouped ? t('shoppingList.grouped') : t('shoppingList.listView')}
                    isActive={isGrouped}
                    onClick={onGroupToggle}
                    icon={isGrouped ? <LayoutGrid size={14} /> : <ListIcon size={14} />}
                />
            )}

            <FilterChip
                label="A-Z"
                isActive={sortBy === 'name'}
                onClick={() => onSortChange('name')}
                icon={<SortAsc size={14} />}
            />

            <FilterChip
                label={t('shoppingList.newest')}
                isActive={sortBy === 'addedAt'}
                onClick={() => onSortChange('addedAt')}
                icon={<Clock size={14} />}
            />
        </div>
    );
};
