"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CurrencyBadge;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function CurrencyBadge({ currency, country, className = "", }) {
    const [currencyInfo, setCurrencyInfo] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (currency && country) {
            const flagEmoji = getFlagEmoji(country);
            const symbol = getCurrencySymbol(currency);
            setCurrencyInfo({
                code: currency,
                symbol: symbol,
                flag: flagEmoji,
            });
        }
    }, [currency, country]);
    if (!currencyInfo)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium ${className}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: currencyInfo.flag }), (0, jsx_runtime_1.jsxs)("span", { children: ["Showing prices in ", (0, jsx_runtime_1.jsx)("strong", { children: currencyInfo.code })] })] }));
}
function getFlagEmoji(countryCode) {
    const flags = {
        GH: "🇬🇭",
        US: "🇺🇸",
        GB: "🇬🇧",
        UK: "🇬🇧",
        NG: "🇳🇬",
        DE: "🇩🇪",
        FR: "🇫🇷",
        ES: "🇪🇸",
        IT: "🇮🇹",
        NL: "🇳🇱",
    };
    return flags[countryCode] || "🌍";
}
function getCurrencySymbol(currencyCode) {
    const symbols = {
        GHS: "₵",
        USD: "$",
        EUR: "€",
        GBP: "£",
        NGN: "₦",
    };
    return symbols[currencyCode] || currencyCode;
}
//# sourceMappingURL=CurrencyBadge.js.map