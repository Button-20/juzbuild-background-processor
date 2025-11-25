"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const blogCard_1 = __importDefault(require("@/components/shared/Blog/blogCard"));
const react_1 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const react_2 = __importStar(require("react"));
const BlogSmall = () => {
    const [posts, setPosts] = (0, react_2.useState)([]);
    const [loading, setLoading] = (0, react_2.useState)(true);
    (0, react_2.useEffect)(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("/api/blogs?limit=3");
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.blogs || []);
                }
                else {
                    console.error("Failed to fetch blogs");
                }
            }
            catch (error) {
                console.error("Error fetching blogs:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "py-12 sm:py-16 lg:py-20", children: (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-4 sm:px-5 2xl:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between md:items-end items-start mb-8 sm:mb-10 lg:mb-12 md:flex-row flex-col gap-4 sm:gap-6 md:gap-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-dark/75 dark:text-white/75 text-sm sm:text-base font-semibold flex gap-2 mb-3 sm:mb-4", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", className: "text-xl sm:text-2xl text-primary", "aria-label": "Home icon" }), "Blog"] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl sm:text-3xl lg:text-40 xl:text-52 font-medium dark:text-white mb-2 sm:mb-3", children: "Real estate insights" }), (0, jsx_runtime_1.jsx)("p", { className: "text-dark/50 dark:text-white/50 text-sm sm:text-base leading-relaxed", children: "Stay ahead in the property market with expert advice and updates" })] }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/blogs", className: "bg-dark dark:bg-white text-white dark:text-dark py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-primary dark:hover:bg-primary duration-300 text-sm sm:text-base font-medium whitespace-nowrap self-start md:self-auto", "aria-label": "Read all blog articles", children: "Read all articles" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12", children: [1, 2, 3].map((i) => ((0, jsx_runtime_1.jsx)("div", { className: "w-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden h-full animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-48 sm:h-52 lg:h-48 bg-gray-300 dark:bg-gray-600" }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 sm:p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3 sm:mb-4 w-3/4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 sm:h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-full" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" })] })] }) }, i))) })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("section", { className: "py-12 sm:py-16 lg:py-20", children: (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-4 sm:px-5 2xl:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between md:items-end items-start mb-8 sm:mb-10 lg:mb-12 md:flex-row flex-col gap-4 sm:gap-6 md:gap-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-dark/75 dark:text-white/75 text-sm sm:text-base font-semibold flex gap-2 mb-3 sm:mb-4", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", className: "text-xl sm:text-2xl text-primary", "aria-label": "Home icon" }), "Blog"] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl sm:text-3xl lg:text-40 xl:text-52 font-medium dark:text-white mb-2 sm:mb-3", children: "Real estate insights" }), (0, jsx_runtime_1.jsx)("p", { className: "text-dark/50 dark:text-white/50 text-sm sm:text-base leading-relaxed", children: "Stay ahead in the property market with expert advice and updates" })] }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/blogs", className: "bg-dark dark:bg-white text-white dark:text-dark py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-primary dark:hover:bg-primary duration-300 text-sm sm:text-base font-medium whitespace-nowrap self-start md:self-auto", "aria-label": "Read all blog articles", children: "Read all articles" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12", children: posts.map((blog, i) => ((0, jsx_runtime_1.jsx)("div", { className: "w-full", children: (0, jsx_runtime_1.jsx)(blogCard_1.default, { blog: blog }) }, i))) })] }) }));
};
exports.default = BlogSmall;
//# sourceMappingURL=index.js.map