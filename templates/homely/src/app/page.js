"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const jsx_runtime_1 = require("react/jsx-runtime");
const FAQs_1 = __importDefault(require("@/components/Home/FAQs"));
const FeaturedProperty_1 = __importDefault(require("@/components/Home/FeaturedProperty"));
const GetInTouch_1 = __importDefault(require("@/components/Home/GetInTouch"));
const Hero_1 = __importDefault(require("@/components/Home/Hero"));
const Properties_1 = __importDefault(require("@/components/Home/Properties"));
const Services_1 = __importDefault(require("@/components/Home/Services"));
const Testimonial_1 = __importDefault(require("@/components/Home/Testimonial"));
const Blog_1 = __importDefault(require("@/components/shared/Blog"));
const SEOComponent_1 = __importDefault(require("@/components/shared/SEOComponent"));
const useSettings_1 = require("@/hooks/useSettings");
const seo_1 = require("@/lib/seo");
const react_1 = require("react");
function Home() {
    const { isBlogEnabled } = (0, useSettings_1.useSettings)();
    const homeMetadata = seo_1.generatePageMetadata.homepage();
    (0, react_1.useEffect)(() => {
        // Track homepage view for analytics
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "page_view", {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
            });
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(SEOComponent_1.default, { title: homeMetadata.title, description: homeMetadata.description, canonical: seo_1.SEO_CONFIG.WEBSITE_URL, ogImage: seo_1.SEO_CONFIG.DEFAULT_OG_IMAGE, keywords: homeMetadata.keywords, structuredData: seo_1.generateStructuredData.organization() }), (0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsx)(Hero_1.default, {}), (0, jsx_runtime_1.jsx)(Services_1.default, {}), (0, jsx_runtime_1.jsx)(Properties_1.default, {}), (0, jsx_runtime_1.jsx)(FeaturedProperty_1.default, {}), (0, jsx_runtime_1.jsx)(Testimonial_1.default, {}), isBlogEnabled && (0, jsx_runtime_1.jsx)(Blog_1.default, {}), (0, jsx_runtime_1.jsx)(GetInTouch_1.default, {}), (0, jsx_runtime_1.jsx)(FAQs_1.default, {})] })] }));
}
//# sourceMappingURL=page.js.map