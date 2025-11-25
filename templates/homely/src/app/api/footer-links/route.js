"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const footerlinks_1 = require("@/app/api/footerlinks");
const server_1 = require("next/server");
async function GET() {
    try {
        const footerLinks = await (0, footerlinks_1.getFooterLinks)();
        return server_1.NextResponse.json({
            success: true,
            footerLinks,
        });
    }
    catch (error) {
        // Fallback to hardcoded links
        const fallbackLinks = [
            { label: "Villas", href: "/properties/villa" },
            { label: "Apartments", href: "/properties/apartment" },
            { label: "Offices", href: "/properties/office" },
            { label: "All Properties", href: "/properties" },
            { label: "Blog", href: "/blogs" },
            { label: "Contact Us", href: "/contactus" },
            { label: "About Us", href: "/#about" },
        ];
        return server_1.NextResponse.json({
            success: true,
            footerLinks: fallbackLinks,
        });
    }
}
//# sourceMappingURL=route.js.map