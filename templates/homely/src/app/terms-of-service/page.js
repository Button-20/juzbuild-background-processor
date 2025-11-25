"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ContactInfo_1 = __importDefault(require("@/components/shared/ContactInfo"));
const react_1 = require("react");
const TermsOfService = () => {
    const [content, setContent] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch("/api/pages/terms-of-service");
                const data = await response.json();
                if (data.success && data.page) {
                    setContent(data.page.content);
                }
            }
            catch (error) {
                console.error("Error fetching terms of service:", error);
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
    return ((0, jsx_runtime_1.jsx)("section", { className: "py-20 bg-gray-50 dark:bg-black", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto max-w-4xl px-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-center mb-12 text-dark dark:text-white", children: "Terms of Service" }), (0, jsx_runtime_1.jsx)("div", { className: "prose prose-lg max-w-none dark:prose-invert **:text-dark dark:**:text-white h2:text-dark dark:h2:text-white h3:text-dark dark:h3:text-white p:text-dark dark:p:text-white li:text-dark dark:li:text-white", children: content ? ((0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: content } })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "1. Acceptance of Terms" }), (0, jsx_runtime_1.jsx)("p", { children: "By accessing and using Homely Real Estate services, you accept and agree to be bound by the terms and provision of this agreement." }), (0, jsx_runtime_1.jsx)("h2", { children: "2. Use License" }), (0, jsx_runtime_1.jsx)("p", { children: "Permission is granted to temporarily access the materials on Homely Real Estate for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "modify or copy the materials" }), (0, jsx_runtime_1.jsx)("li", { children: "use the materials for any commercial purpose or for any public display" }), (0, jsx_runtime_1.jsx)("li", { children: "attempt to reverse engineer any software contained on the website" }), (0, jsx_runtime_1.jsx)("li", { children: "remove any copyright or other proprietary notations from the materials" })] }), (0, jsx_runtime_1.jsx)("h2", { children: "3. Property Listings" }), (0, jsx_runtime_1.jsx)("p", { children: "All property listings are provided for informational purposes. While we strive to maintain accurate information, property details, availability, and pricing may change without notice." }), (0, jsx_runtime_1.jsx)("h2", { children: "4. User Accounts" }), (0, jsx_runtime_1.jsx)("p", { children: "Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account." }), (0, jsx_runtime_1.jsx)("h2", { children: "5. Privacy" }), (0, jsx_runtime_1.jsx)("p", { children: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services." }), (0, jsx_runtime_1.jsx)("h2", { children: "6. Disclaimer" }), (0, jsx_runtime_1.jsx)("p", { children: "The materials on Homely Real Estate are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights." }), (0, jsx_runtime_1.jsx)("h2", { children: "7. Contact Information" }), (0, jsx_runtime_1.jsx)("p", { children: "For questions about these Terms of Service, please contact us at:" }), (0, jsx_runtime_1.jsx)(ContactInfo_1.default, {})] })) })] }) }));
};
exports.default = TermsOfService;
//# sourceMappingURL=page.js.map