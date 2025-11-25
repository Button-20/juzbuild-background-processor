"use strict";
/**
 * SEO Template Replacement Service
 *
 * This service handles the replacement of SEO placeholder tokens with actual user data
 * during the website generation process.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SEO_CONFIG = exports.createSEOReplacementService = exports.SEOReplacementService = void 0;
class SEOReplacementService {
    tokens;
    constructor(userSiteData) {
        this.tokens = this.extractTokensFromSiteData(userSiteData);
    }
    /**
     * Extract SEO tokens from user site data (based on next.config.js structure)
     */
    extractTokensFromSiteData(siteData) {
        return {
            // Company Information - From next.config.js company object
            COMPANY_NAME: siteData.company?.name || siteData.companyName || "Homely Real Estate",
            COMPANY_TAGLINE: siteData.company?.tagline || siteData.tagline || "Find Your Dream Home",
            COMPANY_DESCRIPTION: siteData.company?.description ||
                `Professional real estate services by ${siteData.company?.name || siteData.companyName || "Homely Real Estate"}. Find your perfect home with our expert guidance and comprehensive property listings.`,
            // Contact Information - From next.config.js contact object
            COMPANY_PHONE: siteData.contact?.phone || "+233-550-653-404",
            COMPANY_EMAIL: siteData.contact?.email || "icanvassolutions@gmail.com",
            SUPPORT_EMAIL: siteData.contact?.supportEmail || "support@homely.com",
            WHATSAPP_NUMBER: siteData.contact?.whatsappNumber || "+233123456789",
            COMPANY_ADDRESS: siteData.contact?.address || "Accra, Ghana",
            // Website Information - From next.config.js app object
            WEBSITE_URL: siteData.app?.url ||
                siteData.customDomain ||
                siteData.domain ||
                `https://${siteData.subdomain}.onjuzbuild.com` ||
                "http://localhost:3000",
            WEBSITE_NAME: siteData.company?.name || siteData.companyName || "Homely Real Estate",
            // Location/Service Area - Based on user's location
            PRIMARY_LOCATION: siteData.contact?.address ||
                siteData.primaryLocation ||
                siteData.city ||
                "Your City",
            SERVICE_AREAS: siteData.serviceAreas?.join(", ") ||
                siteData.contact?.address ||
                "Your Service Areas",
            // Social Media - From next.config.js social object
            FACEBOOK_URL: siteData.social?.facebook || "https://facebook.com/homelyrealestate",
            TWITTER_URL: siteData.social?.twitter || "https://twitter.com/homelyrealestate",
            INSTAGRAM_URL: siteData.social?.instagram || "https://instagram.com/homelyrealestate",
            LINKEDIN_URL: siteData.social?.linkedin ||
                "https://linkedin.com/company/homelyrealestate",
            YOUTUBE_URL: siteData.social?.youtube || "",
            // Branding Assets
            LOGO_URL: siteData.logo || "/logo.png",
            DEFAULT_OG_IMAGE: siteData.ogImage || "/og-image.jpg",
            // Business Classification
            BUSINESS_TYPE: "Real Estate Agency",
            PROPERTY_TYPES: "Residential,Commercial,Rental",
            // Analytics & Tracking (from next.config.js analytics object OR from siteData)
            GA_TRACKING_ID: siteData.analytics?.googleAnalytics?.measurementId || "",
            FACEBOOK_PIXEL_ID: siteData.analytics?.facebookPixelId || "",
            GOOGLE_VERIFICATION_CODE: siteData.verification?.googleVerification || "",
            FACEBOOK_VERIFICATION_CODE: siteData.verification?.facebookVerification || "",
            // Geographic Information - Based on user's location
            GEO_REGION: siteData.geoRegion || siteData.region || "",
            GEO_PLACENAME: siteData.geoPlacename || siteData.city || "",
            GEO_POSITION: siteData.geoPosition || siteData.coordinates || "",
        };
    }
    /**
     * Replace tokens in a string with actual values
     */
    replaceTokens(content) {
        let replacedContent = content;
        Object.entries(this.tokens).forEach(([token, value]) => {
            if (value) {
                const tokenPattern = new RegExp(`{{${token}}}`, "g");
                replacedContent = replacedContent.replace(tokenPattern, String(value));
            }
        });
        return replacedContent;
    }
    /**
     * Replace tokens in a file's content
     */
    async replaceTokensInFile(filePath, fileContent) {
        return this.replaceTokens(fileContent);
    }
    /**
     * Generate environment variables for the user's website
     */
    generateEnvVariables() {
        const envVars = Object.entries(this.tokens)
            .filter(([_, value]) => value && value.trim() !== "")
            .map(([key, value]) => `NEXT_PUBLIC_${key}="${value}"`)
            .join("\n");
        return `# SEO and Business Configuration - Based on next.config.js structure
# Generated automatically for ${this.tokens.COMPANY_NAME}

${envVars}

# Additional configurations (customizable)
NEXT_PUBLIC_SITE_LOCALE="en_US"
NEXT_PUBLIC_SITE_LANGUAGE="en"
NEXT_PUBLIC_CURRENCY="USD"
NEXT_PUBLIC_TIMEZONE="America/New_York"
`;
    }
    /**
     * Generate a comprehensive SEO report
     */
    generateSEOReport() {
        const allTokenKeys = [
            "COMPANY_NAME",
            "COMPANY_TAGLINE",
            "COMPANY_DESCRIPTION",
            "PRIMARY_LOCATION",
            "COMPANY_PHONE",
            "COMPANY_EMAIL",
            "WEBSITE_URL",
            "GA_TRACKING_ID",
            "DEFAULT_OG_IMAGE",
        ];
        const completedTokens = allTokenKeys.filter((key) => this.tokens[key] &&
            String(this.tokens[key]).trim() !== "");
        const missingTokens = allTokenKeys.filter((key) => !this.tokens[key] ||
            String(this.tokens[key]).trim() === "");
        const recommendations = [];
        if (missingTokens.includes("COMPANY_DESCRIPTION")) {
            recommendations.push("Add a compelling company description for better SEO");
        }
        if (missingTokens.includes("GA_TRACKING_ID")) {
            recommendations.push("Set up Google Analytics for traffic tracking");
        }
        if (missingTokens.includes("DEFAULT_OG_IMAGE")) {
            recommendations.push("Upload a high-quality social sharing image (1200x630px)");
        }
        if (!this.tokens.FACEBOOK_URL &&
            !this.tokens.TWITTER_URL &&
            !this.tokens.INSTAGRAM_URL) {
            recommendations.push("Add social media profiles to increase online presence");
        }
        return {
            completedTokens: completedTokens.length,
            totalTokens: allTokenKeys.length,
            missingTokens,
            recommendations,
        };
    }
    /**
     * Get all available tokens and their current values
     */
    getTokens() {
        return { ...this.tokens };
    }
    /**
     * Update specific tokens
     */
    updateTokens(updates) {
        this.tokens = { ...this.tokens, ...updates };
    }
}
exports.SEOReplacementService = SEOReplacementService;
/**
 * Utility function to create SEO replacement service from site data
 */
