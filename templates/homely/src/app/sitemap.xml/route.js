"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const seo_1 = require("@/lib/seo");
const server_1 = require("next/server");
// This will be dynamically populated with user's properties during build
const getAllProperties = async () => {
    try {
        // In production, this would fetch from the user's database
        // For template, we'll return empty array - will be replaced during build
        return [];
    }
    catch (error) {
        console.error("Failed to fetch properties for sitemap:", error);
        return [];
    }
};
async function GET() {
    try {
        const properties = await getAllProperties();
        const sitemapData = (0, seo_1.generateSitemapData)(properties);
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapData.staticPages
            .map((page) => `
  <url>
    <loc>${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`)
            .join("")}
  ${sitemapData.dynamicPages
            .map((page) => `
  <url>
    <loc>${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    <lastmod>${page.lastmod}</lastmod>
  </url>`)
            .join("")}
</urlset>`;
        return new server_1.NextResponse(sitemap, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
            },
        });
    }
    catch (error) {
        console.error("Error generating sitemap:", error);
        return new server_1.NextResponse("Error generating sitemap", { status: 500 });
    }
}
//# sourceMappingURL=route.js.map