"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@iconify/react");
const date_fns_1 = require("date-fns");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const BlogCard = ({ blog }) => {
    const { title, coverImage, createdAt, slug, tags, author, authorImage, readTime, excerpt, } = blog;
    // Safe date formatting function
    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                return "Date not available";
            }
            return (0, date_fns_1.format)(date, "MMM dd, yyyy");
        }
        catch (error) {
            return "Date not available";
        }
    };
    return ((0, jsx_runtime_1.jsx)(link_1.default, { href: `/blogs/${slug}`, "aria-label": `Read blog post: ${title}`, className: "group block h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col", children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-hidden rounded-t-2xl flex-shrink-0", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: coverImage, alt: title, className: "transition-transform duration-300 group-hover:scale-110 w-full h-48 sm:h-52 lg:h-48 object-cover", width: 400, height: 240, unoptimized: true }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 sm:p-5 lg:p-6 flex flex-col flex-grow", children: [tags && tags.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mb-3 flex-shrink-0", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-block py-1 px-2 sm:px-3 bg-primary/10 text-primary text-xs sm:text-sm font-medium rounded-full", children: tags[0] }) })), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg sm:text-xl font-semibold text-dark dark:text-white group-hover:text-primary transition-colors duration-300 mb-2 sm:mb-3 line-clamp-2 flex-shrink-0 leading-tight", style: { minHeight: "3rem" }, children: title }), excerpt && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow", children: excerpt })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-auto flex-shrink-0 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: authorImage || "/images/users/alkesh.jpg", alt: author || "Author", width: 32, height: 32, className: "w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs sm:text-sm font-medium text-dark dark:text-white truncate", children: author || "Author" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: formatDate(createdAt) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1 text-gray-500 dark:text-gray-400 flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:clock-circle-outline", className: "w-3 h-3 sm:w-4 sm:h-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs whitespace-nowrap", children: [readTime, " min"] })] })] })] })] }) }));
};
exports.default = BlogCard;
//# sourceMappingURL=blogCard.js.map