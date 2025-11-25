"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertyDetails;
const jsx_runtime_1 = require("react/jsx-runtime");
const PropertyCard_1 = __importDefault(require("@/components/Properties/PropertyCard"));
const SEOComponent_1 = __importDefault(require("@/components/shared/SEOComponent"));
const useSettings_1 = require("@/hooks/useSettings");
const currency_1 = require("@/lib/currency");
const seo_1 = require("@/lib/seo");
const react_1 = require("@iconify/react");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const react_2 = require("react");
function PropertyDetails() {
    const { type, slug } = (0, navigation_1.useParams)();
    const { isInquiryFormEnabled } = (0, useSettings_1.useSettings)();
    const [property, setProperty] = (0, react_2.useState)(null);
    const [loading, setLoading] = (0, react_2.useState)(true);
    const [error, setError] = (0, react_2.useState)(null);
    const [currentImageIndex, setCurrentImageIndex] = (0, react_2.useState)(0);
    const [relatedProperties, setRelatedProperties] = (0, react_2.useState)([]);
    const [relatedLoading, setRelatedLoading] = (0, react_2.useState)(false);
    const [contactForm, setContactForm] = (0, react_2.useState)({
        name: "",
        email: "",
        phone: "",
        budget: "",
        timeline: "",
        message: "",
    });
    const [contactLoading, setContactLoading] = (0, react_2.useState)(false);
    const [showImageModal, setShowImageModal] = (0, react_2.useState)(false);
    const [showBackToTop, setShowBackToTop] = (0, react_2.useState)(false);
    (0, react_2.useEffect)(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/properties/${slug}`);
                if (!response.ok) {
                    throw new Error("Property not found");
                }
                const data = await response.json();
                setProperty(data);
                // Fetch related properties
                setRelatedLoading(true);
                try {
                    const relatedResponse = await fetch(`/api/properties/${slug}/related?limit=4`);
                    if (relatedResponse.ok) {
                        const relatedData = await relatedResponse.json();
                        setRelatedProperties(relatedData);
                    }
                }
                catch (relatedError) {
                    console.error("Failed to fetch related properties:", relatedError);
                }
                finally {
                    setRelatedLoading(false);
                }
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            }
            finally {
                setLoading(false);
            }
        };
        if (slug && type) {
            fetchProperty();
        }
    }, [slug, type]);
    // Generate comprehensive SEO data
    const propertyMetadata = property
        ? seo_1.generatePageMetadata.property(property)
        : null;
    const propertySchema = property
        ? seo_1.generateStructuredData.property(property)
        : null;
    // Generate breadcrumb data
    const breadcrumbs = [
        { name: "Home", url: seo_1.SEO_CONFIG.WEBSITE_URL },
        { name: "Properties", url: `${seo_1.SEO_CONFIG.WEBSITE_URL}/properties` },
        {
            name: type
                ? `${type.charAt(0).toUpperCase() + type.slice(1)} Properties`
                : "Properties",
            url: `${seo_1.SEO_CONFIG.WEBSITE_URL}/properties${type ? `/${type}` : ""}`,
        },
        ...(property ? [{ name: property.name, url: window.location.href }] : []),
    ];
    // Analytics tracking
    (0, react_2.useEffect)(() => {
        if (property && typeof window !== "undefined") {
            // Track property page view
            if (window.gtag) {
                window.gtag("event", "property_view", {
                    property_id: property._id,
                    property_name: property.name,
                    property_type: property.propertyType,
                    property_location: property.location,
                    property_price: property.price,
                    currency: property.currency || "GHS",
                });
            }
            // Facebook Pixel property view event
            if (window.fbq) {
                window.fbq("track", "ViewContent", {
                    content_type: "property",
                    content_ids: [property._id],
                    content_name: property.name,
                    content_category: property.propertyType,
                    value: property.price,
                    currency: property.currency || "GHS",
                });
            }
        }
    }, [property]);
    // Handle scroll for back to top button
    (0, react_2.useEffect)(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    const nextImage = () => {
        if (property?.images && property.images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
        }
    };
    const prevImage = () => {
        if (property?.images && property.images.length > 1) {
            setCurrentImageIndex((prev) => prev === 0 ? property.images.length - 1 : prev - 1);
        }
    };
    const formatPrice = () => {
        if (!property)
            return "Price on request";
        if (property.rate) {
            return property.rate;
        }
        if (property.price && property.currency) {
            return (0, currency_1.formatCurrencyLegacy)(property.price, property.currency);
        }
        return "Price on request";
    };
    const capitalizeFirst = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactLoading(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: contactForm.name,
                    email: contactForm.email,
                    phone: contactForm.phone,
                    budget: contactForm.budget,
                    timeline: contactForm.timeline,
                    message: contactForm.message,
                    propertyName: property?.name,
                    propertyUrl: window.location.href,
                    subject: "property_inquiry", // Automatically set for property inquiries
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Reset form
                setContactForm({
                    name: "",
                    email: "",
                    phone: "",
                    budget: "",
                    timeline: "",
                    message: "",
                });
                alert(data.message ||
                    "Thank you for your inquiry! We'll get back to you soon.");
            }
            else {
                alert(data.error || "Failed to send message. Please try again.");
            }
        }
        catch (error) {
            console.error("Contact form error:", error);
            alert("Failed to send message. Please try again.");
        }
        finally {
            setContactLoading(false);
        }
    };
    const handleContactChange = (e) => {
        setContactForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "!pt-44 pb-20", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto max-w-8xl px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-16", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 dark:text-gray-400", children: "Loading property..." })] }) }) }));
    }
    if (error || !property) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "!pt-44 pb-20", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto max-w-8xl px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-16", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-x", className: "text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-semibold text-dark dark:text-white mb-2", children: "Property Not Found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 dark:text-gray-400 mb-6", children: "The property you're looking for doesn't exist or has been removed." }), (0, jsx_runtime_1.jsxs)(link_1.default, { href: `/properties/${type}`, className: "px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block", children: ["Back to ", capitalizeFirst(type), " Properties"] })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [propertyMetadata && propertySchema && ((0, jsx_runtime_1.jsx)(SEOComponent_1.default, { title: propertyMetadata.title, description: propertyMetadata.description, canonical: `${seo_1.SEO_CONFIG.WEBSITE_URL}/properties/${type}/${slug}`, ogImage: property.images?.[0]?.src || seo_1.SEO_CONFIG.DEFAULT_OG_IMAGE, keywords: propertyMetadata.keywords, structuredData: propertySchema })), breadcrumbs.length > 0 && ((0, jsx_runtime_1.jsx)("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
                    __html: JSON.stringify(seo_1.generateStructuredData.breadcrumb(breadcrumbs)),
                } })), (0, jsx_runtime_1.jsxs)("section", { className: "!pt-24 sm:!pt-32 lg:!pt-44 pb-12 sm:pb-16 lg:pb-20 relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto max-w-8xl px-4 sm:px-5 2xl:px-0", children: [(0, jsx_runtime_1.jsx)("nav", { className: "mb-6 sm:mb-8 overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("ol", { className: "flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/", className: "hover:text-primary", children: "Home" }) }), (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:caret-right", className: "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/properties", className: "hover:text-primary", children: "Properties" }) }), (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:caret-right", className: "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: `/properties/${type}`, className: "hover:text-primary", children: capitalizeFirst(type) }) }), (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:caret-right", className: "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("li", { className: "text-dark dark:text-white truncate", children: property.name })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-12 items-start gap-6 lg:gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 sm:mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl sm:text-32 md:text-40 lg:text-52 font-semibold text-dark dark:text-white mb-2 sm:mb-3 leading-tight", children: property.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start sm:items-center gap-2 mb-4 sm:mb-6", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:map-pin", width: 20, height: 20, className: "text-dark/50 dark:text-white/50 flex-shrink-0 mt-0.5 sm:mt-0 sm:w-6 sm:h-6" }), (0, jsx_runtime_1.jsx)("p", { className: "text-dark/50 dark:text-white/50 text-base sm:text-lg leading-relaxed", children: property.location })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-4 sm:mb-6", children: formatPrice() }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:bed-linear", width: 18, height: 18, className: "sm:w-5 sm:h-5" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm sm:text-base text-dark dark:text-white", children: [property.beds, " ", property.beds === 1 ? "Bedroom" : "Bedrooms"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:bath-linear", width: 18, height: 18, className: "sm:w-5 sm:h-5" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm sm:text-base text-dark dark:text-white", children: [property.baths, " ", property.baths === 1 ? "Bathroom" : "Bathrooms"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "lineicons:arrow-all-direction", width: 18, height: 18, className: "sm:w-5 sm:h-5" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm sm:text-base text-dark dark:text-white", children: [property.area, "m\u00B2"] })] })] })] }), property.images && property.images.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 sm:mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 group cursor-pointer", onClick: () => setShowImageModal(true), children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: property.images[currentImageIndex]?.src ||
                                                                    property.images[0].src, alt: property.images[currentImageIndex]?.alt || property.name, width: 800, height: 500, className: "w-full h-56 sm:h-80 lg:h-96 xl:h-[500px] object-cover group-hover:scale-105 transition-transform duration-300", unoptimized: true }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/50 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:magnifying-glass-plus", width: 16, height: 16, className: "sm:w-5 sm:h-5" }) }), property.images.length > 1 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                                                            e.stopPropagation();
                                                                            prevImage();
                                                                        }, className: "absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:caret-left", width: 16, height: 16, className: "sm:w-5 sm:h-5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                                                            e.stopPropagation();
                                                                            nextImage();
                                                                        }, className: "absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:caret-right", width: 16, height: 16, className: "sm:w-5 sm:h-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm", children: [currentImageIndex + 1, " / ", property.images.length] })] }))] }), property.images.length > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-1.5 sm:gap-2 overflow-x-auto pb-2", children: property.images.map((image, index) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentImageIndex(index), className: `flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${currentImageIndex === index
                                                                ? "border-primary"
                                                                : "border-transparent"}`, children: (0, jsx_runtime_1.jsx)(image_1.default, { src: image.src, alt: image.alt || `Image ${index + 1}`, width: 80, height: 80, className: "w-full h-full object-cover", unoptimized: true }) }, index))) }))] })), property.description && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 sm:mb-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg sm:text-xl font-medium text-dark dark:text-white mb-3 sm:mb-4", children: "Description" }), (0, jsx_runtime_1.jsx)("p", { className: "text-dark/70 dark:text-white/70 leading-relaxed text-sm sm:text-base", children: property.description })] })), property.features && property.features.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 sm:mb-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg sm:text-xl font-medium text-dark dark:text-white mb-3 sm:mb-4", children: "Features" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3", children: property.features.map((feature, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-dark dark:text-white", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:check-circle", className: "text-green-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs sm:text-sm", children: feature })] }, index))) })] })), property.amenities && property.amenities.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 sm:mb-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg sm:text-xl font-medium text-dark dark:text-white mb-3 sm:mb-4", children: "Amenities" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3", children: property.amenities.map((amenity, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-dark dark:text-white", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:star", className: "text-yellow-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs sm:text-sm", children: amenity })] }, index))) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-4 space-y-4 sm:space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg sm:text-xl font-semibold text-dark dark:text-white mb-3 sm:mb-4", children: "Property Details" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 sm:space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-gray-600 dark:text-gray-400", children: "Price" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-sm sm:text-base text-dark dark:text-white", children: formatPrice() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-gray-600 dark:text-gray-400", children: "Property Type" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-sm sm:text-base text-dark dark:text-white capitalize", children: typeof property.propertyType === "object"
                                                                            ? property.propertyType?.name
                                                                            : property.propertyType || "Property" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-gray-600 dark:text-gray-400", children: "Status" }), (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${property.status === "for-sale"
                                                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                                            : property.status === "for-rent"
                                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                                : property.status === "sold"
                                                                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                                                                    : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"}`, children: property.status?.replace("-", " ") || "Available" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-gray-600 dark:text-gray-400", children: "Bedrooms" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-sm sm:text-base text-dark dark:text-white", children: property.beds })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-gray-600 dark:text-gray-400", children: "Bathrooms" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-sm sm:text-base text-dark dark:text-white", children: property.baths })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-gray-600 dark:text-gray-400", children: "Area" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-sm sm:text-base text-dark dark:text-white", children: [property.area, "m\u00B2"] })] }), property.isFeatured && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-gray-600 dark:text-gray-400", children: "Featured" }), (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:star-fill", className: "text-yellow-500 w-4 h-4 sm:w-5 sm:h-5" })] }))] })] }), isInquiryFormEnabled && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg sm:text-xl font-semibold text-dark dark:text-white mb-3 sm:mb-4", children: "Interested in this property?" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleContactSubmit, className: "space-y-3 sm:space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("input", { type: "text", name: "name", placeholder: "Your Name", value: contactForm.name, onChange: handleContactChange, required: true, className: "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("input", { type: "email", name: "email", placeholder: "Your Email", value: contactForm.email, onChange: handleContactChange, required: true, className: "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("input", { type: "tel", name: "phone", placeholder: "Your Phone", value: contactForm.phone, onChange: handleContactChange, className: "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("input", { type: "text", name: "budget", placeholder: "Budget Range (e.g., $100k - $200k)", value: contactForm.budget, onChange: handleContactChange, className: "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("input", { type: "text", name: "timeline", placeholder: "Timeline (e.g., 3-6 months)", value: contactForm.timeline, onChange: handleContactChange, className: "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("textarea", { name: "message", placeholder: "Your Message", rows: 3, value: contactForm.message, onChange: handleContactChange, required: true, className: "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base" }) }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: contactLoading, className: "cursor-pointer w-full bg-primary text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base", children: contactLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), "Sending..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:paper-plane-tilt", className: "w-4 h-4" }), "Send Inquiry"] })) })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg sm:text-xl font-semibold text-dark dark:text-white mb-3 sm:mb-4", children: "Quick Actions" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 sm:space-y-3", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: `/properties/${type}`, className: "w-full bg-gray-100 dark:bg-gray-700 text-dark dark:text-white text-center py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:arrow-left", className: "w-4 h-4" }), "Back to ", capitalizeFirst(type), " Properties"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => window.print(), className: "w-full bg-gray-100 dark:bg-gray-700 text-dark dark:text-white text-center py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:printer", className: "w-4 h-4" }), "Print Details"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                                                    if (navigator.share) {
                                                                        navigator.share({
                                                                            title: property.name,
                                                                            text: `Check out this ${typeof property.propertyType === "object"
                                                                                ? property.propertyType?.name
                                                                                : property.propertyType || "property"} in ${property.location}`,
                                                                            url: window.location.href,
                                                                        });
                                                                    }
                                                                    else {
                                                                        navigator.clipboard.writeText(window.location.href);
                                                                        alert("Property URL copied to clipboard!");
                                                                    }
                                                                }, className: "w-full bg-gray-100 dark:bg-gray-700 text-dark dark:text-white text-center py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:share", className: "w-4 h-4" }), "Share Property"] })] })] })] })] }), relatedProperties.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-12 sm:mt-14 lg:mt-16", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl sm:text-2xl lg:text-3xl font-semibold text-dark dark:text-white mb-6 sm:mb-8 text-center", children: "Similar Properties" }), relatedLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6", children: [...Array(4)].map((_, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full h-40 sm:h-48 bg-gray-300 dark:bg-gray-600" }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 sm:p-4 space-y-2 sm:space-y-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 sm:h-6 bg-gray-300 dark:bg-gray-600 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 sm:h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 sm:gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-10 sm:w-12" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-10 sm:w-12" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-12 sm:w-16" })] })] })] }, index))) })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6", children: relatedProperties.map((relatedProperty) => ((0, jsx_runtime_1.jsx)(PropertyCard_1.default, { property: relatedProperty }, relatedProperty._id))) })), relatedProperties.length >= 4 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center mt-6 sm:mt-8", children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: `/properties/${type}`, className: "inline-flex items-center gap-2 bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base", children: ["View All ", capitalizeFirst(type), " Properties", (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:arrow-right", className: "w-4 h-4" })] }) }))] }))] }), showImageModal && property?.images && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative max-w-4xl w-full", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setShowImageModal(false), className: "absolute -top-12 right-0 text-white p-2 rounded-full hover:bg-white/20 transition-colors", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:x", width: 24, height: 24 }) }), (0, jsx_runtime_1.jsx)(image_1.default, { src: property.images[currentImageIndex]?.src ||
                                        property.images[0].src, alt: property.images[currentImageIndex]?.alt || property.name, width: 1200, height: 800, className: "w-full h-auto max-h-[80vh] object-contain rounded-lg", unoptimized: true }), property.images.length > 1 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: prevImage, className: "absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/40 transition-colors", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:caret-left", width: 24, height: 24 }) }), (0, jsx_runtime_1.jsx)("button", { onClick: nextImage, className: "absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/40 transition-colors", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:caret-right", width: 24, height: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full", children: [currentImageIndex + 1, " / ", property.images.length] })] }))] }) })), showBackToTop && ((0, jsx_runtime_1.jsx)("button", { onClick: scrollToTop, className: "fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 z-40", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:arrow-up", width: 20, height: 20 }) }))] })] }));
}
//# sourceMappingURL=page.js.map