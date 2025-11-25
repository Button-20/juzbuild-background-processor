"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const services_1 = require("@/services");
const server_1 = require("next/server");
async function GET() {
    try {
        // Get basic property stats using PropertyService
        const stats = await services_1.PropertyService.getStats();
        return server_1.NextResponse.json(stats);
    }
    catch (error) {
        console.error("Stats API error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map