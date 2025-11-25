"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.navLinks = exports.getNavLinks = void 0;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
// Function to get included pages from settings
const getIncludedPages = async () => {
    try {
        const { db } = await (0, mongodb_1.default)();
        const settingsCollection = db.collection("settings");
        const settings = await settingsCollection.findOne({});
        return settings?.includedPages || [];
    }
    catch (error) {
        console.error("Error fetching included pages:", error);
        // Return all pages as fallback
        return ["home", "about", "listings", "blog", "contact"];
    }
};
// Function to get dynamic navigation links based on included pages
const getNavLinks = async () => {
    try {
        // Get included pages from settings
        const includedPages = await getIncludedPages();
        const navLinks = [];
        // Home is always included (required)
        navLinks.push({ label: "Home", href: "/" });
        // Conditionally add About
        if (includedPages.includes("about")) {
            navLinks.push({ label: "About", href: "/about" });
        }
        // Properties/Listings is always included (required)
        navLinks.push({ label: "Properties", href: "/properties" });
        // Conditionally add Blog
        if (includedPages.includes("blog")) {
            navLinks.push({ label: "Blog", href: "/blogs" });
        }
        // Contact is always included (required)
        navLinks.push({ label: "Contact", href: "/contactus" });
        return navLinks;
    }
    catch (error) {
        console.error("Error fetching navigation links:", error);
        // Fallback to basic navigation
        return [
            { label: "Home", href: "/" },
            { label: "Properties", href: "/properties" },
            { label: "Contact", href: "/contactus" },
        ];
    }
};
exports.getNavLinks = getNavLinks;
// Keep the old export for backward compatibility (deprecated)
// Note: This fallback includes all pages and should be updated by the dynamic getNavLinks function
exports.navLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Contact", href: "/contactus" },
];
//# sourceMappingURL=navlink.js.map