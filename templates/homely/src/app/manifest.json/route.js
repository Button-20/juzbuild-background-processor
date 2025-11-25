"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const seo_1 = require("@/lib/seo");
const server_1 = require("next/server");
async function GET() {
    const manifest = {
        name: seo_1.SEO_CONFIG.WEBSITE_NAME || seo_1.SEO_CONFIG.COMPANY_NAME,
        short_name: seo_1.SEO_CONFIG.COMPANY_NAME,
        description: seo_1.SEO_CONFIG.COMPANY_DESCRIPTION,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#07be8a",
        orientation: "portrait",
        scope: "/",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any maskable",
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
        categories: ["business", "lifestyle", "utilities"],
        screenshots: [
            {
                src: "/screenshot-wide.png",
                sizes: "1280x720",
                type: "image/png",
                form_factor: "wide",
            },
            {
                src: "/screenshot-narrow.png",
                sizes: "640x1136",
                type: "image/png",
                form_factor: "narrow",
            },
        ],
    };
    return new server_1.NextResponse(JSON.stringify(manifest, null, 2), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });
}
//# sourceMappingURL=route.js.map