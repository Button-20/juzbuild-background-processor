"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSitemapData = exports.injectStructuredData = exports.generatePageMetadata = exports.generateStructuredData = exports.SEO_KEYWORDS = exports.SEO_CONFIG = void 0;
// SEO Constants - Using available values from next.config.js
exports.SEO_CONFIG = {
    // Company Information - Available in next.config.js
    COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME || "Homely Real Estate",
    COMPANY_TAGLINE: process.env.NEXT_PUBLIC_COMPANY_TAGLINE || "Find Your Dream Home",
    COMPANY_DESCRIPTION: `Professional real estate services by ${process.env.NEXT_PUBLIC_COMPANY_NAME || "Homely Real Estate"}. Find your perfect home with our expert guidance and comprehensive property listings.`,
    // Contact Information - Available in next.config.js
    COMPANY_PHONE: process.env.NEXT_PUBLIC_PHONE_NUMBER || "Your Phone Number",
    COMPANY_EMAIL: process.env.NEXT_PUBLIC_EMAIL || "your-email@domain.com",
    SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@domain.com",
    WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "Your WhatsApp Number",
    COMPANY_ADDRESS: process.env.NEXT_PUBLIC_ADDRESS || "Your Business Address",
    // Website Information - Available in next.config.js
    WEBSITE_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    WEBSITE_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME || "Homely Real Estate",
    // Location/Service Area - Generic template values
    PRIMARY_LOCATION: process.env.NEXT_PUBLIC_ADDRESS || "Your City",
    SERVICE_AREAS: "Your Service Areas",
    // Social Media - Available in next.config.js
    FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/yourbusiness",
    TWITTER_URL: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/yourbusiness",
    INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
        "https://instagram.com/yourbusiness",
    LINKEDIN_URL: process.env.NEXT_PUBLIC_LINKEDIN_URL ||
        "https://linkedin.com/company/yourbusiness",
    YOUTUBE_URL: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    // Branding Assets - Default values (these would be replaced during deployment)
    LOGO_URL: "/logo.png",
    DEFAULT_OG_IMAGE: "/og-image.jpg",
    // Business Type - Real estate focused
    BUSINESS_TYPE: "Real Estate Agency",
    PROPERTY_TYPES: "Residential,Commercial,Rental",
};
// Keywords for different property types and pages
exports.SEO_KEYWORDS = {
    // Homepage keywords - location-based
    homepage: [
        `${exports.SEO_CONFIG.PRIMARY_LOCATION} real estate`,
        `homes for sale in ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
        `${exports.SEO_CONFIG.PRIMARY_LOCATION} property listings`,
        `real estate agent ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
        `buy home ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
        `${exports.SEO_CONFIG.PRIMARY_LOCATION} housing market`,
    ],
    // Property listing keywords
    properties: [
        `${exports.SEO_CONFIG.PRIMARY_LOCATION} properties`,
        `real estate listings ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
        `homes for sale`,
        `property search ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
        `real estate ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
    ],
    // Property type specific keywords
    residential: [
        "residential properties",
        "family homes",
        "single family homes",
        "townhomes",
        "condominiums",
        "apartments for sale",
    ],
    commercial: [
        "commercial real estate",
        "office buildings",
        "retail spaces",
        "commercial properties",
        "investment properties",
        "business properties",
    ],
    rental: [
        "rental properties",
        "apartments for rent",
        "house rentals",
        "property management",
        "tenant services",
        "rental listings",
    ],
};
// Generate structured data for different content types
exports.generateStructuredData = {
    // Organization schema
    organization: () => ({
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: exports.SEO_CONFIG.COMPANY_NAME,
        description: exports.SEO_CONFIG.COMPANY_DESCRIPTION,
        url: exports.SEO_CONFIG.WEBSITE_URL,
        logo: {
            "@type": "ImageObject",
            url: exports.SEO_CONFIG.LOGO_URL,
        },
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: exports.SEO_CONFIG.COMPANY_PHONE,
                contactType: "Customer Service",
                email: exports.SEO_CONFIG.COMPANY_EMAIL,
            },
            {
                "@type": "ContactPoint",
                telephone: exports.SEO_CONFIG.SUPPORT_EMAIL,
                contactType: "Technical Support",
                email: exports.SEO_CONFIG.SUPPORT_EMAIL,
            },
        ],
        address: {
            "@type": "PostalAddress",
            streetAddress: exports.SEO_CONFIG.COMPANY_ADDRESS,
            addressLocality: exports.SEO_CONFIG.PRIMARY_LOCATION,
        },
        sameAs: [
            exports.SEO_CONFIG.FACEBOOK_URL,
            exports.SEO_CONFIG.TWITTER_URL,
            exports.SEO_CONFIG.INSTAGRAM_URL,
            exports.SEO_CONFIG.LINKEDIN_URL,
            exports.SEO_CONFIG.YOUTUBE_URL,
        ].filter(Boolean),
        areaServed: exports.SEO_CONFIG.SERVICE_AREAS.split(",").map((area) => area.trim()),
    }),
    // Property schema
    property: (property) => ({
        "@context": "https://schema.org",
        "@type": "Accommodation",
        name: property.name,
        description: property.description,
        url: `${exports.SEO_CONFIG.WEBSITE_URL}/properties/${property.propertyType}/${property.slug}`,
        image: property.images?.map((img) => ({
            "@type": "ImageObject",
            url: img,
        })) || [],
        address: {
            "@type": "PostalAddress",
            streetAddress: property.location,
            addressLocality: exports.SEO_CONFIG.PRIMARY_LOCATION,
        },
        floorSize: {
            "@type": "QuantitativeValue",
            value: property.area,
            unitText: "square meters",
        },
        numberOfRooms: property.beds,
        numberOfBathroomsTotal: property.baths,
        petsAllowed: property.features?.includes("Pet Friendly") || false,
        smokingAllowed: false,
        priceRange: property.price
            ? `${property.currency} ${property.price}`
            : "Contact for pricing",
    }),
    // Website breadcrumb
    breadcrumb: (items) => ({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }),
    // FAQ schema for FAQ pages
    faq: (faqs) => ({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    }),
};
// Generate metadata for different page types
exports.generatePageMetadata = {
    // Homepage metadata
    homepage: () => ({
        title: `${exports.SEO_CONFIG.COMPANY_NAME} - ${exports.SEO_CONFIG.COMPANY_TAGLINE}`,
        description: `${exports.SEO_CONFIG.COMPANY_DESCRIPTION} Find your perfect home in ${exports.SEO_CONFIG.PRIMARY_LOCATION} with our comprehensive real estate services.`,
        keywords: exports.SEO_KEYWORDS.homepage.join(", "),
        openGraph: {
            title: `${exports.SEO_CONFIG.COMPANY_NAME} - ${exports.SEO_CONFIG.COMPANY_TAGLINE}`,
            description: `Find your perfect home in ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
            url: exports.SEO_CONFIG.WEBSITE_URL,
            siteName: exports.SEO_CONFIG.WEBSITE_NAME,
            images: [
                {
                    url: exports.SEO_CONFIG.DEFAULT_OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: `${exports.SEO_CONFIG.COMPANY_NAME} - Real Estate Services`,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${exports.SEO_CONFIG.COMPANY_NAME} - ${exports.SEO_CONFIG.COMPANY_TAGLINE}`,
            description: `Find your perfect home in ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
            images: [exports.SEO_CONFIG.DEFAULT_OG_IMAGE],
        },
        alternates: {
            canonical: exports.SEO_CONFIG.WEBSITE_URL,
        },
    }),
    // Properties listing page metadata
    properties: (propertyType) => {
        const typeTitle = propertyType
            ? ` ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}`
            : "";
        const keywords = propertyType
            ? exports.SEO_KEYWORDS[propertyType] ||
                exports.SEO_KEYWORDS.properties
            : exports.SEO_KEYWORDS.properties;
        return {
            title: `${typeTitle} Properties for Sale in ${exports.SEO_CONFIG.PRIMARY_LOCATION} | ${exports.SEO_CONFIG.COMPANY_NAME}`,
            description: `Browse our extensive collection of${typeTitle.toLowerCase()} properties for sale in ${exports.SEO_CONFIG.PRIMARY_LOCATION}. Find your dream home with ${exports.SEO_CONFIG.COMPANY_NAME}.`,
            keywords: keywords.join(", "),
            openGraph: {
                title: `${typeTitle} Properties in ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
                description: `Discover premium${typeTitle.toLowerCase()} properties for sale`,
                url: `${exports.SEO_CONFIG.WEBSITE_URL}/properties${propertyType ? `/${propertyType}` : ""}`,
                siteName: exports.SEO_CONFIG.WEBSITE_NAME,
                images: [
                    {
                        url: exports.SEO_CONFIG.DEFAULT_OG_IMAGE,
                        width: 1200,
                        height: 630,
                        alt: `${typeTitle} Properties - ${exports.SEO_CONFIG.COMPANY_NAME}`,
                    },
                ],
                type: "website",
            },
            alternates: {
                canonical: `${exports.SEO_CONFIG.WEBSITE_URL}/properties${propertyType ? `/${propertyType}` : ""}`,
            },
        };
    },
    // Individual property page metadata
    property: (property) => {
        const priceText = property.price
            ? `${property.currency} ${property.price.toLocaleString()}`
            : "Contact for pricing";
        const propertyFeatures = `${property.beds} bed, ${property.baths} bath`;
        return {
            title: `${property.name} - ${property.location} | ${propertyFeatures} | ${exports.SEO_CONFIG.COMPANY_NAME}`,
            description: `${property.description?.slice(0, 140) ||
                `${propertyFeatures} ${property.propertyType} in ${property.location}.`} ${priceText}. Contact ${exports.SEO_CONFIG.COMPANY_NAME} for viewing.`,
            keywords: [
                property.name,
                property.location,
                `${property.beds} bedroom`,
                `${property.baths} bathroom`,
                property.propertyType,
                `${property.area}m²`,
                exports.SEO_CONFIG.PRIMARY_LOCATION,
                "real estate",
            ].join(", "),
            openGraph: {
                title: `${property.name} - ${property.location}`,
                description: `${propertyFeatures} • ${property.area}m² • ${priceText}`,
                url: `${exports.SEO_CONFIG.WEBSITE_URL}/properties/${property.propertyType}/${property.slug}`,
                siteName: exports.SEO_CONFIG.WEBSITE_NAME,
                images: property.images
                    ?.slice(0, 3)
                    .map((image, index) => ({
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: `${property.name} - Image ${index + 1}`,
                })) || [
                    {
                        url: exports.SEO_CONFIG.DEFAULT_OG_IMAGE,
                        width: 1200,
                        height: 630,
                        alt: property.name,
                    },
                ],
                type: "article",
            },
            twitter: {
                card: "summary_large_image",
                title: `${property.name} - ${property.location}`,
                description: `${propertyFeatures} • ${priceText}`,
                images: [property.images?.[0] || exports.SEO_CONFIG.DEFAULT_OG_IMAGE],
            },
            alternates: {
                canonical: `${exports.SEO_CONFIG.WEBSITE_URL}/properties/${property.propertyType}/${property.slug}`,
            },
        };
    },
    // Contact page metadata
    contact: () => ({
        title: `Contact ${exports.SEO_CONFIG.COMPANY_NAME} - Real Estate Services in ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
        description: `Get in touch with ${exports.SEO_CONFIG.COMPANY_NAME} for all your real estate needs in ${exports.SEO_CONFIG.PRIMARY_LOCATION}. Call ${exports.SEO_CONFIG.COMPANY_PHONE} or visit our office.`,
        keywords: [
            `contact ${exports.SEO_CONFIG.COMPANY_NAME}`,
            `real estate agent ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
            `property consultation`,
            `real estate services`,
            exports.SEO_CONFIG.PRIMARY_LOCATION,
        ].join(", "),
        openGraph: {
            title: `Contact ${exports.SEO_CONFIG.COMPANY_NAME}`,
            description: `Expert real estate services in ${exports.SEO_CONFIG.PRIMARY_LOCATION}`,
            url: `${exports.SEO_CONFIG.WEBSITE_URL}/contact`,
            siteName: exports.SEO_CONFIG.WEBSITE_NAME,
            type: "website",
        },
        alternates: {
            canonical: `${exports.SEO_CONFIG.WEBSITE_URL}/contact`,
        },
    }),
};
// Utility function to inject structured data
const injectStructuredData = (data) => {
    if (typeof window !== "undefined") {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
    }
};
exports.injectStructuredData = injectStructuredData;
// Generate sitemap data
const generateSitemapData = (properties) => ({
    staticPages: [
        { url: exports.SEO_CONFIG.WEBSITE_URL, priority: 1.0, changefreq: "daily" },
        {
            url: `${exports.SEO_CONFIG.WEBSITE_URL}/properties`,
            priority: 0.9,
            changefreq: "daily",
        },
        {
            url: `${exports.SEO_CONFIG.WEBSITE_URL}/contact`,
            priority: 0.8,
            changefreq: "monthly",
        },
        {
            url: `${exports.SEO_CONFIG.WEBSITE_URL}/about`,
            priority: 0.7,
            changefreq: "monthly",
        },
    ],
    dynamicPages: properties.map((property) => ({
        url: `${exports.SEO_CONFIG.WEBSITE_URL}/properties/${property.propertyType}/${property.slug}`,
        priority: 0.8,
        changefreq: "weekly",
        lastmod: property.updatedAt || new Date().toISOString(),
    })),
});
exports.generateSitemapData = generateSitemapData;
//# sourceMappingURL=seo.js.map