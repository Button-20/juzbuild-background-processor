"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConditionalLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const Footer_1 = __importDefault(require("@/components/Layout/Footer"));
const Header_1 = __importDefault(require("@/components/Layout/Header"));
function ConditionalLayout({ children, }) {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), children, (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
}
//# sourceMappingURL=ConditionalLayout.js.map