"use strict";
// Currency configuration and formatting utilities
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatConvertedCurrency = exports.convertCurrency = exports.getCurrencySymbol = exports.formatCurrencyLegacy = exports.formatCurrency = exports.CURRENCY_OPTIONS = exports.DEFAULT_CURRENCY = void 0;
// Default currency configuration - Change this to switch currencies globally
exports.DEFAULT_CURRENCY = {
    code: "GHS",
    symbol: "₵",
    name: "Ghana Cedi",
    locale: "en-GH",
};
// Alternative currency configurations for easy switching
exports.CURRENCY_OPTIONS = {
    GHS: {
        code: "GHS",
        symbol: "₵",
        name: "Ghana Cedi",
        locale: "en-GH",
    },
    USD: {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
        locale: "en-US",
    },
    EUR: {
        code: "EUR",
        symbol: "€",
        name: "Euro",
        locale: "en-EU",
    },
    GBP: {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        locale: "en-GB",
    },
    NGN: {
        code: "NGN",
        symbol: "₦",
        name: "Nigerian Naira",
        locale: "en-NG",
    },
};
/**
 * Format currency amount using the default currency configuration
 * @param amount - The amount to format
 * @param currency - Optional currency config (defaults to DEFAULT_CURRENCY)
 * @param options - Additional formatting options
 */
const formatCurrency = (amount, currency = exports.DEFAULT_CURRENCY, options = {}) => {
    const formatOptions = {
        style: "currency",
        currency: currency.code,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        ...options,
    };
    try {
        return new Intl.NumberFormat(currency.locale, formatOptions).format(amount);
    }
    catch (error) {
        // Fallback formatting if locale is not supported
        return `${currency.symbol}${amount.toLocaleString()}`;
    }
};
exports.formatCurrency = formatCurrency;
/**
 * Format currency with custom symbol (useful for legacy support)
 * @param amount - The amount to format
 * @param currencyCode - The currency code to use for formatting
 */
const formatCurrencyLegacy = (amount, currencyCode) => {
    const currency = currencyCode
        ? exports.CURRENCY_OPTIONS[currencyCode] || exports.DEFAULT_CURRENCY
        : exports.DEFAULT_CURRENCY;
    return (0, exports.formatCurrency)(amount, currency);
};
exports.formatCurrencyLegacy = formatCurrencyLegacy;
/**
 * Get currency symbol
 * @param currencyCode - Optional currency code (defaults to default currency)
 */
const getCurrencySymbol = (currencyCode) => {
    const currency = currencyCode
        ? exports.CURRENCY_OPTIONS[currencyCode] || exports.DEFAULT_CURRENCY
        : exports.DEFAULT_CURRENCY;
    return currency.symbol;
};
exports.getCurrencySymbol = getCurrencySymbol;
/**
 * Convert price to default currency (placeholder for future currency conversion)
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency code
 * @param toCurrency - The target currency code (defaults to default currency)
 */
const convertCurrency = (amount, fromCurrency, toCurrency = exports.DEFAULT_CURRENCY.code) => {
    // TODO: Implement actual currency conversion using exchange rates
    // For now, return the original amount
    if (fromCurrency === toCurrency) {
        return amount;
    }
    // Placeholder conversion rates (replace with real API)
    const conversionRates = {
        USD: {
            GHS: 12.0,
            NGN: 800,
            EUR: 0.85,
            GBP: 0.75,
        },
        GHS: {
            USD: 0.083,
            NGN: 66.67,
            EUR: 0.071,
            GBP: 0.063,
        },
    };
    const rate = conversionRates[fromCurrency]?.[toCurrency] || 1;
    return Math.round(amount * rate);
};
exports.convertCurrency = convertCurrency;
/**
 * Format price with automatic currency conversion
 * @param amount - The original amount
 * @param originalCurrency - The original currency code
 * @param targetCurrency - The target currency (defaults to default currency)
 */
const formatConvertedCurrency = (amount, originalCurrency, targetCurrency) => {
    if (!originalCurrency || originalCurrency === exports.DEFAULT_CURRENCY.code) {
        return (0, exports.formatCurrency)(amount);
    }
    const convertedAmount = (0, exports.convertCurrency)(amount, originalCurrency, targetCurrency);
    return (0, exports.formatCurrency)(convertedAmount);
};
exports.formatConvertedCurrency = formatConvertedCurrency;
//# sourceMappingURL=currency.js.map