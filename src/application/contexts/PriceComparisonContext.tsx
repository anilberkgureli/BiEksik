import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PriceComparison } from '../../domain/entities/PriceComparison';
import type { ShoppingList } from '../../domain/entities/ShoppingList';
import { ComparePricesUseCase } from '../../domain/usecases/ComparePricesUseCase';
import { PriceComparisonApiService } from '../../infrastructure/api/PriceComparisonApiService';

interface PriceComparisonContextType {
    comparison: PriceComparison | null;
    isLoading: boolean;
    error: string | null;
    comparePrices: (shoppingList: ShoppingList) => Promise<void>;
    clearComparison: () => void;
}

const PriceComparisonContext = createContext<PriceComparisonContextType | undefined>(undefined);

export const PriceComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [comparison, setComparison] = useState<PriceComparison | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize use case with API service
    const useCase = new ComparePricesUseCase(new PriceComparisonApiService());

    const comparePrices = useCallback(async (shoppingList: ShoppingList) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await useCase.execute(shoppingList);
            setComparison(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to compare prices';
            setError(errorMessage);
            console.error('Price comparison error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearComparison = useCallback(() => {
        setComparison(null);
        setError(null);
    }, []);

    return (
        <PriceComparisonContext.Provider
            value={{
                comparison,
                isLoading,
                error,
                comparePrices,
                clearComparison,
            }}
        >
            {children}
        </PriceComparisonContext.Provider>
    );
};

export const usePriceComparison = (): PriceComparisonContextType => {
    const context = useContext(PriceComparisonContext);
    if (!context) {
        throw new Error('usePriceComparison must be used within PriceComparisonProvider');
    }
    return context;
};
