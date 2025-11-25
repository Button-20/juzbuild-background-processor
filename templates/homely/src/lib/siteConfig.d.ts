/**
 * Site Configuration Utility
 *
 * This file provides easy access to site configuration values.
 * Contact information and social links are now fetched from the MongoDB settings collection.
 */
export interface SiteConfig {
    logoUrl: string;
    contact: {
        phone: string;
        email: string;
        supportEmail: string;
        whatsappNumber: string;
        address: string;
    };
    social: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
    };
    company: {
        name: string;
        tagline: string;
    };
}
/**
 * Get the complete site configuration (for server-side use)
 */
export declare const getSiteConfig: () => Promise<SiteConfig>;
/**
 * Get contact information
 */
export declare const getContactInfo: () => Promise<{
    phone: string;
    email: string;
    supportEmail: string;
    whatsappNumber: string;
    address: string;
}>;
/**
 * Get social media links
 */
export declare const getSocialLinks: () => Promise<{
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
}>;
/**
 * Get company information
 */
export declare const getCompanyInfo: () => Promise<{
    name: string;
    tagline: string;
}>;
/**
 * Utility functions for common use cases
 */
export declare const getPhoneNumber: () => Promise<string>;
export declare const getEmail: () => Promise<string>;
export declare const getSupportEmail: () => Promise<string>;
export declare const getWhatsAppNumber: () => Promise<string>;
export declare const getAddress: () => Promise<string>;
export declare const getFacebookUrl: () => Promise<string>;
export declare const getTwitterUrl: () => Promise<string>;
export declare const getInstagramUrl: () => Promise<string>;
export declare const getLinkedInUrl: () => Promise<string>;
export declare const getYouTubeUrl: () => Promise<string>;
//# sourceMappingURL=siteConfig.d.ts.map