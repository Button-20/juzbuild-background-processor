"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const contactInfo_client_1 = require("@/lib/contactInfo-client");
const react_1 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("react");
const Footer = () => {
    const [footerLinks, setFooterLinks] = (0, react_2.useState)([]);
    const [isLoading, setIsLoading] = (0, react_2.useState)(true);
    const [socialLinks, setSocialLinks] = (0, react_2.useState)({
        twitter: "https://twitter.com/homelyrealestate",
        facebook: "https://facebook.com/homelyrealestate",
        instagram: "https://instagram.com/homelyrealestate",
    });
    (0, react_2.useEffect)(() => {
        const fetchFooterLinks = async () => {
            try {
                const response = await fetch("/api/footer-links");
                const data = await response.json();
                if (data.success) {
                    setFooterLinks(data.footerLinks);
                }
                else {
                    throw new Error("Failed to fetch footer links");
                }
            }
            catch (error) {
                console.error("Error fetching footer links:", error);
                // Fallback to default links
                setFooterLinks([
                    { label: "Villas", href: "/properties/villa" },
                    { label: "Apartments", href: "/properties/apartment" },
                    { label: "Offices", href: "/properties/office" },
                    { label: "All Properties", href: "/properties" },
                    { label: "Blog", href: "/blogs" },
                    { label: "Contact Us", href: "/contactus" },
                    { label: "About Us", href: "/#about" },
                ]);
            }
            finally {
                setIsLoading(false);
            }
        };
        const loadSocialLinks = async () => {
            try {
                const data = await (0, contactInfo_client_1.fetchContactData)();
                setSocialLinks({
                    twitter: data.social.twitter || "https://twitter.com/homelyrealestate",
                    facebook: data.social.facebook || "https://facebook.com/homelyrealestate",
                    instagram: data.social.instagram || "https://instagram.com/homelyrealestate",
                });
            }
            catch (error) {
                console.error("Error loading social links:", error);
            }
        };
        fetchFooterLinks();
        loadSocialLinks();
    }, []);
    return ((0, jsx_runtime_1.jsx)("footer", { className: "relative z-10 bg-dark", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto max-w-8xl pt-14 px-4 sm:px-6 lg:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex lg:items-center justify-between items-start lg:gap-11 pb-14 border-b border-white/10 lg:flex-nowrap flex-wrap gap-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-white text-sm lg:max-w-1/5 w-full lg:w-auto", children: "Stay updated with the latest news, promotions, and exclusive offers." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex lg:flex-row flex-col items-start lg:items-center lg:gap-10 gap-4 w-full lg:w-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex sm:flex-row flex-col gap-2 lg:order-1 order-2 w-full sm:w-auto", children: [(0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Enter Your Email", className: "rounded-full py-3 sm:py-4 px-4 sm:px-6 bg-white/10 placeholder:text-white text-white focus-visible:outline-0 text-sm sm:text-base w-full sm:w-auto min-w-0 sm:min-w-[200px]" }), (0, jsx_runtime_1.jsx)("button", { className: "text-dark bg-white py-3 sm:py-4 px-6 sm:px-8 font-semibold rounded-full hover:bg-primary hover:text-white duration-300 hover:cursor-pointer text-sm sm:text-base whitespace-nowrap", children: "Subscribe" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/40 text-xs sm:text-sm lg:max-w-[45%] order-1 lg:order-2 leading-relaxed", children: "By subscribing, you agree to receive our promotional emails. You can unsubscribe at any time." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-center lg:justify-start", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: socialLinks.twitter, target: "_blank", rel: "noopener noreferrer", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:x-logo-bold", width: 20, height: 20, className: "text-white hover:text-primary duration-300 sm:w-6 sm:h-6" }) }), (0, jsx_runtime_1.jsx)(link_1.default, { href: socialLinks.facebook, target: "_blank", rel: "noopener noreferrer", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:facebook-logo-bold", width: 20, height: 20, className: "text-white hover:text-primary duration-300 sm:w-6 sm:h-6" }) }), (0, jsx_runtime_1.jsx)(link_1.default, { href: socialLinks.instagram, target: "_blank", rel: "noopener noreferrer", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:instagram-logo-bold", width: 20, height: 20, className: "text-white hover:text-primary duration-300 sm:w-6 sm:h-6" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "py-12 sm:py-16 border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-12 sm:gap-10 gap-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-7 md:col-span-8 col-span-12", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-white leading-[1.2] text-28 sm:text-32 lg:text-40 font-medium mb-4 sm:mb-6 lg:max-w-3/4", children: "Begin your path to success contact us today." }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/contactus", className: "bg-primary text-sm sm:text-base font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-white hover:bg-white hover:text-dark duration-300 hover:cursor-pointer inline-block", children: "Get In Touch" })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-3 sm:gap-4 w-fit", children: [!isLoading &&
                                            footerLinks.slice(0, 4).map((item, index) => ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: item.href, className: "text-white/40 text-sm sm:text-base hover:text-white duration-300", children: item.label }) }, index))), isLoading && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-white/10 rounded animate-pulse w-16" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-white/10 rounded animate-pulse w-20" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-white/10 rounded animate-pulse w-14" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-white/10 rounded animate-pulse w-24" })] }))] }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-2 md:col-span-12 sm:col-span-6 col-span-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-3 sm:gap-4 w-fit", children: [!isLoading &&
                                            footerLinks.slice(4, 8).map((item, index) => ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: item.href, className: "text-white/40 text-sm sm:text-base hover:text-white duration-300", children: item.label }) }, index))), isLoading && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-white/10 rounded animate-pulse w-12" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-white/10 rounded animate-pulse w-20" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-white/10 rounded animate-pulse w-16" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-white/10 rounded animate-pulse w-18" })] }))] }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between md:flex-nowrap flex-wrap items-center py-4 sm:py-6 gap-4 sm:gap-6", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-white/40 text-xs sm:text-sm order-2 md:order-1 w-full md:w-auto text-center md:text-left", children: ["\u00A92025 Homely - Design & Developed by", " ", (0, jsx_runtime_1.jsx)(link_1.default, { href: "https://juzbuild.com/", className: "hover:text-primary duration-300", target: "_blank", rel: "noopener noreferrer", children: "Juzbuild" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 sm:gap-8 items-center order-1 md:order-2 w-full md:w-auto justify-center md:justify-end", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/terms-of-service", className: "text-white/40 hover:text-primary text-xs sm:text-sm duration-300", children: "Terms of service" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/privacy-policy", className: "text-white/40 hover:text-primary text-xs sm:text-sm duration-300", children: "Privacy policy" })] })] })] }) }));
};
exports.default = Footer;
//# sourceMappingURL=index.js.map