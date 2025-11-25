"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = exports.revalidate = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Blog_1 = __importDefault(require("@/components/Blog"));
const HeroSub_1 = __importDefault(require("@/components/shared/HeroSub"));
// Enable static generation with revalidation for better performance
exports.revalidate = 300; // Revalidate every 5 minutes
exports.metadata = {
    title: "Blog Grids | Homely ",
};
const Blog = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(HeroSub_1.default, { title: "Real estate insights.", description: "Stay ahead in the property market with expert advice and updates.", badge: "Blog" }), (0, jsx_runtime_1.jsx)(Blog_1.default, {})] }));
};
exports.default = Blog;
//# sourceMappingURL=page.js.map