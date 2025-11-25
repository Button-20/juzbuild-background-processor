"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const iconify_js_1 = require("@iconify/react/dist/iconify.js");
const HeroSub = ({ title, description, badge }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("section", { className: "text-center bg-cover !pt-24 sm:!pt-32 lg:!pt-40 pb-12 sm:pb-16 lg:pb-20 relative overflow-x-hidden px-4 sm:px-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 sm:gap-2.5 items-center justify-center mb-4 sm:mb-6", children: [(0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(iconify_js_1.Icon, { icon: "ph:house-simple-fill", width: 16, height: 16, className: "text-primary sm:w-5 sm:h-5" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base font-semibold text-dark/75 dark:text-white/75", children: badge })] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-dark text-2xl sm:text-36 lg:text-52 relative font-bold dark:text-white mb-4 sm:mb-6 leading-tight", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-base sm:text-lg text-dark/50 dark:text-white/50 font-normal w-full max-w-2xl mx-auto px-4 sm:px-0", children: description })] }) }));
};
exports.default = HeroSub;
//# sourceMappingURL=index.js.map