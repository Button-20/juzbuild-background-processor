"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const ConditionalLayout_1 = __importDefault(require("@/components/Layout/ConditionalLayout"));
const ChatWidgets_1 = __importDefault(require("@/components/shared/ChatWidgets"));
const seo_1 = require("@/lib/seo");
const next_themes_1 = require("next-themes");
const google_1 = require("next/font/google");
const script_1 = __importDefault(require("next/script"));
const nextjs_toploader_1 = __importDefault(require("nextjs-toploader"));
require("./globals.css");
const font = (0, google_1.Bricolage_Grotesque)({ subsets: ["latin"] });
// Enhanced metadata with dynamic SEO
exports.metadata = {
    metadataBase: new URL(seo_1.SEO_CONFIG.WEBSITE_URL),
    ...seo_1.generatePageMetadata.homepage(),
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon.png", type: "image/png", sizes: "192x192" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "{{GOOGLE_VERIFICATION_CODE}}", // Will be replaced with user's verification code
        other: {
            "facebook-domain-verification": "{{FACEBOOK_VERIFICATION_CODE}}",
        },
    },
};
function RootLayout({ children, }) {
    const organizationSchema = seo_1.generateStructuredData.organization();
    return ((0, jsx_runtime_1.jsxs)("html", { lang: "en", children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)(script_1.default, { id: "organization-schema", type: "application/ld+json", dangerouslySetInnerHTML: {
                            __html: JSON.stringify(organizationSchema),
                        } }), (0, jsx_runtime_1.jsx)("meta", { name: "geo.region", content: "{{GEO_REGION}}" }), (0, jsx_runtime_1.jsx)("meta", { name: "geo.placename", content: "{{GEO_PLACENAME}}" }), (0, jsx_runtime_1.jsx)("meta", { name: "geo.position", content: "{{GEO_POSITION}}" }), (0, jsx_runtime_1.jsx)("meta", { name: "ICBM", content: "{{GEO_POSITION}}" }), (0, jsx_runtime_1.jsx)(script_1.default, { src: "https://www.googletagmanager.com/gtag/js?id={{GA_TRACKING_ID}}", strategy: "afterInteractive" }), (0, jsx_runtime_1.jsx)(script_1.default, { id: "google-analytics", strategy: "afterInteractive", children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '{{GA_TRACKING_ID}}');
          ` }), (0, jsx_runtime_1.jsx)(script_1.default, { id: "facebook-pixel", strategy: "afterInteractive", children: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{FACEBOOK_PIXEL_ID}}');
            fbq('track', 'PageView');
          ` }), (0, jsx_runtime_1.jsx)("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), (0, jsx_runtime_1.jsx)("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }), (0, jsx_runtime_1.jsx)("link", { rel: "dns-prefetch", href: "//images.unsplash.com" }), (0, jsx_runtime_1.jsx)("link", { rel: "dns-prefetch", href: "//res.cloudinary.com" })] }), (0, jsx_runtime_1.jsxs)("body", { className: `${font.className} bg-white dark:bg-black antialiased`, children: [(0, jsx_runtime_1.jsx)(nextjs_toploader_1.default, { color: "#07be8a" }), (0, jsx_runtime_1.jsxs)(next_themes_1.ThemeProvider, { attribute: "class", enableSystem: true, defaultTheme: "light", children: [(0, jsx_runtime_1.jsx)(ConditionalLayout_1.default, { children: children }), (0, jsx_runtime_1.jsx)(ChatWidgets_1.default, {})] })] })] }));
}
//# sourceMappingURL=layout.js.map