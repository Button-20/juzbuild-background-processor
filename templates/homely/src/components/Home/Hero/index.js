"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const currency_1 = require("@/lib/currency");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const react_1 = require("react");
const Hero = () => {
    const [properties, setProperties] = (0, react_1.useState)([]);
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [fadeClass, setFadeClass] = (0, react_1.useState)("opacity-100");
    (0, react_1.useEffect)(() => {
        // Fetch featured properties from API
        const fetchFeaturedProperties = async () => {
            try {
                const response = await fetch("/api/properties?featured=true&limit=5");
                const data = await response.json();
                if (data && data.length > 0) {
                    setProperties(data);
                }
                else {
                    // Fallback to static data if no properties found
                    setProperties([
                        {
                            _id: "1",
                            name: "Futuristic Haven",
                            location: "Palm Springs, CA",
                            price: 4750000,
                            currency: "USD",
                            beds: 4,
                            baths: 4,
                            area: 3500,
                            images: [
                                {
                                    src: "/images/hero/heroBanner.png",
                                    alt: "Property Image",
                                    isMain: true,
                                },
                            ],
                            slug: "futuristic-haven",
                        },
                    ]);
                }
                setIsLoading(false);
            }
            catch (error) {
                console.error("Error fetching properties:", error);
                // Fallback to static data
                setProperties([
                    {
                        _id: "1",
                        name: "Futuristic Haven",
                        location: "Palm Springs, CA",
                        price: 4750000,
                        currency: "USD",
                        beds: 4,
                        baths: 4,
                        area: 3500,
                        images: [
                            {
                                src: "/images/hero/heroBanner.png",
                                alt: "Property Image",
                                isMain: true,
                            },
                        ],
                        slug: "futuristic-haven",
                    },
                ]);
                setIsLoading(false);
            }
        };
        fetchFeaturedProperties();
    }, []);
    (0, react_1.useEffect)(() => {
        if (properties.length > 1) {
            const interval = setInterval(() => {
                setFadeClass("opacity-0");
                setTimeout(() => {
                    setCurrentIndex((prevIndex) => prevIndex === properties.length - 1 ? 0 : prevIndex + 1);
                    setFadeClass("opacity-100");
                }, 500);
            }, 4000); // Change every 4 seconds
            return () => clearInterval(interval);
        }
    }, [properties.length]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "!py-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-b from-skyblue via-lightskyblue dark:via-[#4298b0] to-white/10 dark:to-black/10 overflow-hidden relative", children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-60 md:pb-68", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative text-white dark:text-dark text-center md:text-start z-10 animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-white/20 rounded w-32 mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-20 bg-white/20 rounded w-3/4 mb-6" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 bg-white/20 rounded-full w-32" }), (0, jsx_runtime_1.jsx)("div", { className: "h-12 bg-white/20 rounded-full w-32" })] })] }) }) }) }));
    }
    const currentProperty = properties[currentIndex];
    const mainImage = currentProperty?.images?.find((img) => img.isMain) ||
        currentProperty?.images?.[0];
    return ((0, jsx_runtime_1.jsx)("section", { className: "!py-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-b from-skyblue via-lightskyblue dark:via-[#4298b0] to-white/10 dark:to-black/10 overflow-hidden relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-60 md:pb-68", children: [(0, jsx_runtime_1.jsxs)("div", { className: `relative text-white dark:text-dark text-center md:text-start z-10 transition-opacity duration-500 ${fadeClass}`, children: [(0, jsx_runtime_1.jsx)("p", { className: "text-inherit text-xm font-medium", children: currentProperty?.location || "Location not available" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-inherit text-6xl sm:text-9xl font-semibold -tracking-wider md:max-w-45p mt-4 mb-6", children: currentProperty?.name || "Property Name" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col xs:flex-row justify-center md:justify-start gap-4", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/contactus", className: "px-8 py-4 border border-white dark:border-dark bg-white dark:bg-dark text-dark dark:text-white duration-300 dark:hover:text-dark hover:bg-transparent hover:text-white text-base font-semibold rounded-full hover:cursor-pointer", children: "Get in touch" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: `/properties/${(typeof currentProperty?.propertyType === "string"
                                                ? currentProperty.propertyType
                                                : currentProperty?.propertyType?.slug) || "property"}/${currentProperty?.slug}`, className: "px-8 py-4 border border-white dark:border-dark bg-transparent text-white dark:text-dark hover:bg-white dark:hover:bg-dark dark:hover:text-white hover:text-dark duration-300 text-base font-semibold rounded-full hover:cursor-pointer", children: "View Details" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "hidden md:block absolute -top-2 -right-68 w-[1082px] h-[1016px]", children: mainImage && ((0, jsx_runtime_1.jsx)("div", { className: `w-full h-full transition-opacity duration-500 ${fadeClass}`, children: (0, jsx_runtime_1.jsx)(image_1.default, { src: mainImage.src, alt: mainImage.alt || currentProperty?.name || "Property", width: 1082, height: 1016, priority: false, unoptimized: true, className: "w-full h-full object-cover" }) })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:absolute bottom-0 md:-right-68 xl:right-0 bg-white dark:bg-black py-12 px-8 mobile:px-16 md:pl-16 md:pr-[295px] rounded-2xl md:rounded-none md:rounded-tl-2xl mt-24", children: [(0, jsx_runtime_1.jsxs)("div", { className: `grid grid-cols-2 sm:grid-cols-4 md:flex gap-10 md:gap-24 sm:text-center dark:text-white text-black transition-opacity duration-500 ${fadeClass}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:items-center gap-3", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/sofa.svg", alt: "sofa", width: 32, height: 32, className: "block dark:hidden", unoptimized: true }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/dark-sofa.svg", alt: "sofa", width: 32, height: 32, className: "hidden dark:block", unoptimized: true }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm sm:text-base font-normal text-inherit", children: [currentProperty?.beds || 4, " Bedrooms"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:items-center gap-3", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/tube.svg", alt: "bathroom", width: 32, height: 32, className: "block dark:hidden", unoptimized: true }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/dark-tube.svg", alt: "bathroom", width: 32, height: 32, className: "hidden dark:block", unoptimized: true }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm sm:text-base font-normal text-inherit", children: [currentProperty?.baths || 4, " Restrooms"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:items-center gap-3", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/parking.svg", alt: "parking", width: 32, height: 32, className: "block dark:hidden", unoptimized: true }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/images/hero/dark-parking.svg", alt: "parking", width: 32, height: 32, className: "hidden dark:block", unoptimized: true }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base font-normal text-inherit", children: currentProperty?.area
                                                ? `${currentProperty.area} sqft`
                                                : "Parking space" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:items-center gap-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-2xl sm:text-3xl font-medium text-inherit", children: currentProperty?.price
                                                ? (0, currency_1.formatCurrencyLegacy)(currentProperty.price, currentProperty.currency || "GHS")
                                                : "₵4,750,000" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base font-normal text-black/50 dark:text-white/50", children: "For selling price" })] })] }), properties.length > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mt-6 gap-2", children: properties.map((_, index) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                    setFadeClass("opacity-0");
                                    setTimeout(() => {
                                        setCurrentIndex(index);
                                        setFadeClass("opacity-100");
                                    }, 250);
                                }, className: `w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-primary scale-125"
                                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"}`, "aria-label": `Go to property ${index + 1}` }, index))) }))] })] }) }));
};
exports.default = Hero;
//# sourceMappingURL=index.js.map