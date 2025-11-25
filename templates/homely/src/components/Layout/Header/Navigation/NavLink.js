"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const NavLink = ({ item, onClick }) => {
    const path = (0, navigation_1.usePathname)();
    const itemLabelToPath = `/${item.label.toLowerCase().replace(/\s+/g, '-')}`;
    const linkclasses = (0, clsx_1.default)('py-3 text-3xl sm:text-5xl font-medium text-white/40 rounded-full group-hover:text-primary', {
        '!text-primary': item.href === path,
        'text-primary': path.startsWith(itemLabelToPath),
    });
    const liststyle = (0, clsx_1.default)('w-0 h-0.5 bg-primary transition-all duration-300', {
        '!block w-6 mr-4': item.href === path,
        'block w-6': path.startsWith(itemLabelToPath),
        'group-hover:block group-hover:w-6 group-hover:mr-4': true,
    });
    return ((0, jsx_runtime_1.jsxs)("li", { className: 'flex items-center group w-fit', children: [(0, jsx_runtime_1.jsx)("div", { className: liststyle }), (0, jsx_runtime_1.jsx)(link_1.default, { href: item.href, className: linkclasses, onClick: onClick, children: item.label })] }));
};
exports.default = NavLink;
//# sourceMappingURL=NavLink.js.map