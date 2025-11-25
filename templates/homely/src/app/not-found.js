"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const image_1 = __importDefault(require("next/image"));
const iconify_js_1 = require("@iconify/react/dist/iconify.js");
exports.metadata = {
    title: "404 Page | Property ",
};
const NotFound = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("section", { className: "flex justify-center pb-0!", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760939490/404_amfz4w.png", alt: "404", width: 490, height: 450, unoptimized: true }) }), (0, jsx_runtime_1.jsxs)("section", { className: "text-center bg-cover relative overflow-x-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2.5 items-center justify-center", children: [(0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(iconify_js_1.Icon, { icon: "ph:house-simple-fill", width: 20, height: 20, className: "text-primary" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-base font-semibold text-dark/75 dark:text-white/75", children: "Error 404" })] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-dark text-52 relative font-bold dark:text-white ", children: "Lost? Let\u2019s Help You Find Home." }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-dark/50 dark:text-white/50 font-normal w-full mx-auto", children: "Looks like you\u2019ve hit a dead end \u2014 but don\u2019t worry, we\u2019ll help you get back on track" })] })] }));
};
exports.default = NotFound;
//# sourceMappingURL=not-found.js.map