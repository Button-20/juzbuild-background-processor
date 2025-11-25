"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const PropertyList_1 = __importDefault(require("@/components/Properties/PropertyList"));
const HeroSub_1 = __importDefault(require("@/components/shared/HeroSub"));
const seo_1 = require("@/lib/seo");
const script_1 = __importDefault(require("next/script"));
// Enhanced metadata with SEO
exports.metadata = {
    ...seo_1.generatePageMetadata.properties(),
};
const page = () => {
    // Generate structured data for properties page
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Properties for Sale in ${seo_1.SEO_CONFIG.PRIMARY_LOCATION}`,
        description: `Browse our extensive collection of properties for sale in ${seo_1.SEO_CONFIG.PRIMARY_LOCATION}. Find your dream home with ${seo_1.SEO_CONFIG.COMPANY_NAME}.`,
        url: `${seo_1.SEO_CONFIG.WEBSITE_URL}/properties`,
        mainEntity: {
            "@type": "ItemList",
            name: `${seo_1.SEO_CONFIG.PRIMARY_LOCATION} Property Listings`,
            description: `Real estate listings in ${seo_1.SEO_CONFIG.PRIMARY_LOCATION}`,
        },
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: seo_1.SEO_CONFIG.WEBSITE_URL,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Properties",
                    item: `${seo_1.SEO_CONFIG.WEBSITE_URL}/properties`,
                },
            ],
        },
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(script_1.default, { id: "properties-schema", type: "application/ld+json", dangerouslySetInnerHTML: {
                    __html: JSON.stringify(websiteSchema),
                } }), (0, jsx_runtime_1.jsx)(HeroSub_1.default, { title: `Discover Properties in ${seo_1.SEO_CONFIG.PRIMARY_LOCATION}`, description: `Experience elegance and comfort with our exclusive properties in ${seo_1.SEO_CONFIG.PRIMARY_LOCATION}, designed for sophisticated living.`, badge: "Properties" }), (0, jsx_runtime_1.jsx)(PropertyList_1.default, {})] }));
};
exports.default = page;
//# sourceMappingURL=page.js.map