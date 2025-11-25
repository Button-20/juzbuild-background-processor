"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ContactInfo_1 = __importDefault(require("@/components/shared/ContactInfo"));
const react_1 = require("react");
const PrivacyPolicy = () => {
    const [content, setContent] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch("/api/pages/privacy-policy");
                const data = await response.json();
                if (data.success && data.page) {
                    setContent(data.page.content);
                }
            }
            catch (error) {
                console.error("Error fetching privacy policy:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "py-20 bg-gray-50 dark:bg-black", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto max-w-4xl px-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center min-h-[400px]", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)("section", { className: "py-20 bg-gray-50 dark:bg-black", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto max-w-4xl px-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-center mb-12 text-dark dark:text-white", children: "Privacy Policy" }), (0, jsx_runtime_1.jsx)("div", { className: "prose prose-lg max-w-none dark:prose-invert **:text-dark dark:**:text-white h2:text-dark dark:h2:text-white h3:text-dark dark:h3:text-white p:text-dark dark:p:text-white li:text-dark dark:li:text-white", children: content ? ((0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: content } })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { className: "lead", children: "Last updated: September 3, 2025" }), (0, jsx_runtime_1.jsx)("h2", { children: "1. Information We Collect" }), (0, jsx_runtime_1.jsx)("p", { children: "We collect information you provide directly to us, such as when you create an account, contact us, or use our services. This may include:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Name and contact information" }), (0, jsx_runtime_1.jsx)("li", { children: "Account credentials" }), (0, jsx_runtime_1.jsx)("li", { children: "Property preferences and search history" }), (0, jsx_runtime_1.jsx)("li", { children: "Communication preferences" })] }), (0, jsx_runtime_1.jsx)("h2", { children: "2. How We Use Your Information" }), (0, jsx_runtime_1.jsx)("p", { children: "We use the information we collect to:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Provide and improve our real estate services" }), (0, jsx_runtime_1.jsx)("li", { children: "Send you property listings and updates" }), (0, jsx_runtime_1.jsx)("li", { children: "Communicate with you about our services" }), (0, jsx_runtime_1.jsx)("li", { children: "Personalize your experience on our platform" }), (0, jsx_runtime_1.jsx)("li", { children: "Comply with legal obligations" })] }), (0, jsx_runtime_1.jsx)("h2", { children: "3. Information Sharing" }), (0, jsx_runtime_1.jsx)("p", { children: "We do not sell, trade, or rent your personal information to third parties. We may share your information with:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Real estate agents and property owners when you express interest in a property" }), (0, jsx_runtime_1.jsx)("li", { children: "Service providers who help us operate our platform" }), (0, jsx_runtime_1.jsx)("li", { children: "Legal authorities when required by law" })] }), (0, jsx_runtime_1.jsx)("h2", { children: "4. Data Security" }), (0, jsx_runtime_1.jsx)("p", { children: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction." }), (0, jsx_runtime_1.jsx)("h2", { children: "5. Cookies and Tracking" }), (0, jsx_runtime_1.jsx)("p", { children: "We use cookies and similar technologies to enhance your browsing experience, analyze site usage, and assist in our marketing efforts." }), (0, jsx_runtime_1.jsx)("h2", { children: "6. Your Rights" }), (0, jsx_runtime_1.jsx)("p", { children: "You have the right to:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Access and update your personal information" }), (0, jsx_runtime_1.jsx)("li", { children: "Delete your account and associated data" }), (0, jsx_runtime_1.jsx)("li", { children: "Opt-out of marketing communications" }), (0, jsx_runtime_1.jsx)("li", { children: "Request a copy of your data" })] }), (0, jsx_runtime_1.jsx)("h2", { children: "7. Children's Privacy" }), (0, jsx_runtime_1.jsx)("p", { children: "Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13." }), (0, jsx_runtime_1.jsx)("h2", { children: "8. Changes to This Policy" }), (0, jsx_runtime_1.jsx)("p", { children: "We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page." }), (0, jsx_runtime_1.jsx)("h2", { children: "9. Contact Us" }), (0, jsx_runtime_1.jsx)("p", { children: "If you have questions about this Privacy Policy, please contact us at:" }), (0, jsx_runtime_1.jsx)(ContactInfo_1.default, {})] })) })] }) }));
};
exports.default = PrivacyPolicy;
//# sourceMappingURL=page.js.map