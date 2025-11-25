"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const currency_1 = require("@/lib/currency");
const react_1 = require("@iconify/react");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const react_2 = require("react");
const PropertyCard = ({ item }) => {
    const { name, location, rate, price, currency, beds, baths, area, slug, propertyType, images, } = item;
    const [currentImageIndex, setCurrentImageIndex] = (0, react_2.useState)(0);
    const hasMultipleImages = images && images.length > 1;
    const currentImage = images?.[currentImageIndex]?.src || images?.[0]?.src;
    // Format price - prioritize price with currency formatting for consistency
    const formatPrice = () => {
        // First, try to use price with currency for proper formatting
        if (price && currency) {
            return (0, currency_1.formatCurrencyLegacy)(price, currency);
        }
        // Fallback to rate if no price/currency available
        if (rate) {
            // If rate doesn't have currency symbol, add the default one
            if (typeof rate === "string" &&
                !rate.includes("₵") &&
                !rate.includes("$")) {
                return `₵${rate}`;
            }
            return rate;
        }
        return "Price on request";
    };
    const handleNextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { className: "relative rounded-2xl border border-dark/10 dark:border-white/10 group hover:shadow-3xl duration-300 dark:hover:shadow-white/20", children: [(0, jsx_runtime_1.jsxs)("div", { className: "overflow-hidden rounded-t-2xl", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: `/properties/${propertyType}/${slug}`, children: currentImage && ((0, jsx_runtime_1.jsx)(image_1.default, { src: currentImage, alt: name, width: 440, height: 300, className: "w-full h-48 sm:h-56 lg:h-64 object-cover rounded-t-2xl group-hover:brightness-50 group-hover:scale-125 transition duration-300 delay-75", unoptimized: true })) }), hasMultipleImages && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-4 sm:top-6 right-4 sm:right-6", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleNextImage, className: "cursor-pointer p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full hidden group-hover:flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200", title: `View image ${currentImageIndex + 1} of ${images.length}`, children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:arrow-right-linear", width: 16, height: 16, className: "text-black sm:w-5 sm:h-5" }) }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 sm:p-5 lg:p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 justify-between mb-4 sm:mb-5 lg:mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: `/properties/${propertyType}/${slug}`, children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg sm:text-xl font-medium text-black dark:text-white duration-300 group-hover:text-primary truncate", children: name }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base font-normal text-black/50 dark:text-white/50 truncate", children: location })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 self-start sm:self-center", children: (0, jsx_runtime_1.jsx)("button", { className: "text-sm sm:text-base font-normal text-primary px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full bg-primary/10 whitespace-nowrap", children: formatPrice() }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1.5 sm:gap-2 border-e border-black/10 dark:border-white/20 pr-2 sm:pr-4 lg:pr-6 xl:pr-8 flex-1", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:bed-linear", width: 16, height: 16, className: "sm:w-5 sm:h-5" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs sm:text-sm lg:text-base font-normal text-black dark:text-white", children: [beds, " Bed", beds !== 1 ? "s" : ""] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1.5 sm:gap-2 border-e border-black/10 dark:border-white/20 px-2 sm:px-4 lg:px-6 xl:px-8 flex-1", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:bath-linear", width: 16, height: 16, className: "sm:w-5 sm:h-5" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs sm:text-sm lg:text-base font-normal text-black dark:text-white", children: [baths, " Bath", baths !== 1 ? "s" : ""] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1.5 sm:gap-2 pl-2 sm:pl-4 lg:pl-6 xl:pl-8 flex-1", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "lineicons:arrow-all-direction", width: 16, height: 16, className: "sm:w-5 sm:h-5" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs sm:text-sm lg:text-base font-normal text-black dark:text-white", children: [area, "m", (0, jsx_runtime_1.jsx)("sup", { children: "2" })] })] })] })] })] }) }));
};
exports.default = PropertyCard;
//# sourceMappingURL=Card.js.map