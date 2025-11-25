"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const Breadcrumb = ({ links }) => {
    const lastIndex = links.length - 1;
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-baseline flex-wrap justify-center my-[0.9375rem] mx-0", children: links.map((link, index) => ((0, jsx_runtime_1.jsx)(react_1.default.Fragment, { children: index !== lastIndex ? ((0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: "no-underline flex items-center text-midnight_text dark:text-white dark:text-opacity-70 text-SkyMistBlue font-normal text-xl hover:underline after:relative after:content-[''] after:ml-2.5 after:mr-3 after:my-0 after:inline-block after:top-[0.0625rem] after:w-2 after:h-2 after:border-r-2 after:border-solid after:border-b-2 after:border-midnight_text dark:after:border-white after:-rotate-45", children: link.text })) : ((0, jsx_runtime_1.jsx)("span", { className: "dark:text-white text-midnight_text text-xl mx-2.5", children: link.text })) }, index))) }));
};
exports.default = Breadcrumb;
//# sourceMappingURL=index.js.map