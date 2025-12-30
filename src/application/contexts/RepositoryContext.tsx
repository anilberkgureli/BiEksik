import React, { createContext, useContext, ReactNode } from 'react';
import { IStorageRepository } from '../../domain/repositories/IStorageRepository';
import { LocalStorageRepository } from '../../infrastructure/storage/LocalStorageRepository';

/**
 * Repository Context
 * Provides dependency injection for repositories
 * Allows switching between LocalStorage and API implementations
 */

interface RepositoryContextType {
    storageRepository: IStorageRepository;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

interface RepositoryProviderProps {
    children: ReactNode;
    storageRepository?: IStorageRepository;
}

/**
 * Repository Provider Component
 * Wraps the app and provides repository instances
 */
export const RepositoryProvider: React.FC<RepositoryProviderProps> = ({
    children,
    storageRepository = new LocalStorageRepository() // Default to LocalStorage
}) => {
    const value: RepositoryContextType = {
        storageRepository,
    };

    return (
        <RepositoryContext.Provider value={value}>
            {children}
        </RepositoryContext.Provider>
    );
};

/**
 * Hook to access the storage repository
 * Throws error if used outside of RepositoryProvider
 */
export const useStorageRepository = (): IStorageRepository => {
    const context = useContext(RepositoryContext);

    if (!context) {
        throw new Error('useStorageRepository must be used within a RepositoryProvider');
    }

    return context.storageRepository;
};
