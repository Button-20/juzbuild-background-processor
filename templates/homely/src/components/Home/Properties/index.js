"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@iconify/react");
const react_2 = require("react");
const Card_1 = __importDefault(require("./Card/Card"));
const Properties = () => {
    const [properties, setProperties] = (0, react_2.useState)([]);
    const [loading, setLoading] = (0, react_2.useState)(true);
    (0, react_2.useEffect)(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch("/api/properties/homepage?limit=6");
                if (response.ok) {
                    const data = await response.json();
                    setProperties(data.properties);
                }
                else {
                    console.error("Failed to fetch properties");
                }
            }
            catch (error) {
                console.error("Error fetching properties:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "py-12 sm:py-16 lg:py-20", children: (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-4 sm:px-5 2xl:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-12 sm:mb-14 lg:mb-16 flex flex-col gap-3 sm:gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2.5 items-center justify-center", children: [(0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", width: 18, height: 18, className: "text-primary sm:w-5 sm:h-5" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base font-semibold text-dark/75 dark:text-white/75", children: "Properties" })] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl sm:text-3xl lg:text-40 xl:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-tight mb-2 sm:mb-3", children: "Discover inspiring designed homes." }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base font-normal text-black/50 dark:text-white/50 text-center max-w-2xl mx-auto", children: "Curated homes where elegance, style, and comfort unite." })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10", children: [...Array(6)].map((_, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gray-200 dark:bg-gray-700 h-48 sm:h-56 lg:h-64 rounded-t-2xl" }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-dark/10 dark:border-white/10 rounded-b-2xl p-4 sm:p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" }), (0, jsx_runtime_1.jsx)("div", { className: "h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-18" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-14" })] })] })] }, index))) })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("section", { className: "py-12 sm:py-16 lg:py-20", children: (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-4 sm:px-5 2xl:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-12 sm:mb-14 lg:mb-16 flex flex-col gap-3 sm:gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2.5 items-center justify-center", children: [(0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", width: 18, height: 18, className: "text-primary sm:w-5 sm:h-5" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base font-semibold text-dark/75 dark:text-white/75", children: "Properties" })] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl sm:text-3xl lg:text-40 xl:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-tight mb-2 sm:mb-3", children: "Discover inspiring designed homes." }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base font-normal text-black/50 dark:text-white/50 text-center max-w-2xl mx-auto", children: "Curated homes where elegance, style, and comfort unite." })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10", children: properties.length > 0 ? (properties.map((item) => ((0, jsx_runtime_1.jsx)("div", { className: "", children: (0, jsx_runtime_1.jsx)(Card_1.default, { item: item }) }, item._id)))) : ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-full text-center py-12 sm:py-16", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple", className: "text-4xl sm:text-5xl lg:text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-3 sm:mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-base sm:text-lg text-gray-500 dark:text-gray-400", children: "No properties available at the moment." })] })) })] }) }));
};
exports.default = Properties;
//# sourceMappingURL=index.js.map