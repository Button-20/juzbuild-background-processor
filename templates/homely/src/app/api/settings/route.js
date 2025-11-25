"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const server_1 = require("next/server");
async function GET(request) {
    try {
        const { db } = await (0, mongodb_1.default)();
        const settingsCollection = db.collection("settings");
        // Fetch settings document
        const settings = await settingsCollection.findOne({});
        if (!settings) {
            return server_1.NextResponse.json({ error: "Settings not found" }, { status: 404 });
        }
        // Return settings data
        return server_1.NextResponse.json({
            success: true,
            settings: {
                siteName: settings.siteName || "",
                tagline: settings.tagline || "",
                aboutSection: settings.aboutSection || "",
                primaryColor: settings.primaryColor || "#3B82F6",
                secondaryColor: settings.secondaryColor || "#EF4444",
                accentColor: settings.accentColor || "#10B981",
                theme: settings.theme || "homely",
                contactMethods: settings.contactMethods || [],
                leadCaptureMethods: settings.leadCaptureMethods || [],
                includedPages: settings.includedPages || [],
                userEmail: settings.userEmail || "",
            },
        });
    }
    catch (error) {
        console.error("Settings GET error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map