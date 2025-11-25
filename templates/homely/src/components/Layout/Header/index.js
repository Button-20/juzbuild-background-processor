"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const useSettings_1 = require("@/hooks/useSettings");
const contactInfo_client_1 = require("@/lib/contactInfo-client");
const react_1 = require("@iconify/react");
const next_themes_1 = require("next-themes");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const react_2 = require("react");
const Logo_1 = __importDefault(require("./BrandLogo/Logo"));
const NavLink_1 = __importDefault(require("./Navigation/NavLink"));
const Header = () => {
    const [sticky, setSticky] = (0, react_2.useState)(false);
    const [navbarOpen, setNavbarOpen] = (0, react_2.useState)(false);
    const [navLinks, setNavLinks] = (0, react_2.useState)([]);
    const [isLoadingNav, setIsLoadingNav] = (0, react_2.useState)(true);
    const [contactInfo, setContactInfo] = (0, react_2.useState)({ phone: "", email: "" });
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    const pathname = (0, navigation_1.usePathname)();
    const { isPhoneEnabled, isEmailEnabled } = (0, useSettings_1.useSettings)();
    const sideMenuRef = (0, react_2.useRef)(null);
    // Fetch navigation links and contact info
    (0, react_2.useEffect)(() => {
        const fetchNavLinks = async () => {
            try {
                const response = await fetch("/api/nav-links");
                const data = await response.json();
                if (data.success) {
                    setNavLinks(data.navLinks);
                }
                else {
                    throw new Error("Failed to fetch navigation links");
                }
            }
            catch (error) {
                console.error("Error fetching navigation links:", error);
                // Fallback to basic navigation
                setNavLinks([
                    { label: "Home", href: "/" },
                    { label: "Properties", href: "/properties" },
                    { label: "Contact", href: "/contactus" },
                ]);
            }
            finally {
                setIsLoadingNav(false);
            }
        };
        const loadContactInfo = async () => {
            try {
                const data = await (0, contactInfo_client_1.fetchContactData)();
                setContactInfo({
                    phone: data.contact.phone,
                    email: data.contact.supportEmail,
                });
            }
            catch (error) {
                console.error("Error loading contact info:", error);
            }
        };
        fetchNavLinks();
        loadContactInfo();
    }, []);
    const handleClickOutside = (event) => {
        if (sideMenuRef.current &&
            !sideMenuRef.current.contains(event.target)) {
            setNavbarOpen(false);
        }
    };
    const handleScroll = (0, react_2.useCallback)(() => {
        setSticky(window.scrollY >= 50);
    }, []);
    (0, react_2.useEffect)(() => {
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleScroll]);
    const isHomepage = pathname === "/";
    return ((0, jsx_runtime_1.jsxs)("header", { className: `fixed h-24 py-1 z-50 w-full bg-transparent transition-all duration-300 lg:px-0 px-4 ${sticky ? "top-3" : "top-0"}`, children: [(0, jsx_runtime_1.jsx)("nav", { className: `container mx-auto max-w-8xl flex items-center justify-between py-4 duration-300 ${sticky
                    ? "shadow-lg bg-white dark:bg-dark rounded-full top-5 px-4 "
                    : "shadow-none top-0"}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center gap-2 w-full", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/", children: (0, jsx_runtime_1.jsx)(Logo_1.default, { isHomepage: isHomepage, sticky: sticky }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 sm:gap-6", children: [(0, jsx_runtime_1.jsxs)("button", { className: "hover:cursor-pointer", onClick: () => setTheme(theme === "dark" ? "light" : "dark"), children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:sun-bold", width: 32, height: 32, className: `dark:hidden block ${isHomepage
                                                ? sticky
                                                    ? "text-dark"
                                                    : "text-white"
                                                : "text-dark"}` }), (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:moon-bold", width: 32, height: 32, className: "dark:block hidden text-white" })] }), isPhoneEnabled && ((0, jsx_runtime_1.jsx)("div", { className: `hidden md:block`, children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: `tel:${contactInfo.phone}`, className: `text-base text-inherit flex items-center gap-2 border-r pr-6 ${isHomepage
                                            ? sticky
                                                ? "text-dark dark:text-white hover:text-primary border-dark dark:border-white"
                                                : "text-white hover:text-primary"
                                            : "text-dark hover:text-primary"}`, children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:phone-bold", width: 24, height: 24 }), contactInfo.phone] }) })), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => setNavbarOpen(!navbarOpen), className: `flex items-center gap-3 p-2 sm:px-5 sm:py-3 rounded-full font-semibold hover:cursor-pointer border ${isHomepage
                                            ? sticky
                                                ? "text-white bg-dark dark:bg-white dark:text-dark dark:hover:text-white dark:hover:bg-dark hover:text-dark hover:bg-white border-dark dark:border-white"
                                                : "text-dark bg-white dark:text-dark hover:bg-transparent hover:text-white border-white"
                                            : "bg-dark text-white hover:bg-transparent hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-transparent dark:hover:text-white duration-300"}`, "aria-label": "Toggle mobile menu", children: [(0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:list", width: 24, height: 24 }) }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:block", children: "Menu" })] }) })] })] }) }), navbarOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 w-full h-full bg-black/50 z-40" })), (0, jsx_runtime_1.jsx)("div", { ref: sideMenuRef, className: `fixed top-0 right-0 h-full w-full bg-dark shadow-lg transition-transform duration-300 max-w-2xl ${navbarOpen ? "translate-x-0" : "translate-x-full"} z-50 px-20 overflow-auto no-scrollbar`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-full justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-start py-10", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setNavbarOpen(false), "aria-label": "Close mobile menu", className: "bg-white p-3 rounded-full hover:cursor-pointer", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "black", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }) }) }), (0, jsx_runtime_1.jsx)("nav", { className: "flex flex-col items-start gap-4", children: (0, jsx_runtime_1.jsx)("ul", { className: "w-full", children: navLinks.map((item, index) => ((0, jsx_runtime_1.jsx)(NavLink_1.default, { item: item, onClick: () => setNavbarOpen(false) }, index))) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1 my-16 text-white", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-base sm:text-xm font-normal text-white/40", children: "Contact" }), isEmailEnabled && ((0, jsx_runtime_1.jsx)(link_1.default, { href: `mailto:${contactInfo.email}`, className: "text-base sm:text-xm font-medium text-inherit hover:text-primary", children: contactInfo.email })), isPhoneEnabled && ((0, jsx_runtime_1.jsxs)(link_1.default, { href: `tel:${contactInfo.phone}`, className: "text-base sm:text-xm font-medium text-inherit hover:text-primary", children: [contactInfo.phone, " "] }))] })] }) })] }));
};
exports.default = Header;
//# sourceMappingURL=index.js.map