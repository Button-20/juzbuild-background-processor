"use strict";
// Location Detection and Currency Conversion Utilities
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENCIES = void 0;
exports.detectLocationFromIP = detectLocationFromIP;
exports.getLocationFromHeaders = getLocationFromHeaders;
exports.getDefaultLocation = getDefaultLocation;
exports.convertPrice = convertPrice;
exports.formatPriceWithCurrency = formatPriceWithCurrency;
exports.getUserLocation = getUserLocation;
exports.getCurrencyInfo = getCurrencyInfo;
exports.getSupportedCurrencies = getSupportedCurrencies;
// Currency configurations with exchange rates
exports.CURRENCIES = {
    GHS: {
        code: "GHS",
        symbol: "₵",
        name: "Ghanaian Cedi",
        exchangeRate: 0.082, // 1 GHS = 0.082 USD
    },
    USD: {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
        exchangeRate: 1.0,
    },
    EUR: {
        code: "EUR",
        symbol: "€",
        name: "Euro",
        exchangeRate: 1.1,
    },
    GBP: {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        exchangeRate: 1.27,
    },
    NGN: {
        code: "NGN",
        symbol: "₦",
        name: "Nigerian Naira",
        exchangeRate: 0.0012,
    },
};
// Country to currency mapping
const COUNTRY_CURRENCY_MAP = {
    GH: "GHS", // Ghana
    US: "USD", // United States
    GB: "GBP", // United Kingdom
    UK: "GBP", // United Kingdom alternative
    NG: "NGN", // Nigeria
    DE: "EUR", // Germany
    FR: "EUR", // France
    ES: "EUR", // Spain
    IT: "EUR", // Italy
    NL: "EUR", // Netherlands
};
/**
 * Detect user location from IP using ipapi.co (free service)
 */
async function detectLocationFromIP(ipAddress) {
    try {
        // Skip for local/unknown IPs
        if (!ipAddress ||
            ipAddress === "unknown" ||
            ipAddress.startsWith("127.") ||
            ipAddress.startsWith("192.168.")) {
            return getDefaultLocation();
        }
        const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
            headers: {
                "User-Agent": "RealEstateApp/1.0",
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (!response.ok) {
            console.warn("IP geolocation API failed:", response.status);
            return getDefaultLocation();
        }
        const data = await response.json();
        if (data.error) {
            console.warn("IP geolocation error:", data.reason);
            return getDefaultLocation();
        }
        const countryCode = data.country_code || "GH";
        const currency = COUNTRY_CURRENCY_MAP[countryCode] || "GHS";
        const currencyConfig = exports.CURRENCIES[currency];
        return {
            country: data.country_name || "Ghana",
            countryCode: countryCode,
            currency: currency,
            currencySymbol: currencyConfig.symbol,
            timezone: data.timezone,
        };
    }
    catch (error) {
        console.error("Error detecting location:", error);
        return getDefaultLocation();
    }
}
/**
 * Get location from request headers (Cloudflare, Vercel, etc.)
 */
function getLocationFromHeaders(headers) {
    // Try Cloudflare headers
    const cfCountry = headers.get("cf-ipcountry");
    if (cfCountry && cfCountry !== "XX") {
        const currency = COUNTRY_CURRENCY_MAP[cfCountry] || "GHS";
        const currencyConfig = exports.CURRENCIES[currency];
        return {
            country: cfCountry,
            countryCode: cfCountry,
            currency: currency,
            currencySymbol: currencyConfig.symbol,
        };
    }
    // Try Vercel headers
    const vercelCountry = headers.get("x-vercel-ip-country");
    if (vercelCountry) {
        const currency = COUNTRY_CURRENCY_MAP[vercelCountry] || "GHS";
        const currencyConfig = exports.CURRENCIES[currency];
        return {
            country: vercelCountry,
            countryCode: vercelCountry,
            currency: currency,
            currencySymbol: currencyConfig.symbol,
        };
    }
    return null;
}
/**
 * Get default location (Ghana)
 */
function getDefaultLocation() {
    return {
        country: "Ghana",
        countryCode: "GH",
        currency: "GHS",
        currencySymbol: "₵",
        timezone: "Africa/Accra",
    };
}
/**
 * Convert price from base currency (GHS) to target currency
 */
function convertPrice(priceInGHS, targetCurrency) {
    if (targetCurrency === "GHS") {
        return priceInGHS;
    }
    const ghsConfig = exports.CURRENCIES["GHS"];
    const targetConfig = exports.CURRENCIES[targetCurrency];
    if (!targetConfig) {
        return priceInGHS; // Return original if currency not supported
    }
    // Convert GHS -> USD -> Target Currency
    const priceInUSD = priceInGHS * ghsConfig.exchangeRate;
    const convertedPrice = priceInUSD / targetConfig.exchangeRate;
    return Math.round(convertedPrice);
}
/**
 * Format price with currency symbol and proper formatting
 */
function formatPriceWithCurrency(price, currency = "GHS") {
    const currencyConfig = exports.CURRENCIES[currency];
    if (!currencyConfig) {
        return `GHS ${price.toLocaleString()}`;
    }
    const formattedNumber = price.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    // For some currencies, symbol goes after (like USD, GBP, EUR)
    if (currency === "GHS" || currency === "NGN") {
        return `${currencyConfig.symbol} ${formattedNumber}`;
    }
    return `${currencyConfig.symbol}${formattedNumber}`;
}
/**
 * Get user location with fallback strategy
 */
async function getUserLocation(request) {
    const headers = new Headers(request.headers);
    // Try headers first (fastest)
    const headerLocation = getLocationFromHeaders(headers);
    if (headerLocation) {
        return headerLocation;
    }
    // Try IP detection
    const forwarded = headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : null;
    if (ip) {
        const ipLocation = await detectLocationFromIP(ip);
        if (ipLocation) {
            return ipLocation;
        }
    }
    // Fallback to default
    return getDefaultLocation();
}
/**
 * Get currency info for display
 */
function getCurrencyInfo(currencyCode) {
    return exports.CURRENCIES[currencyCode] || null;
}
/**
 * Get all supported currencies
 */
function getSupportedCurrencies() {
    return Object.values(exports.CURRENCIES);
}
//# sourceMappingURL=location-currency.js.map