"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const contactInfo_client_1 = require("@/lib/contactInfo-client");
const image_1 = __importDefault(require("next/image"));
const react_1 = require("react");
const Logo = ({ isHomepage, sticky }) => {
    const [logoUrl, setLogoUrl] = (0, react_1.useState)("");
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const loadLogo = async () => {
            try {
                const data = await (0, contactInfo_client_1.fetchContactData)();
                setLogoUrl(data.logoUrl || "");
            }
            catch (error) {
                console.error("Error loading logo:", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadLogo();
    }, []);
    // If we have a custom logo from database, display it
    if (logoUrl && !isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "w-30 h-auto sm:w-32 lg:w-[180px]", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: logoUrl, alt: "logo", width: 150, height: 68, unoptimized: true, className: "w-full h-auto max-h-[68px] object-contain", priority: true }) }));
    }
    // Fallback to default SVG logos
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/header/dark-logo.svg", alt: "logo", width: 150, height: 68, unoptimized: true, className: `w-30 h-auto sm:w-32 lg:w-[180px] ${isHomepage
                    ? sticky
                        ? "block dark:hidden"
                        : "hidden"
                    : sticky
                        ? "block dark:hidden"
                        : "block dark:hidden"}` }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/header/logo.svg", alt: "logo", width: 150, height: 68, unoptimized: true, className: `w-30 h-auto sm:w-32 lg:w-[180px] ${isHomepage
                    ? sticky
                        ? "hidden dark:block"
                        : "block"
                    : sticky
                        ? "dark:block hidden"
                        : "dark:block hidden"}` })] }));
};
exports.default = Logo;
//# sourceMappingURL=Logo.js.map