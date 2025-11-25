"use strict";
/**
 * Site Configuration Utility
 *
 * This file provides easy access to site configuration values.
 * Contact information and social links are now fetched from the MongoDB settings collection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYouTubeUrl = exports.getLinkedInUrl = exports.getInstagramUrl = exports.getTwitterUrl = exports.getFacebookUrl = exports.getAddress = exports.getWhatsAppNumber = exports.getSupportEmail = exports.getEmail = exports.getPhoneNumber = exports.getCompanyInfo = exports.getSocialLinks = exports.getContactInfo = exports.getSiteConfig = void 0;
// Cache for settings to avoid repeated database calls
let cachedSettings = null;
let cacheTimeout = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
/**
 * Fetch settings from MongoDB with caching
 */
async function getSettingsFromDatabase() {
    const now = Date.now();
    // Return cached settings if still valid
    if (cachedSettings && now < cacheTimeout) {
        return cachedSettings;
    }
    try {
        // Dynamically import MongoDB to avoid bundling it in client
        const { MongoClient } = await import("mongodb");
        const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
        const client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db();
        const settingsCollection = db.collection("settings");
        const settings = await settingsCollection.findOne({});
        await client.close();
        // Cache the settings
        cachedSettings = settings;
        cacheTimeout = now + CACHE_DURATION;
        return settings;
    }
    catch (error) {
        console.error("Failed to fetch settings from database:", error);
        // Return fallback values on error
        return null;
    }
}
/**
 * Get the complete site configuration (for server-side use)
 */
const getSiteConfig = async () => {
    const dbSettings = await getSettingsFromDatabase();
    return {
        logoUrl: dbSettings?.logoUrl || "",
        contact: {
            phone: dbSettings?.phoneNumber ||
                process.env.NEXT_PUBLIC_PHONE_NUMBER ||
                "+233-550-653-404",
            email: dbSettings?.userEmail ||
                process.env.NEXT_PUBLIC_EMAIL ||
                "hello@homely.com",
            supportEmail: dbSettings?.supportEmail ||
                process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
                "support@homely.com",
            whatsappNumber: dbSettings?.whatsappNumber ||
                process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
                "+233123456789",
            address: dbSettings?.address ||
                process.env.NEXT_PUBLIC_ADDRESS ||
                "Accra, Ghana",
        },
        social: {
            facebook: dbSettings?.facebookUrl ||
                process.env.NEXT_PUBLIC_FACEBOOK_URL ||
                "https://facebook.com/homelyrealestate",
            twitter: dbSettings?.twitterUrl ||
                process.env.NEXT_PUBLIC_TWITTER_URL ||
                "https://twitter.com/homelyrealestate",
            instagram: dbSettings?.instagramUrl ||
                process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
                "https://instagram.com/homelyrealestate",
            linkedin: dbSettings?.linkedinUrl ||
                process.env.NEXT_PUBLIC_LINKEDIN_URL ||
                "https://linkedin.com/company/homelyrealestate",
            youtube: dbSettings?.youtubeUrl || process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
        },
        company: {
            name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Homely Real Estate",
            tagline: process.env.NEXT_PUBLIC_COMPANY_TAGLINE || "Find Your Dream Home",
        },
    };
};
exports.getSiteConfig = getSiteConfig;
/**
 * Get contact information
 */
const getContactInfo = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.contact;
};
exports.getContactInfo = getContactInfo;
/**
 * Get social media links
 */
const getSocialLinks = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.social;
};
exports.getSocialLinks = getSocialLinks;
/**
 * Get company information
 */
const getCompanyInfo = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.company;
};
exports.getCompanyInfo = getCompanyInfo;
/**
 * Utility functions for common use cases
 */
const getPhoneNumber = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.contact.phone;
};
exports.getPhoneNumber = getPhoneNumber;
const getEmail = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.contact.email;
};
exports.getEmail = getEmail;
const getSupportEmail = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.contact.supportEmail;
};
exports.getSupportEmail = getSupportEmail;
const getWhatsAppNumber = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.contact.whatsappNumber;
};
exports.getWhatsAppNumber = getWhatsAppNumber;
const getAddress = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.contact.address;
};
exports.getAddress = getAddress;
// Social media getters
const getFacebookUrl = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.social.facebook;
};
exports.getFacebookUrl = getFacebookUrl;
const getTwitterUrl = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.social.twitter;
};
exports.getTwitterUrl = getTwitterUrl;
const getInstagramUrl = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.social.instagram;
};
exports.getInstagramUrl = getInstagramUrl;
const getLinkedInUrl = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.social.linkedin;
};
exports.getLinkedInUrl = getLinkedInUrl;
const getYouTubeUrl = async () => {
    const config = await (0, exports.getSiteConfig)();
    return config.social.youtube;
};
exports.getYouTubeUrl = getYouTubeUrl;
//# sourceMappingURL=siteConfig.js.map