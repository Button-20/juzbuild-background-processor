export interface LocationInfo {
    country: string;
    countryCode: string;
    currency: string;
    currencySymbol: string;
    timezone?: string;
}
export interface CurrencyConfig {
    code: string;
    symbol: string;
    name: string;
    exchangeRate: number;
}
export declare const CURRENCIES: Record<string, CurrencyConfig>;
/**
 * Detect user location from IP using ipapi.co (free service)
 */
export declare function detectLocationFromIP(ipAddress: string): Promise<LocationInfo | null>;
/**
 * Get location from request headers (Cloudflare, Vercel, etc.)
 */
export declare function getLocationFromHeaders(headers: Headers): LocationInfo | null;
/**
 * Get default location (Ghana)
 */
export declare function getDefaultLocation(): LocationInfo;
/**
 * Convert price from base currency (GHS) to target currency
 */
export declare function convertPrice(priceInGHS: number, targetCurrency: string): number;
/**
 * Format price with currency symbol and proper formatting
 */
export declare function formatPriceWithCurrency(price: number, currency?: string): string;
/**
 * Get user location with fallback strategy
 */
export declare function getUserLocation(request: Request): Promise<LocationInfo>;
/**
 * Get currency info for display
 */
export declare function getCurrencyInfo(currencyCode: string): CurrencyConfig | null;
/**
 * Get all supported currencies
 */
export declare function getSupportedCurrencies(): CurrencyConfig[];
//# sourceMappingURL=location-currency.d.ts.map