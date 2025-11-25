"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.PUT = PUT;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const server_1 = require("next/server");
async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const { db } = await (0, mongodb_1.default)();
        const domain = process.env.NEXT_PUBLIC_DOMAIN || request.headers.get("host");
        const page = await db.collection("pages").findOne({
            domain,
            slug: slug,
        });
        if (!page) {
            return server_1.NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
        }
        return server_1.NextResponse.json({
            success: true,
            page: {
                title: page.title,
                slug: page.slug,
                content: page.content,
                updatedAt: page.updatedAt,
            },
        });
    }
    catch (error) {
        console.error("Error fetching page:", error);
        return server_1.NextResponse.json({ success: false, error: "Failed to fetch page" }, { status: 500 });
    }
}
async function PUT(request, { params }) {
    try {
        const { slug } = await params;
        const { db } = await (0, mongodb_1.default)();
        const domain = process.env.NEXT_PUBLIC_DOMAIN || request.headers.get("host");
        const { content } = await request.json();
        if (!content || typeof content !== "string") {
            return server_1.NextResponse.json({ success: false, error: "Content is required" }, { status: 400 });
        }
        // Determine title based on slug
        const titleMap = {
            "privacy-policy": "Privacy Policy",
            "terms-of-service": "Terms of Service",
        };
        const title = titleMap[slug] || slug;
        // Update or create page
        const result = await db.collection("pages").updateOne({ domain, slug: slug }, {
            $set: {
                content,
                title,
                slug: slug,
                domain,
                updatedAt: new Date(),
            },
            $setOnInsert: {
                createdAt: new Date(),
            },
        }, { upsert: true });
        return server_1.NextResponse.json({
            success: true,
            message: "Page updated successfully",
        });
    }
    catch (error) {
        console.error("Error updating page:", error);
        return server_1.NextResponse.json({ success: false, error: "Failed to update page" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map