const createSEOReplacementService = (siteData) => {
    return new SEOReplacementService(siteData);
};
exports.createSEOReplacementService = createSEOReplacementService;
/**
 * Default SEO configuration - Generic template values
 */
exports.DEFAULT_SEO_CONFIG = {
    COMPANY_NAME: "Your Real Estate Business",
    COMPANY_TAGLINE: "Find Your Dream Home",
    COMPANY_DESCRIPTION: "Professional real estate services to help you find your perfect home",
    COMPANY_PHONE: "Your Phone Number",
    COMPANY_EMAIL: "your-email@domain.com",
    SUPPORT_EMAIL: "support@domain.com",
    WHATSAPP_NUMBER: "Your WhatsApp Number",
    COMPANY_ADDRESS: "Your Business Address",
    PRIMARY_LOCATION: "Your City",
    SERVICE_AREAS: "Your Service Areas",
    BUSINESS_TYPE: "Real Estate Agency",
    PROPERTY_TYPES: "Residential,Commercial,Rental",
    WEBSITE_NAME: "Your Real Estate Website",
    FACEBOOK_URL: "https://facebook.com/yourbusiness",
    TWITTER_URL: "https://twitter.com/yourbusiness",
    INSTAGRAM_URL: "https://instagram.com/yourbusiness",
    LINKEDIN_URL: "https://linkedin.com/company/yourbusiness",
    YOUTUBE_URL: "",
};
//# sourceMappingURL=seo-replacement.js.map