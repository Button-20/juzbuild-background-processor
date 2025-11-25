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
const react_1 = require("@iconify/react");
const image_1 = __importDefault(require("next/image"));
const React = __importStar(require("react"));
const Testimonial = () => {
    const [api, setApi] = React.useState(undefined);
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [testimonials, setTestimonials] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch("/api/testimonials");
                if (response.ok) {
                    const data = await response.json();
                    setTestimonials(data.testimonials);
                }
                else {
                    console.error("Failed to fetch testimonials");
                }
            }
            catch (error) {
                console.error("Error fetching testimonials:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);
    React.useEffect(() => {
        if (!api || testimonials.length === 0)
            return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api, testimonials]);
    const handleDotClick = (index) => {
        if (api) {
            api.scrollTo(index);
        }
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("section", { className: "bg-dark relative overflow-hidden", id: "testimonial", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute right-0", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760939759/Vector_vwlrjp.png", alt: "victor", width: 700, height: 1039, unoptimized: true }) }), (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse py-16", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-700 rounded mb-4 w-48 mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "h-16 bg-gray-700 rounded mb-8 w-80 mx-auto" }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:flex items-center gap-11", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-11 lg:pr-20", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gray-700 rounded" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-32 bg-gray-700 rounded mb-8" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 bg-gray-700 rounded-full" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-700 rounded mb-2 w-32" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-700 rounded w-24" })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-96 bg-gray-700 rounded-2xl lg:block hidden" })] })] }) })] }));
    }
    if (testimonials.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("section", { className: "bg-dark relative overflow-hidden", id: "testimonial", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute right-0", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760939759/Vector_vwlrjp.png", alt: "victor", width: 700, height: 1039, unoptimized: true }) }), (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-16", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-white text-base font-semibold flex gap-2 justify-center mb-4", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", className: "text-2xl text-primary" }), "Testimonials"] }), (0, jsx_runtime_1.jsx)("h2", { className: "lg:text-52 text-40 font-medium text-white mb-8", children: "What our clients say" }), (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:chat-circle", className: "text-6xl text-gray-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-400", children: "No testimonials available at the moment." })] }) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("section", { className: "bg-dark relative overflow-hidden py-12 sm:py-16 lg:py-20", id: "testimonial", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute right-0 top-0", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760939759/Vector_vwlrjp.png", alt: "victor", width: 700, height: 1039, className: "opacity-30 lg:opacity-100", unoptimized: true }) }), (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-4 sm:px-5 2xl:px-0 relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center lg:text-left mb-8 sm:mb-12 lg:mb-16", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-white text-sm sm:text-base font-semibold flex gap-2 justify-center lg:justify-start mb-3 sm:mb-4", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple-fill", className: "text-xl sm:text-2xl text-primary" }), "Testimonials"] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-28 sm:text-32 lg:text-52 font-medium text-white", children: "What our clients say" })] }), (0, jsx_runtime_1.jsx)(carousel_1.Carousel, { setApi: setApi, opts: {
                            loop: true,
                        }, children: (0, jsx_runtime_1.jsx)(carousel_1.CarouselContent, { children: testimonials.map((item, index) => ((0, jsx_runtime_1.jsx)(carousel_1.CarouselItem, { className: "mt-4 sm:mt-6 lg:mt-9", children: (0, jsx_runtime_1.jsxs)("div", { className: "lg:flex items-center gap-8 lg:gap-11", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:gap-11 lg:pr-20 mb-8 lg:mb-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:house-simple", width: 24, height: 24, className: "text-primary sm:w-8 sm:h-8" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white text-lg sm:text-xl lg:text-3xl leading-relaxed mb-4 sm:mb-6 lg:mb-8", children: item.message || item.review || "Great service!" }), item.rating && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1 mb-4 sm:mb-6 lg:mb-8", children: [...Array(item.rating)].map((_, i) => ((0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:star-fill", className: "text-yellow-400 text-base sm:text-lg" }, i))) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 sm:gap-6", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: item.image, alt: item.name, width: 60, height: 60, className: "rounded-full lg:hidden block object-cover sm:w-20 sm:h-20", unoptimized: true }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h6", { className: "text-white text-sm sm:text-base font-medium mb-1", children: item.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-white/40 text-xs sm:text-sm", children: [item.role || item.position, item.company && `, ${item.company}`] })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full lg:w-auto lg:flex-shrink-0 rounded-2xl overflow-hidden", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: item.image, alt: item.name, width: 320, height: 320, className: "lg:block hidden object-cover w-full h-64 sm:h-80 lg:w-80 lg:h-80", unoptimized: true }) })] }) }, item._id || index))) }) }), count > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mt-8 sm:mt-12 lg:mt-16 gap-2 sm:gap-2.5", children: Array.from({ length: count }).map((_, index) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleDotClick(index), className: `w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-300 ${current === index + 1 ? "bg-white" : "bg-white/50"}`, "aria-label": `Go to slide ${index + 1}` }, index))) }))] })] }));
};
exports.default = Testimonial;
//# sourceMappingURL=index.js.map