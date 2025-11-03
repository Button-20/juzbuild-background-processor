import type { NextConfig } from "next";

// All Configuration - MongoDB, App Settings, and Site Configuration
const appConfig = {
  // Database Configuration
  database: {
    mongoUri:
      "mongodb+srv://admin:fE7yahiULxkkIjlN@clusterv.m0hmur3.mongodb.net/juzbuild_premierrealty",
  },
  // App Configuration
  app: {
    url: "http://localhost:3000",
  },
  // Email Configuration - Resend API
  email: {
    resendApiKey:
      process.env.RESEND_API_KEY || "re_AnxzKjTV_GsrUKh9zLQ7AdxjhRSo4hVoA",
    fromEmail: process.env.NEXT_PUBLIC_FROM_EMAIL || "",
    fromName: process.env.NEXT_PUBLIC_FROM_NAME || "Homely Real Estate",
  },
  // Site Configuration - Contact Information, Social Links, Company Info
  contact: {
    phone: "+233-550-653-404",
    email: "icanvassolutions@gmail.com",
    supportEmail: "support@homely.com",
    whatsappNumber: "+233123456789",
    address: "Accra, Ghana",
  },
  social: {
    facebook: "https://facebook.com/homelyrealestate",
    twitter: "https://twitter.com/homelyrealestate",
    instagram: "https://instagram.com/homelyrealestate",
    linkedin: "https://linkedin.com/company/homelyrealestate",
    youtube: "",
  },
  company: {
    name: "Homely Real Estate",
    tagline: "Find Your Dream Home",
  },
};

const nextConfig: NextConfig = {
  env: {
    // Database Configuration
    MONGODB_URI: appConfig.database.mongoUri,
    // App Configuration
    NEXT_PUBLIC_APP_URL: appConfig.app.url,
    // Email Configuration
    RESEND_API_KEY: appConfig.email.resendApiKey,
    NEXT_PUBLIC_FROM_EMAIL: appConfig.email.fromEmail,
    NEXT_PUBLIC_FROM_NAME: appConfig.email.fromName,
    // Make site config available as environment variables
    NEXT_PUBLIC_PHONE_NUMBER: appConfig.contact.phone,
    NEXT_PUBLIC_EMAIL: appConfig.contact.email,
    NEXT_PUBLIC_SUPPORT_EMAIL: appConfig.contact.supportEmail,
    NEXT_PUBLIC_WHATSAPP_NUMBER: appConfig.contact.whatsappNumber,
    NEXT_PUBLIC_ADDRESS: appConfig.contact.address,
    NEXT_PUBLIC_FACEBOOK_URL: appConfig.social.facebook,
    NEXT_PUBLIC_TWITTER_URL: appConfig.social.twitter,
    NEXT_PUBLIC_INSTAGRAM_URL: appConfig.social.instagram,
    NEXT_PUBLIC_LINKEDIN_URL: appConfig.social.linkedin,
    NEXT_PUBLIC_YOUTUBE_URL: appConfig.social.youtube,
    NEXT_PUBLIC_COMPANY_NAME: appConfig.company.name,
    NEXT_PUBLIC_COMPANY_TAGLINE: appConfig.company.tagline,
  },
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
