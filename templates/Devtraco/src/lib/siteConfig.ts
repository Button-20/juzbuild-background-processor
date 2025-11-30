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

// Cache for settings to avoid repeated database calls
let cachedSettings: any = null;
let cacheTimeout: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch settings from MongoDB with caching
 */
async function getSettingsFromDatabase(): Promise<any> {
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
  } catch (error) {
    console.error("Failed to fetch settings from database:", error);
    // Return fallback values on error
    return null;
  }
}

/**
 * Get the complete site configuration (for server-side use)
 */
export const getSiteConfig = async (): Promise<SiteConfig> => {
  const dbSettings = await getSettingsFromDatabase();

  return {
    logoUrl: dbSettings?.logoUrl || "",
    contact: {
      phone:
        dbSettings?.phoneNumber ||
        process.env.NEXT_PUBLIC_PHONE_NUMBER ||
        "+233-550-653-404",
      email:
        dbSettings?.userEmail ||
        process.env.NEXT_PUBLIC_EMAIL ||
        "hello@homely.com",
      supportEmail:
        dbSettings?.supportEmail ||
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
        "support@homely.com",
      whatsappNumber:
        dbSettings?.whatsappNumber ||
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
        "+233123456789",
      address:
        dbSettings?.address ||
        process.env.NEXT_PUBLIC_ADDRESS ||
        "Accra, Ghana",
    },
    social: {
      facebook:
        dbSettings?.facebookUrl ||
        process.env.NEXT_PUBLIC_FACEBOOK_URL ||
        "https://facebook.com/homelyrealestate",
      twitter:
        dbSettings?.twitterUrl ||
        process.env.NEXT_PUBLIC_TWITTER_URL ||
        "https://twitter.com/homelyrealestate",
      instagram:
        dbSettings?.instagramUrl ||
        process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
        "https://instagram.com/homelyrealestate",
      linkedin:
        dbSettings?.linkedinUrl ||
        process.env.NEXT_PUBLIC_LINKEDIN_URL ||
        "https://linkedin.com/company/homelyrealestate",
      youtube:
        dbSettings?.youtubeUrl || process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
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
export const getContactInfo = async () => {
  const config = await getSiteConfig();
  return config.contact;
};

/**
 * Get social media links
 */
export const getSocialLinks = async () => {
  const config = await getSiteConfig();
  return config.social;
};

/**
 * Get company information
 */
export const getCompanyInfo = async () => {
  const config = await getSiteConfig();
  return config.company;
};

/**
 * Utility functions for common use cases
 */
export const getPhoneNumber = async () => {
  const config = await getSiteConfig();
  return config.contact.phone;
};

export const getEmail = async () => {
  const config = await getSiteConfig();
  return config.contact.email;
};

export const getSupportEmail = async () => {
  const config = await getSiteConfig();
  return config.contact.supportEmail;
};

export const getWhatsAppNumber = async () => {
  const config = await getSiteConfig();
  return config.contact.whatsappNumber;
};

export const getAddress = async () => {
  const config = await getSiteConfig();
  return config.contact.address;
};

// Social media getters
export const getFacebookUrl = async () => {
  const config = await getSiteConfig();
  return config.social.facebook;
};

export const getTwitterUrl = async () => {
  const config = await getSiteConfig();
  return config.social.twitter;
};

export const getInstagramUrl = async () => {
  const config = await getSiteConfig();
  return config.social.instagram;
};

export const getLinkedInUrl = async () => {
  const config = await getSiteConfig();
  return config.social.linkedin;
};

export const getYouTubeUrl = async () => {
  const config = await getSiteConfig();
  return config.social.youtube;
};
