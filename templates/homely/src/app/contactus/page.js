"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactUs;
const jsx_runtime_1 = require("react/jsx-runtime");
const SEOComponent_1 = __importDefault(require("@/components/shared/SEOComponent"));
const useSettings_1 = require("@/hooks/useSettings");
const contactInfo_client_1 = require("@/lib/contactInfo-client");
const seo_1 = require("@/lib/seo");
const react_1 = require("@iconify/react");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const react_2 = require("react");
function ContactUs() {
    const initialFormData = {
        name: "",
        phone: "",
        email: "",
        company: "",
        subject: "",
        budget: "",
        timeline: "",
        message: "",
    };
    const [formData, setFormData] = (0, react_2.useState)(initialFormData);
    const [isSubmitting, setIsSubmitting] = (0, react_2.useState)(false);
    const [contactData, setContactData] = (0, react_2.useState)({
        phone: "",
        email: "",
        address: "",
    });
    const [submitStatus, setSubmitStatus] = (0, react_2.useState)({ type: null, message: "" });
    const { isPhoneEnabled, isEmailEnabled, isContactFormEnabled } = (0, useSettings_1.useSettings)();
    // Load contact information
    (0, react_2.useEffect)(() => {
        const loadContactData = async () => {
            try {
                const data = await (0, contactInfo_client_1.fetchContactData)();
                setContactData({
                    phone: data.contact.phone || "",
                    email: data.contact.supportEmail || "",
                    address: data.contact.address || "",
                });
            }
            catch (error) {
                console.error("Error loading contact data:", error);
            }
        };
        loadContactData();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const resetForm = () => {
        setFormData(initialFormData);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: "" });
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                setSubmitStatus({
                    type: "success",
                    message: result.message || "Your message has been sent successfully!",
                });
                resetForm();
            }
            else {
                setSubmitStatus({
                    type: "error",
                    message: result.error || "Failed to send message. Please try again.",
                });
            }
        }
        catch {
            setSubmitStatus({
                type: "error",
                message: "An error occurred. Please try again.",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const contactMetadata = seo_1.generatePageMetadata.contact();
    // Contact page schema
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: `Contact ${seo_1.SEO_CONFIG.COMPANY_NAME}`,
        description: contactMetadata.description,
        url: `${seo_1.SEO_CONFIG.WEBSITE_URL}/contact`,
        mainEntity: {
            "@type": "Organization",
            name: seo_1.SEO_CONFIG.COMPANY_NAME,
            contactPoint: {
                "@type": "ContactPoint",
                telephone: seo_1.SEO_CONFIG.COMPANY_PHONE,
                contactType: "Customer Service",
                email: seo_1.SEO_CONFIG.COMPANY_EMAIL,
                areaServed: seo_1.SEO_CONFIG.SERVICE_AREAS.split(",").map((area) => area.trim()),
            },
            address: {
                "@type": "PostalAddress",
                streetAddress: seo_1.SEO_CONFIG.COMPANY_ADDRESS,
                addressLocality: seo_1.SEO_CONFIG.PRIMARY_LOCATION,
            },
        },
    };
    // Track contact page view
    (0, react_2.useEffect)(() => {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "page_view", {
                page_title: contactMetadata.title,
                page_location: window.location.href,
                page_path: "/contact",
            });
        }
    }, [contactMetadata.title]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(SEOComponent_1.default, { title: contactMetadata.title, description: contactMetadata.description, canonical: `${seo_1.SEO_CONFIG.WEBSITE_URL}/contact`, keywords: contactMetadata.keywords, structuredData: contactSchema }), (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-16", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2.5 items-center justify-center mb-3", children: [(0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", width: 20, height: 20, className: "text-primary" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-base font-semibold text-badge dark:text-white/90", children: "Contact us" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-4xl sm:text-52 font-medium tracking-tighter text-black dark:text-white mb-3 leading-10 sm:leading-14", children: "Have questions? ready to help!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xm font-normal tracking-tight text-black/50 dark:text-white/50 leading-6", children: "Looking for your dream home or ready to sell? Our expert team offers personalized guidance and market expertise tailored to you." })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-xl dark:shadow-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row lg:items-stretch gap-12 min-h-[600px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative w-full lg:w-fit shrink-0 h-[500px] lg:h-auto", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760938661/contactUs_h5xh6w.jpg", alt: "wall", width: 497, height: 630, className: "rounded-2xl brightness-50 w-full lg:w-[497px] h-full min-h-[500px] lg:min-h-full object-cover", unoptimized: true }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute top-6 left-6 lg:top-12 lg:left-12 flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("h5", { className: "text-xl xs:text-2xl mobile:text-3xl font-medium tracking-tight text-white", children: "Contact information" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm xs:text-base mobile:text-xm font-normal text-white/80", children: "Ready to find your dream home or sell your property? We\u2019re here to help!" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-6 left-6 lg:bottom-12 lg:left-12 flex flex-col gap-4 text-white", children: [isPhoneEnabled && ((0, jsx_runtime_1.jsx)(link_1.default, { href: `tel:${contactData.phone}`, className: "w-fit", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 group w-fit", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:phone", width: 32, height: 32 }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary", children: contactData.phone })] }) })), isEmailEnabled && ((0, jsx_runtime_1.jsx)(link_1.default, { href: `mailto:${contactData.email}`, className: "w-fit", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 group w-fit", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:envelope-simple", width: 32, height: 32 }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary", children: contactData.email })] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:map-pin", width: 32, height: 32 }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm xs:text-base mobile:text-xm font-normal", children: contactData.address })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: !isContactFormEnabled ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-full min-h-[400px]", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:envelope-simple-slash", width: 64, height: 64, className: "mx-auto mb-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-semibold mb-2", children: "Contact Form Unavailable" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Please use the contact information provided to reach us." })] }) })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [submitStatus.type && ((0, jsx_runtime_1.jsx)("div", { className: `mb-6 p-4 rounded-lg ${submitStatus.type === "success"
                                                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                                                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: submitStatus.type === "success"
                                                                ? "ph:check-circle"
                                                                : "ph:warning-circle", width: 20, height: 20 }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium", children: submitStatus.message })] }) })), (0, jsx_runtime_1.jsx)("form", { onSubmit: handleSubmit, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row gap-6", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", name: "name", id: "name", value: formData.name, onChange: handleInputChange, autoComplete: "name", placeholder: "Name*", required: true, disabled: isSubmitting, className: "px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed" }), (0, jsx_runtime_1.jsx)("input", { type: "tel", name: "phone", id: "phone", value: formData.phone, onChange: handleInputChange, autoComplete: "tel", placeholder: "Phone number*", required: true, disabled: isSubmitting, className: "px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed" })] }), (0, jsx_runtime_1.jsx)("input", { type: "email", name: "email", id: "email", value: formData.email, onChange: handleInputChange, autoComplete: "email", placeholder: "Email address*", required: true, disabled: isSubmitting, className: "px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline disabled:opacity-50 disabled:cursor-not-allowed" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row gap-6", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", name: "company", id: "company", value: formData.company, onChange: handleInputChange, placeholder: "Company (optional)", disabled: isSubmitting, className: "px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed" }), (0, jsx_runtime_1.jsxs)("select", { name: "subject", id: "subject", value: formData.subject, onChange: handleInputChange, required: true, disabled: isSubmitting, className: "px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select inquiry type*" }), (0, jsx_runtime_1.jsx)("option", { value: "property_inquiry", children: "Property Inquiry" }), (0, jsx_runtime_1.jsx)("option", { value: "buy_property", children: "Looking to Buy" }), (0, jsx_runtime_1.jsx)("option", { value: "sell_property", children: "Looking to Sell" }), (0, jsx_runtime_1.jsx)("option", { value: "rent_property", children: "Looking to Rent" }), (0, jsx_runtime_1.jsx)("option", { value: "investment", children: "Investment Opportunities" }), (0, jsx_runtime_1.jsx)("option", { value: "valuation", children: "Property Valuation" }), (0, jsx_runtime_1.jsx)("option", { value: "general", children: "General Information" }), (0, jsx_runtime_1.jsx)("option", { value: "other", children: "Other" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row gap-6", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", name: "budget", id: "budget", value: formData.budget, onChange: handleInputChange, placeholder: "Budget range (e.g., $100k - $200k)", disabled: isSubmitting, className: "px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "timeline", id: "timeline", value: formData.timeline, onChange: handleInputChange, placeholder: "Timeline (e.g., 3-6 months)", disabled: isSubmitting, className: "px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed" })] }), (0, jsx_runtime_1.jsx)("textarea", { rows: 8, cols: 50, name: "message", id: "message", value: formData.message, onChange: handleInputChange, placeholder: "Write here your message", required: true, disabled: isSubmitting, className: "px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-2xl outline-primary focus:outline disabled:opacity-50 disabled:cursor-not-allowed" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isSubmitting, className: "px-8 py-4 rounded-full bg-primary text-white text-base font-semibold w-full mobile:w-fit hover:cursor-pointer hover:bg-dark duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: isSubmitting ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:spinner", width: 20, height: 20, className: "animate-spin" }), "Sending..."] })) : ("Send message") })] }) })] })) })] }) })] })] }));
}
//# sourceMappingURL=page.js.map