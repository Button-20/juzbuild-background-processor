"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const iconify_js_1 = require("@iconify/react/dist/iconify.js");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const react_1 = require("react");
const Services = () => {
    const [propertyTypes, setPropertyTypes] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchPropertyTypes = async () => {
            try {
                const response = await fetch("/api/property-types/public");
                if (response.ok) {
                    const data = await response.json();
                    setPropertyTypes(data.propertyTypes);
                }
                else {
                    console.error("Failed to fetch property types");
                }
            }
            catch (error) {
                console.error("Error fetching property types:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPropertyTypes();
    }, []);
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("section", { className: "relative overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute left-0 top-0", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/categories/Vector.svg", alt: "vector", width: 800, height: 1050, className: "dark:hidden", unoptimized: true }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/categories/Vector-dark.svg", alt: "vector", width: 800, height: 1050, className: "hidden dark:block", unoptimized: true })] }), (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0 relative z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-12 items-center gap-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-6 col-span-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-32" }), (0, jsx_runtime_1.jsx)("div", { className: "h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-20 bg-gray-200 dark:bg-gray-700 rounded mb-8" }), (0, jsx_runtime_1.jsx)("div", { className: "h-12 bg-gray-200 dark:bg-gray-700 rounded w-40" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-6 md:col-span-6 col-span-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 sm:h-80 md:h-96" }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-6 md:col-span-6 col-span-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 sm:h-80 md:h-96" }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-3 md:col-span-6 col-span-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 sm:h-80 md:h-96" }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-3 md:col-span-6 col-span-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 sm:h-80 md:h-96" }) })] }) })] }));
    }
    // Define the grid layout classes for each category
    const getGridClass = (index) => {
        if (index === 0)
            return "lg:col-span-6 md:col-span-6 col-span-12";
        if (index === 1)
            return "lg:col-span-6 md:col-span-6 col-span-12";
        return "lg:col-span-3 md:col-span-6 col-span-12";
    };
    return ((0, jsx_runtime_1.jsxs)("section", { className: "relative overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute left-0 top-0", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/categories/Vector.svg", alt: "vector", width: 800, height: 1050, className: "dark:hidden", unoptimized: true }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/categories/Vector-dark.svg", alt: "vector", width: 800, height: 1050, className: "hidden dark:block", unoptimized: true })] }), (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0 relative z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-12 items-start gap-6 lg:gap-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-6 col-span-12 lg:sticky lg:top-24", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2.5", children: [(0, jsx_runtime_1.jsx)(iconify_js_1.Icon, { icon: "ph:house-simple-fill", className: "text-2xl text-primary " }), "Categories"] }), (0, jsx_runtime_1.jsx)("h2", { className: "lg:text-52 text-32 sm:text-40 mt-4 mb-2 lg:max-w-full font-medium leading-[1.2] text-dark dark:text-white", children: "Explore best properties with expert services." }), (0, jsx_runtime_1.jsx)("p", { className: "text-dark/50 dark:text-white/50 text-base sm:text-lg lg:max-w-full leading-[1.3] md:max-w-3/4", children: "Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/properties", className: "py-3 sm:py-4 px-6 sm:px-8 bg-primary text-sm sm:text-base leading-4 block w-fit text-white rounded-full font-semibold mt-6 sm:mt-8 hover:bg-dark duration-300", children: "View properties" })] }), " ", propertyTypes.length > 0 ? (propertyTypes.map((propertyType, index) => ((0, jsx_runtime_1.jsx)("div", { className: getGridClass(index), children: (0, jsx_runtime_1.jsxs)("div", { className: "relative rounded-2xl overflow-hidden group", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: `/properties/${propertyType.slug}`, children: (0, jsx_runtime_1.jsx)(image_1.default, { src: propertyType.image, alt: propertyType.name, width: index < 2 ? 680 : 320, height: 386, className: "w-full object-cover h-64 sm:h-80 md:h-96", unoptimized: true }) }), (0, jsx_runtime_1.jsxs)(link_1.default, { href: `/properties/${propertyType.slug}`, className: "absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-6 sm:pl-8 md:pl-10 pb-6 sm:pb-8 md:pb-10 pr-4 sm:pr-6 group-hover:top-0 duration-500", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-end mt-4 sm:mt-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white text-dark rounded-full w-fit p-3 sm:p-4", children: (0, jsx_runtime_1.jsx)(iconify_js_1.Icon, { icon: "ph:arrow-right", width: 20, height: 20, className: "sm:w-6 sm:h-6" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white text-lg sm:text-xl md:text-2xl font-medium", children: propertyType.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-sm sm:text-base leading-5 sm:leading-6", children: propertyType.description }), propertyType.propertyCount !== undefined && ((0, jsx_runtime_1.jsxs)("p", { className: "text-white/60 text-xs sm:text-sm", children: [propertyType.propertyCount, " ", propertyType.propertyCount === 1
                                                                ? "property"
                                                                : "properties"] }))] })] })] }) }, propertyType._id)))) : ((0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-6 col-span-12 text-center py-16", children: [(0, jsx_runtime_1.jsx)(iconify_js_1.Icon, { icon: "ph:squares-four", className: "text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-500 dark:text-gray-400", children: "No property types available at the moment." })] }))] }) })] }));
};
exports.default = Services;
//# sourceMappingURL=index.js.map