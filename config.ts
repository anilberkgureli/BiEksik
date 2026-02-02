export type ShareOption = {
    id: string;
    enabled: boolean;
    icon: string; // lucide-react icon name
    getUrl?: (text: string) => string;
    action?: 'copy' | 'native-share'; // Special actions
};

export const config = {
    features: {
        enableDarkMode: true, // Set to false to hide dark mode toggle
        enableCategorization: false, // Set to false to hide categorization option
        enableShareButton: true, // Set to false to hide share button        
        enablePriceComparison: false, // Set to false to hide price comparison modal button
    },
    api: {
        priceComparisonUrl: import.meta.env.VITE_PRICE_API_URL || 'http://localhost:8080/api',
    },
    shareOptions: [
        {
            id: 'share',
            enabled: true,
            icon: 'Share2',
            action: 'native-share' as const
        },
        {
            id: 'copy',
            enabled: true,
            icon: 'Copy',
            action: 'copy' as const
        }
    ] as ShareOption[]
};
