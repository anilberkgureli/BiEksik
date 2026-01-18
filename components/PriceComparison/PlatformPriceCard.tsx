import React from 'react';
import type { PlatformPrice } from '../../src/domain/entities/PlatformPrice';
import { TrendingDown, TrendingUp, Package, ExternalLink } from 'lucide-react';
import './styles.css';

interface PlatformPriceCardProps {
    platform: PlatformPrice;
    isCheapest: boolean;
}

export const PlatformPriceCard: React.FC<PlatformPriceCardProps> = ({ platform, isCheapest }) => {
    const availableItems = platform.getAvailableItemsCount();
    const unavailableItems = platform.getUnavailableItemsCount();

    return (
        <div className={`platform-price-card ${isCheapest ? 'cheapest' : ''}`}>
            <div className="platform-header">
                <div className="platform-name-container">
                    <Package size={20} />
                    <h3>{platform.platformName}</h3>
                    {isCheapest && (
                        <span className="cheapest-badge">
                            <TrendingDown size={16} />
                            En Ucuz
                        </span>
                    )}
                </div>
                <div className="platform-price">
                    <span className="price-amount">₺{platform.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="platform-stats">
                <span className="stat available">
                    {availableItems} ürün mevcut
                </span>
                {unavailableItems > 0 && (
                    <span className="stat unavailable">
                        {unavailableItems} ürün yok
                    </span>
                )}
            </div>

            <div className="items-list">
                {platform.items.map((item, index) => (
                    <div key={index} className={`item ${!item.available ? 'unavailable' : ''}`}>
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">
                            {item.available && item.price !== null ? (
                                `₺${item.price.toFixed(2)}`
                            ) : (
                                <span className="not-available">Mevcut değil</span>
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {platform.errorMessage && (
                <div className="error-message">
                    <TrendingUp size={16} />
                    {platform.errorMessage}
                </div>
            )}
        </div>
    );
};

