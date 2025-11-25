"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Card_1 = __importDefault(require("@/components/Home/Properties/Card/Card"));
const react_1 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const react_2 = require("react");
const PropertyTypePage = () => {
    const { type } = (0, navigation_1.useParams)();
    const [properties, setProperties] = (0, react_2.useState)([]);
    const [propertyType, setPropertyType] = (0, react_2.useState)(null);
    const [allPropertyTypes, setAllPropertyTypes] = (0, react_2.useState)([]);
    const [initialLoading, setInitialLoading] = (0, react_2.useState)(true);
    const [searchLoading, setSearchLoading] = (0, react_2.useState)(false);
    const [error, setError] = (0, react_2.useState)(null);
    const [filters, setFilters] = (0, react_2.useState)({
        search: "",
        status: "",
        featured: false,
    });
    // Debounce search function
    const debounce = (0, react_2.useCallback)((func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }, []);
    const fetchProperties = (0, react_2.useCallback)(async (isInitial = false, searchFilters = filters) => {
        try {
            if (isInitial) {
                setInitialLoading(true);
            }
            else {
                setSearchLoading(true);
            }
            const params = new URLSearchParams();
            params.append("type", type);
            if (searchFilters.search)
                params.append("search", searchFilters.search);
            if (searchFilters.status)
                params.append("status", searchFilters.status);
            if (searchFilters.featured)
                params.append("featured", "true");
            const response = await fetch(`/api/properties?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }
            const data = await response.json();
            setProperties(data);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
        finally {
            if (isInitial) {
                setInitialLoading(false);
            }
            else {
                setSearchLoading(false);
            }
        }
    }, [type, filters]);
    const fetchPropertyType = (0, react_2.useCallback)(async () => {
        try {
            const response = await fetch("/api/property-types");
            if (response.ok) {
                const data = await response.json();
                setAllPropertyTypes(data.propertyTypes);
                const foundType = data.propertyTypes.find((pt) => pt.slug === type);
                setPropertyType(foundType || null);
            }
        }
        catch (error) {
            console.error("Error fetching property type:", error);
        }
    }, [type]);
    // Debounced fetch for search
    const debouncedFetch = (0, react_2.useCallback)(debounce((searchFilters) => fetchProperties(false, searchFilters), 500), [fetchProperties]);
    // Initial load
    (0, react_2.useEffect)(() => {
        fetchProperties(true);
        fetchPropertyType();
    }, [fetchProperties, fetchPropertyType]);
    // Handle filter changes
    (0, react_2.useEffect)(() => {
        if (!initialLoading) {
            if (filters.search) {
                // For search, use debounced fetch
                debouncedFetch(filters);
            }
            else {
                // For other filters, fetch immediately
                fetchProperties(false, filters);
            }
        }
    }, [filters, initialLoading, debouncedFetch, fetchProperties]);
    const handleSearchChange = (e) => {
        setFilters((prev) => ({ ...prev, search: e.target.value }));
    };
    const handleStatusChange = (e) => {
        setFilters((prev) => ({ ...prev, status: e.target.value }));
    };
    const handleFeaturedChange = (e) => {
        setFilters((prev) => ({ ...prev, featured: e.target.checked }));
    };
    const capitalizeFirst = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    if (initialLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "!pt-44 pb-20", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto max-w-8xl px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-16", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-500 dark:text-gray-400", children: ["Loading ", capitalizeFirst(type), " properties..."] })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)("section", { className: "!pt-44 pb-20", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto max-w-8xl px-5 2xl:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl md:text-44 lg:text-52 font-semibold text-dark dark:text-white mb-3 sm:mb-4 leading-tight", children: [propertyType?.name || capitalizeFirst(type), " Properties"] }), propertyType?.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-dark/50 dark:text-white/50 text-base sm:text-lg max-w-3xl mx-auto px-2 sm:px-0", children: propertyType.description })), properties.length > 0 && ((0, jsx_runtime_1.jsxs)("p", { className: "text-primary text-sm sm:text-base mt-3 sm:mt-4 font-medium", children: [properties.length, " ", properties.length === 1 ? "property" : "properties", " found"] }))] }), allPropertyTypes.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-dark dark:text-white mb-4", children: "Browse by Property Type" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-3", children: allPropertyTypes.map((propType) => ((0, jsx_runtime_1.jsxs)(link_1.default, { href: `/properties/${propType.slug}`, className: `px-4 py-2 rounded-full text-sm font-medium transition-colors ${propType.slug === type
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`, children: [propType.name, propType.propertyCount !== undefined && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-1 opacity-75", children: ["(", propType.propertyCount, ")"] }))] }, propType._id))) })] })), (0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search properties...", value: filters.search, onChange: handleSearchChange, className: "w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary" }), (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:magnifying-glass", className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), searchLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-4 top-1/2 transform -translate-y-1/2", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-primary" }) }))] }), (0, jsx_runtime_1.jsxs)("select", { value: filters.status, onChange: handleStatusChange, className: "px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Status" }), (0, jsx_runtime_1.jsx)("option", { value: "for-sale", children: "For Sale" }), (0, jsx_runtime_1.jsx)("option", { value: "for-rent", children: "For Rent" }), (0, jsx_runtime_1.jsx)("option", { value: "sold", children: "Sold" }), (0, jsx_runtime_1.jsx)("option", { value: "rented", children: "Rented" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.featured, onChange: handleFeaturedChange, className: "text-primary focus:ring-primary" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-dark dark:text-white", children: "Featured Only" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setFilters({ search: "", status: "", featured: false }), className: "px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-600 text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors", children: "Clear Filters" })] }) }), error && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-16", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:warning-circle", className: "text-6xl text-red-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-red-500 mb-4", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => fetchProperties(true), className: "px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors", children: "Try Again" })] })), !error && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: properties.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: properties.map((property) => ((0, jsx_runtime_1.jsx)(Card_1.default, { item: property }, property._id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-16", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house", className: "text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-semibold text-dark dark:text-white mb-2", children: ["No ", capitalizeFirst(type), " Properties Found"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 dark:text-gray-400 mb-6", children: filters.search || filters.status || filters.featured
                                    ? "Try adjusting your filters to see more results."
                                    : `We don't have any ${type} properties available at the moment.` }), (filters.search || filters.status || filters.featured) && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setFilters({ search: "", status: "", featured: false }), className: "px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors", children: "Clear Filters" }))] })) }))] }) }));
};
exports.default = PropertyTypePage;
//# sourceMappingURL=page.js.map