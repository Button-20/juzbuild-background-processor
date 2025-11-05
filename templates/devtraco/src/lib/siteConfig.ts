/**
 * Site Configuration Utility
 *
 * This file provides easy access to site configuration values
 * that are set in next.config.ts and made available as environment variables.
 *
 * To update contact information, social links, etc., modify the values in:
 * 1. next.config.ts (for default values)
 * 2. .env.local (for environment-specific overrides)
 */

export interface SiteConfig {
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
 * Get the complete site configuration
 */
export const getSiteConfig = (): SiteConfig => {
  return {
    contact: {
      phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+233-550-653-404",
      email: process.env.NEXT_PUBLIC_EMAIL || "hello@homely.com",
      supportEmail:
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@homely.com",
      whatsappNumber:
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+233123456789",
      address: process.env.NEXT_PUBLIC_ADDRESS || "Accra, Ghana",
    },
    social: {
      facebook:
        process.env.NEXT_PUBLIC_FACEBOOK_URL ||
        "https://facebook.com/homelyrealestate",
      twitter:
        process.env.NEXT_PUBLIC_TWITTER_URL ||
        "https://twitter.com/homelyrealestate",
      instagram:
        process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
        "https://instagram.com/homelyrealestate",
      linkedin:
        process.env.NEXT_PUBLIC_LINKEDIN_URL ||
        "https://linkedin.com/company/homelyrealestate",
      youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    },
    company: {
      name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Homely Real Estate",
      tagline:
        process.env.NEXT_PUBLIC_COMPANY_TAGLINE || "Find Your Dream Home",
    },
  };
};

/**
 * Get contact information
 */
export const getContactInfo = () => {
  return getSiteConfig().contact;
};

/**
 * Get social media links
 */
export const getSocialLinks = () => {
  return getSiteConfig().social;
};

/**
 * Get company information
 */
export const getCompanyInfo = () => {
  return getSiteConfig().company;
};

/**
 * Utility functions for common use cases
 */
export const getPhoneNumber = () => getSiteConfig().contact.phone;
export const getEmail = () => getSiteConfig().contact.email;
export const getSupportEmail = () => getSiteConfig().contact.supportEmail;
export const getWhatsAppNumber = () => getSiteConfig().contact.whatsappNumber;
export const getAddress = () => getSiteConfig().contact.address;

// Social media getters
export const getFacebookUrl = () => getSiteConfig().social.facebook;
export const getTwitterUrl = () => getSiteConfig().social.twitter;
export const getInstagramUrl = () => getSiteConfig().social.instagram;
export const getLinkedInUrl = () => getSiteConfig().social.linkedin;
export const getYouTubeUrl = () => getSiteConfig().social.youtube;

// Company getters
export const getCompanyName = () => getSiteConfig().company.name;
export const getCompanyTagline = () => getSiteConfig().company.tagline;
