"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const carousel_1 = require("@/components/ui/carousel");
const currency_1 = require("@/lib/currency");
const react_1 = require("@iconify/react");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const React = __importStar(require("react"));
const FeaturedProperty = () => {
    const [api, setApi] = React.useState(undefined);
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [featuredProperty, setFeaturedProperty] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        const fetchFeaturedProperty = async () => {
            try {
                const response = await fetch("/api/properties/featured");
                if (response.ok) {
                    const data = await response.json();
                    setFeaturedProperty(data.property);
                }
                else {
                    console.error("Failed to fetch featured property");
                }
            }
            catch (error) {
                console.error("Error fetching featured property:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchFeaturedProperty();
    }, []);
    React.useEffect(() => {
        if (!api || !featuredProperty?.images) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api, featuredProperty]);
    const handleDotClick = (index) => {
        if (api) {
            api.scrollTo(index);
        }
    };
    const formatPrice = (property) => {
        if (property.rate) {
            return `$${property.rate}`;
        }
        if (property.price && property.currency) {
            // Use our new currency formatting utility for consistent Ghana Cedis display
            return (0, currency_1.formatCurrencyLegacy)(property.price, property.currency);
        }
        return "Price on request";
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("section", { children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-2 gap-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-200 dark:bg-gray-700 rounded-2xl w-full h-540" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8" }), (0, jsx_runtime_1.jsx)("div", { className: "h-20 bg-gray-200 dark:bg-gray-700 rounded" })] }) })] }) }) }));
    }
    if (!featuredProperty) {
        return ((0, jsx_runtime_1.jsx)("section", { children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-16", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple", className: "text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-500 dark:text-gray-400", children: "No featured property available at the moment." })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)("section", { className: "py-12 sm:py-16 lg:py-20", children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-4 sm:px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-2 gap-8 lg:gap-10 items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative order-2 lg:order-1", children: [(0, jsx_runtime_1.jsx)(carousel_1.Carousel, { setApi: setApi, opts: {
                                    loop: true,
                                }, children: (0, jsx_runtime_1.jsx)(carousel_1.CarouselContent, { children: featuredProperty.images?.map((image, index) => ((0, jsx_runtime_1.jsx)(carousel_1.CarouselItem, { children: (0, jsx_runtime_1.jsx)(image_1.default, { src: image.src, alt: image.alt || featuredProperty.name, width: 680, height: 530, className: "rounded-2xl w-full h-64 sm:h-80 lg:h-540 object-cover", unoptimized: true }) }, index))) }) }), featuredProperty.images && featuredProperty.images.length > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "absolute left-1/2 transform -translate-x-1/2 lg:left-2/5 lg:transform-none bg-dark/50 rounded-full py-2 sm:py-2.5 bottom-4 sm:bottom-6 lg:bottom-10 flex justify-center mt-4 gap-2 sm:gap-2.5 px-2 sm:px-2.5", children: Array.from({ length: count }).map((_, index) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleDotClick(index), className: `w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${current === index + 1 ? "bg-white" : "bg-white/50"}` }, index))) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6 sm:gap-8 lg:gap-10 order-1 lg:order-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-dark/75 dark:text-white/75 text-sm sm:text-base font-semibold flex gap-2 mb-3 sm:mb-4", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", className: "text-xl sm:text-2xl text-primary" }), "Featured property"] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl sm:text-3xl lg:text-52 font-medium text-dark dark:text-white mb-3 sm:mb-4", children: featuredProperty.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:map-pin", width: 20, height: 20, className: "text-dark/50 dark:text-white/50 sm:w-7 sm:h-7 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("p", { className: "text-dark/50 dark:text-white/50 text-sm sm:text-base", children: featuredProperty.location })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base text-dark/50 dark:text-white/50 leading-relaxed", children: featuredProperty.description ||
                                    `Experience luxury living at ${featuredProperty.name}, located at ${featuredProperty.location}. This beautiful ${typeof featuredProperty.propertyType === "object"
                                        ? featuredProperty.propertyType?.name
                                        : featuredProperty.propertyType || "property"} offers ${featuredProperty.beds} bedrooms, ${featuredProperty.baths} bathrooms, and ${featuredProperty.area} sq ft of spacious living space.` }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 sm:gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-dark/5 dark:bg-white/5 p-2 sm:p-2.5 rounded-[6px] flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/sofa.svg", alt: "sofa", width: 20, height: 20, className: "block dark:hidden sm:w-6 sm:h-6", unoptimized: true }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/dark-sofa.svg", alt: "sofa", width: 20, height: 20, className: "hidden dark:block sm:w-6 sm:h-6", unoptimized: true })] }), (0, jsx_runtime_1.jsxs)("h6", { className: "text-sm sm:text-base text-dark dark:text-white", children: [featuredProperty.beds, " Bedroom", featuredProperty.beds !== 1 ? "s" : ""] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 sm:gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-dark/5 dark:bg-white/5 p-2 sm:p-2.5 rounded-[6px] flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/tube.svg", alt: "tube", width: 20, height: 20, className: "block dark:hidden sm:w-6 sm:h-6", unoptimized: true }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/dark-tube.svg", alt: "tube", width: 20, height: 20, className: "hidden dark:block sm:w-6 sm:h-6", unoptimized: true })] }), (0, jsx_runtime_1.jsxs)("h6", { className: "text-sm sm:text-base text-dark dark:text-white", children: [featuredProperty.baths, " Bathroom", featuredProperty.baths !== 1 ? "s" : ""] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 sm:gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-dark/5 dark:bg-white/5 p-2 sm:p-2.5 rounded-[6px] flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/parking.svg", alt: "parking", width: 20, height: 20, className: "block dark:hidden sm:w-6 sm:h-6", unoptimized: true }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/dark-parking.svg", alt: "parking", width: 20, height: 20, className: "hidden dark:block sm:w-6 sm:h-6", unoptimized: true })] }), (0, jsx_runtime_1.jsxs)("h6", { className: "text-sm sm:text-base text-dark dark:text-white", children: [featuredProperty.area, " sq ft"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 sm:gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-dark/5 dark:bg-white/5 p-2 sm:p-2.5 rounded-[6px] flex-shrink-0", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", width: 20, height: 20, className: "text-dark/50 dark:text-white/50 sm:w-6 sm:h-6" }) }), (0, jsx_runtime_1.jsx)("h6", { className: "capitalize text-sm sm:text-base text-dark dark:text-white", children: typeof featuredProperty.propertyType === "object"
                                                    ? featuredProperty.propertyType?.name
                                                    : featuredProperty.propertyType || "Property" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-10 items-start sm:items-center", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/contactus", className: "py-3 sm:py-4 px-6 sm:px-8 bg-primary hover:bg-dark duration-300 rounded-full text-white text-sm sm:text-base font-medium inline-block text-center", children: "Get in touch" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xl sm:text-2xl lg:text-3xl text-dark dark:text-white font-medium", children: formatPrice(featuredProperty) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base text-dark/50 dark:text-white/50", children: featuredProperty.status === "for-sale"
                                                    ? "For Sale"
                                                    : "For Rent" })] })] })] })] }) }) }));
};
exports.default = FeaturedProperty;
//# sourceMappingURL=index.js.map