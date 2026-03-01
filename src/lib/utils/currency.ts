export const formatCurrency = (amount: number, currencyCode: string = 'INR', locale: string = 'en-IN') => {
    if (amount === null || amount === undefined || isNaN(amount)) return '';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatCurrencyCompact = (amount: number, currencyCode: string = 'INR', locale: string = 'en-IN') => {
    if (amount === null || amount === undefined || isNaN(amount)) return '';

    if (locale === 'en-IN') {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        notation: "compact",
        maximumFractionDigits: 1
    }).format(amount);
};
