// Global types for SEO and Analytics integrations

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

// Property types for SEO
export interface PropertySEO {
  id: string;
  slug: string;
  name: string;
  description?: string;
  location: string;
  price?: number;
  currency?: string;
  beds: number;
  baths: number;
  area: number;
  propertyType: string;
  images?: string[];
  features?: string[];
  rate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// SEO Breadcrumb item
export interface BreadcrumbItem {
  name: string;
  url: string;
}

// FAQ item for structured data
export interface FAQItem {
  question: string;
  answer: string;
}

// Company information tokens based on next.config.js structure
export interface SEOTokens {
  COMPANY_NAME: string;
  COMPANY_TAGLINE: string;
  COMPANY_DESCRIPTION: string;
  COMPANY_PHONE: string;
  COMPANY_EMAIL: string;
  SUPPORT_EMAIL: string;
  WHATSAPP_NUMBER: string;
  COMPANY_ADDRESS: string;
  WEBSITE_URL: string;
  WEBSITE_NAME: string;
  PRIMARY_LOCATION: string;
  SERVICE_AREAS: string;
  FACEBOOK_URL: string;
  TWITTER_URL: string;
  INSTAGRAM_URL: string;
  LINKEDIN_URL: string;
  YOUTUBE_URL: string;
  LOGO_URL: string;
  DEFAULT_OG_IMAGE: string;
  BUSINESS_TYPE: string;
  PROPERTY_TYPES: string;
  GA_TRACKING_ID: string;
  FACEBOOK_PIXEL_ID: string;
  GOOGLE_VERIFICATION_CODE: string;
  FACEBOOK_VERIFICATION_CODE: string;
  GEO_REGION: string;
  GEO_PLACENAME: string;
  GEO_POSITION: string;
}

export {};
