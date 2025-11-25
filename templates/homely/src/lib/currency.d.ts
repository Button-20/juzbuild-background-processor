export interface CurrencyConfig {
    code: string;
    symbol: string;
    name: string;
    locale: string;
}
export declare const DEFAULT_CURRENCY: CurrencyConfig;
export declare const CURRENCY_OPTIONS: Record<string, CurrencyConfig>;
/**
 * Format currency amount using the default currency configuration
 * @param amount - The amount to format
 * @param currency - Optional currency config (defaults to DEFAULT_CURRENCY)
 * @param options - Additional formatting options
 */
export declare const formatCurrency: (amount: number, currency?: CurrencyConfig, options?: Intl.NumberFormatOptions) => string;
/**
 * Format currency with custom symbol (useful for legacy support)
 * @param amount - The amount to format
 * @param currencyCode - The currency code to use for formatting
 */
export declare const formatCurrencyLegacy: (amount: number, currencyCode?: string) => string;
/**
 * Get currency symbol
 * @param currencyCode - Optional currency code (defaults to default currency)
 */
export declare const getCurrencySymbol: (currencyCode?: string) => string;
/**
 * Convert price to default currency (placeholder for future currency conversion)
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency code
 * @param toCurrency - The target currency code (defaults to default currency)
 */
export declare const convertCurrency: (amount: number, fromCurrency: string, toCurrency?: string) => number;
/**
 * Format price with automatic currency conversion
 * @param amount - The original amount
 * @param originalCurrency - The original currency code
 * @param targetCurrency - The target currency (defaults to default currency)
 */
export declare const formatConvertedCurrency: (amount: number, originalCurrency?: string, targetCurrency?: string) => string;
//# sourceMappingURL=currency.d.ts.map