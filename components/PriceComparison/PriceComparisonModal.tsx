import React from 'react';
import { usePriceComparison } from '../../src/application/contexts/PriceComparisonContext';
import { PlatformPriceCard } from './PlatformPriceCard';
import { X, TrendingDown, AlertCircle, Loader } from 'lucide-react';
import './styles.css';

interface PriceComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PriceComparisonModal: React.FC<PriceComparisonModalProps> = ({ isOpen, onClose }) => {
    const { comparison, isLoading, error } = usePriceComparison();

    if (!isOpen) return null;

    const cheapestPlatform = comparison?.getCheapestPlatform();
    const priceDifference = comparison?.getPriceDifference() || 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content price-comparison-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Fiyat Karşılaştırma</h2>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {isLoading && (
                        <div className="loading-state">
                            <Loader className="spinner" size={48} />
                            <p>Fiyatlar karşılaştırılıyor...</p>
                            <p className="loading-subtext">Platformlar taranıyor</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-state">
                            <AlertCircle size={48} />
                            <h3>Bir hata oluştu</h3>
                            <p>{error}</p>
                            <button className="retry-button" onClick={onClose}>
                                Kapat
                            </button>
                        </div>
                    )}

                    {comparison && !isLoading && !error && (
                        <>
                            {cheapestPlatform && priceDifference > 0 && (
                                <div className="savings-banner">
                                    <TrendingDown size={24} />
                                    <div>
                                        <strong>{cheapestPlatform.platformName}</strong> ile{' '}
                                        <strong>₺{priceDifference.toFixed(2)}</strong> tasarruf edebilirsiniz!
                                    </div>
                                </div>
                            )}

                            <div className="platforms-grid">
                                {comparison.getPlatformsSortedByPrice().map((platform, index) => (
                                    <PlatformPriceCard
                                        key={platform.platformName}
                                        platform={platform}
                                        isCheapest={index === 0 && platform.available}
                                    />
                                ))}
                            </div>

                            <div className="comparison-footer">
                                <p className="comparison-info">
                                    {comparison.platformsChecked} platform kontrol edildi,{' '}
                                    {comparison.platformsAvailable} platform mevcut
                                </p>
                                <p className="comparison-timestamp">
                                    {new Date(comparison.comparedAt).toLocaleString('tr-TR')}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

