"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.PUT = PUT;
const AboutService_1 = require("@/services/AboutService");
const server_1 = require("next/server");
async function GET() {
    try {
        const aboutPage = await AboutService_1.AboutService.get();
        if (!aboutPage) {
            // Return defaults if not found
            return server_1.NextResponse.json({
                success: true,
                aboutPage: await AboutService_1.AboutService.upsert({}),
            });
        }
        return server_1.NextResponse.json({
            success: true,
            aboutPage,
        });
    }
    catch (error) {
        console.error("About page GET error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
async function PUT(req) {
    try {
        const body = await req.json();
        const aboutPage = await AboutService_1.AboutService.upsert(body);
        return server_1.NextResponse.json({
            success: true,
            aboutPage,
        });
    }
    catch (error) {
        console.error("About page PUT error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map