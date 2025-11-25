"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const accordion_1 = require("@/components/ui/accordion");
const react_1 = require("@iconify/react");
const image_1 = __importDefault(require("next/image"));
const react_2 = require("react");
const FAQ = () => {
    const [faqs, setFaqs] = (0, react_2.useState)([]);
    const [loading, setLoading] = (0, react_2.useState)(true);
    (0, react_2.useEffect)(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch("/api/faqs");
                if (response.ok) {
                    const data = await response.json();
                    setFaqs(data.faqs || []);
                }
            }
            catch (error) {
                console.error("Error fetching FAQs:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);
    if (loading || faqs.length === 0) {
        return null; // Hide section if no FAQs or loading
    }
    return ((0, jsx_runtime_1.jsx)("section", { id: "faqs", className: "py-12 sm:py-16 lg:py-20", children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-4 sm:px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-2 gap-8 lg:gap-10 items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "order-2 lg:order-1 mx-auto lg:mx-0", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760938455/faq-image_jp6p4w.png", alt: "FAQ illustration", width: 680, height: 644, className: "w-full h-auto max-w-md sm:max-w-lg lg:max-w-full", unoptimized: true }) }), (0, jsx_runtime_1.jsxs)("div", { className: "order-1 lg:order-2 lg:px-8 xl:px-12", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-dark/75 dark:text-white/75 text-sm sm:text-base font-semibold flex gap-2 mb-3 sm:mb-4", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", className: "text-xl sm:text-2xl text-primary" }), "FAQs"] }), (0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl sm:text-3xl lg:text-40 xl:text-52 leading-[1.2] font-medium text-dark dark:text-white mb-4 sm:mb-6", children: ["Everything about", " ", process.env.NEXT_PUBLIC_COMPANY_NAME || "Homely"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-dark/50 dark:text-white/50 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 lg:pr-8 xl:pr-20", children: "We know that buying, selling, or investing in real estate can be overwhelming. Here are some frequently asked questions to help guide you through the process" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 sm:mt-8", children: (0, jsx_runtime_1.jsx)(accordion_1.Accordion, { type: "single", defaultValue: faqs.length > 0 ? `item-${faqs[0]._id}` : undefined, collapsible: true, className: "w-full flex flex-col gap-4 sm:gap-6", children: faqs.map((faq, index) => ((0, jsx_runtime_1.jsxs)(accordion_1.AccordionItem, { value: `item-${faq._id}`, children: [(0, jsx_runtime_1.jsxs)(accordion_1.AccordionTrigger, { className: "text-sm sm:text-base font-medium hover:no-underline py-4 sm:py-6 text-left", children: [index + 1, ". ", faq.question] }), (0, jsx_runtime_1.jsx)(accordion_1.AccordionContent, { className: "text-sm sm:text-base text-dark/70 dark:text-white/70 pb-4 sm:pb-6", children: faq.answer })] }, faq._id))) }) })] })] }) }) }));
};
exports.default = FAQ;
//# sourceMappingURL=index.js.map