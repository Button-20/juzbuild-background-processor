"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Card_1 = __importDefault(require("@/components/Home/Properties/Card/Card"));
const react_1 = require("react");
const PropertiesListing = () => {
    const [properties, setProperties] = (0, react_1.useState)([]);
    const [initialLoading, setInitialLoading] = (0, react_1.useState)(true);
    const [searchLoading, setSearchLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [filters, setFilters] = (0, react_1.useState)({
        search: "",
        propertyType: "",
        status: "",
        featured: false,
    });
    // Debounce search function
    const debounce = (0, react_1.useCallback)((func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }, []);
    const fetchProperties = (0, react_1.useCallback)(async (isInitial = false, searchFilters = filters) => {
        try {
            if (isInitial) {
                setInitialLoading(true);
            }
            else {
                setSearchLoading(true);
            }
            const params = new URLSearchParams();
            if (searchFilters.search)
                params.append("search", searchFilters.search);
            if (searchFilters.propertyType)
                params.append("type", searchFilters.propertyType);
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
    }, []);
    // Debounced fetch for search
    const debouncedFetch = (0, react_1.useCallback)(debounce((searchFilters) => fetchProperties(false, searchFilters), 500), [fetchProperties]);
    // Initial load
    (0, react_1.useEffect)(() => {
        fetchProperties(true);
    }, []);
    // Handle filter changes
    (0, react_1.useEffect)(() => {
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
    }, [filters, initialLoading]);
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    const clearFilters = () => {
        setFilters({
            search: "",
            propertyType: "",
            status: "",
            featured: false,
        });
    };
    if (initialLoading) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "pt-0!", children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10", children: Array.from({ length: 6 }).map((_, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gray-200 dark:bg-gray-700 h-64 rounded-t-2xl" }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-2xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" })] })] })] }, index))) }) }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "pt-0!", children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-red-500 mb-4", children: (0, jsx_runtime_1.jsx)("svg", { className: "mx-auto h-12 w-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "Error Loading Properties" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 dark:text-gray-400 mb-4", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Try Again" })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)("section", { className: "pt-0!", children: (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Search Properties" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: filters.search, onChange: (e) => handleFilterChange("search", e.target.value), className: "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "Search by name or location..." }), searchLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2", children: (0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin h-5 w-5 text-gray-400", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) }))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Property Type" }), (0, jsx_runtime_1.jsxs)("select", { value: filters.propertyType, onChange: (e) => handleFilterChange("propertyType", e.target.value), className: "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "apartment", children: "Apartment" }), (0, jsx_runtime_1.jsx)("option", { value: "villa", children: "Villa" }), (0, jsx_runtime_1.jsx)("option", { value: "office", children: "Office" }), (0, jsx_runtime_1.jsx)("option", { value: "commercial", children: "Commercial" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Status" }), (0, jsx_runtime_1.jsxs)("select", { value: filters.status, onChange: (e) => handleFilterChange("status", e.target.value), className: "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Status" }), (0, jsx_runtime_1.jsx)("option", { value: "for-sale", children: "For Sale" }), (0, jsx_runtime_1.jsx)("option", { value: "for-rent", children: "For Rent" }), (0, jsx_runtime_1.jsx)("option", { value: "sold", children: "Sold" }), (0, jsx_runtime_1.jsx)("option", { value: "rented", children: "Rented" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-full", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center mb-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.featured, onChange: (e) => handleFilterChange("featured", e.target.checked), className: "rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-sm text-gray-700 dark:text-gray-300", children: "Featured Only" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: clearFilters, className: "w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors", children: "Clear Filters" })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: searchLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin h-4 w-4 text-gray-400", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Searching properties..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [properties.length, " ", properties.length === 1 ? "property" : "properties", " found"] })) })] }), properties.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 mb-4", children: (0, jsx_runtime_1.jsx)("svg", { className: "mx-auto h-12 w-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M7 21h2m-2 0H3m2-18v18M9 9h6v6H9V9z" }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No Properties Found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 dark:text-gray-400 mb-4", children: "Try adjusting your search criteria or clear all filters." }), (0, jsx_runtime_1.jsx)("button", { onClick: clearFilters, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Show All Properties" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10", children: properties.map((item) => ((0, jsx_runtime_1.jsx)("div", { className: "", children: (0, jsx_runtime_1.jsx)(Card_1.default, { item: item }) }, item._id || item.slug))) }))] }) }));
};
exports.default = PropertiesListing;
//# sourceMappingURL=index.js.map