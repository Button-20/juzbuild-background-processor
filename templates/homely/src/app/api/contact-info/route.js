"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
async function GET() {
    try {
        // Dynamically import server-side config
        const { getSiteConfig } = await import("@/lib/siteConfig");
        const config = await getSiteConfig();
        return server_1.NextResponse.json({
            success: true,
            logoUrl: config.logoUrl || "",
            contact: config.contact,
            social: config.social,
        });
    }
    catch (error) {
        console.error("Error fetching contact info:", error);
        return server_1.NextResponse.json({
            success: false,
            error: "Failed to fetch contact information",
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map