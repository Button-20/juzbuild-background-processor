"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertyCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const currency_1 = require("@/lib/currency");
const react_1 = require("@iconify/react");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
function PropertyCard({ property }) {
    const mainImage = property.images.find((img) => img.isMain) || property.images[0];
    const getStatusColor = (status) => {
        switch (status) {
            case "for-sale":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "for-rent":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "sold":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
            case "rented":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group", children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: `/properties/${typeof property.propertyType === "object"
                ? property.propertyType?.slug
                : property.propertyType || "property"}/${property.slug}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [mainImage && ((0, jsx_runtime_1.jsx)(image_1.default, { src: mainImage.src, alt: mainImage.alt || property.name, width: 400, height: 250, className: "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300", unoptimized: true })), (0, jsx_runtime_1.jsxs)("div", { className: "absolute top-3 left-3 flex gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`, children: property.status?.replace("-", " ") || "Available" }), property.isFeatured && ((0, jsx_runtime_1.jsx)("span", { className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-semibold", children: "Featured" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-3 right-3", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:heart", className: "w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer" }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-dark dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-1", children: property.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:map-pin", className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "line-clamp-1", children: property.location })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-3", children: (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-primary", children: property.price
                                    ? (0, currency_1.formatCurrencyLegacy)(property.price, property.currency || "GHS")
                                    : "Price on request" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between text-sm text-gray-600 dark:text-gray-400", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:bed-linear", className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: property.beds })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:bath-linear", className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: property.baths })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "lineicons:arrow-all-direction", className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [property.area, "m\u00B2"] })] })] }) })] })] }) }));
}
//# sourceMappingURL=PropertyCard.js.map