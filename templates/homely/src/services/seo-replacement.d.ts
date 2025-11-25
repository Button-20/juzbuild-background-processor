/**
 * SEO Template Replacement Service
 *
 * This service handles the replacement of SEO placeholder tokens with actual user data
 * during the website generation process.
 */
import { SEOTokens } from "@/types/seo";
export declare class SEOReplacementService {
    private tokens;
    constructor(userSiteData: any);
    /**
     * Extract SEO tokens from user site data (based on next.config.js structure)
     */
    private extractTokensFromSiteData;
    /**
     * Replace tokens in a string with actual values
     */
    replaceTokens(content: string): string;
    /**
     * Replace tokens in a file's content
     */
    replaceTokensInFile(filePath: string, fileContent: string): Promise<string>;
    /**
     * Generate environment variables for the user's website
     */
    generateEnvVariables(): string;
    /**
     * Generate a comprehensive SEO report
     */
    generateSEOReport(): {
        completedTokens: number;
        totalTokens: number;
        missingTokens: string[];
        recommendations: string[];
    };
    /**
     * Get all available tokens and their current values
     */
    getTokens(): Partial<SEOTokens>;
    /**
     * Update specific tokens
     */
    updateTokens(updates: Partial<SEOTokens>): void;
}
/**
 * Utility function to create SEO replacement service from site data
 */
export declare const createSEOReplacementService: (siteData: any) => SEOReplacementService;
/**
 * Default SEO configuration - Generic template values
 */
export declare const DEFAULT_SEO_CONFIG: {
    COMPANY_NAME: string;
    COMPANY_TAGLINE: string;
    COMPANY_DESCRIPTION: string;
    COMPANY_PHONE: string;
    COMPANY_EMAIL: string;
    SUPPORT_EMAIL: string;
    WHATSAPP_NUMBER: string;
    COMPANY_ADDRESS: string;
    PRIMARY_LOCATION: string;
    SERVICE_AREAS: string;
    BUSINESS_TYPE: string;
    PROPERTY_TYPES: string;
    WEBSITE_NAME: string;
    FACEBOOK_URL: string;
    TWITTER_URL: string;
    INSTAGRAM_URL: string;
    LINKEDIN_URL: string;
    YOUTUBE_URL: string;
};
//# sourceMappingURL=seo-replacement.d.ts.map