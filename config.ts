export const config = {
    features: {
        enableDarkMode: true, // Set to false to hide dark mode toggle
        enableCategorization: false, // Set to false to hide categorization option
        enableShareButton: false, // Set to false to hide share button        
        enablePriceComparison: false, // Set to false to hide price comparison modal button
    },
    api: {
        priceComparisonUrl: import.meta.env.VITE_PRICE_API_URL || 'http://localhost:8080/api',
    },
};
