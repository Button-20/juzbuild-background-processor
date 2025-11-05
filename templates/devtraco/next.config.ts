import type { NextConfig } from "next";

// All Configuration - MongoDB, App Settings, and Site Configuration
const appConfig = {
  // Database Configuration
  database: {
    mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/juzbuild_devtraco",
  },
  // App Configuration
  app: {
    url: "https://devtraco.vercel.app",
  },
  // Site Configuration - Contact Information, Social Links, Company Info
  contact: {
    phone: "+233550653404",
    email: "jasonaddy51@gmail.com",
    supportEmail: "icanvassolutions@gmail.com",
    whatsappNumber: "+233550653404",
    address: "Hse no. 4 Kwabenya  Hills, Kwabenya",
  },
  social: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "https://www.linkedin.com/in/jason-addy-972667137/",
    youtube: "",
  },
  company: {
    name: "Devtraco",
    tagline: "Your trusted partner in real estates",
  },
};

const nextConfig: NextConfig = {
  env: {
    // Database Configuration
    MONGODB_URI: appConfig.database.mongoUri,
    // App Configuration
    NEXT_PUBLIC_APP_URL: appConfig.app.url,
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
    unoptimized: true,
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
