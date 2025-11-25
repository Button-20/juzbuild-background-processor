import { Metadata } from "next";
export declare const SEO_CONFIG: {
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
};
export declare const SEO_KEYWORDS: {
    homepage: string[];
    properties: string[];
    residential: string[];
    commercial: string[];
    rental: string[];
};
export declare const generateStructuredData: {
    organization: () => {
        "@context": string;
        "@type": string;
        name: string;
        description: string;
        url: string;
        logo: {
            "@type": string;
            url: string;
        };
        contactPoint: {
            "@type": string;
            telephone: string;
            contactType: string;
            email: string;
        }[];
        address: {
            "@type": string;
            streetAddress: string;
            addressLocality: string;
        };
        sameAs: string[];
        areaServed: string[];
    };
    property: (property: any) => {
        "@context": string;
        "@type": string;
        name: any;
        description: any;
        url: string;
        image: any;
        address: {
            "@type": string;
            streetAddress: any;
            addressLocality: string;
        };
        floorSize: {
            "@type": string;
            value: any;
            unitText: string;
        };
        numberOfRooms: any;
        numberOfBathroomsTotal: any;
        petsAllowed: any;
        smokingAllowed: boolean;
        priceRange: string;
    };
    breadcrumb: (items: {
        name: string;
        url: string;
    }[]) => {
        "@context": string;
        "@type": string;
        itemListElement: {
            "@type": string;
            position: number;
            name: string;
            item: string;
        }[];
    };
    faq: (faqs: {
        question: string;
        answer: string;
    }[]) => {
        "@context": string;
        "@type": string;
        mainEntity: {
            "@type": string;
            name: string;
            acceptedAnswer: {
                "@type": string;
                text: string;
            };
        }[];
    };
};
export declare const generatePageMetadata: {
    homepage: () => Metadata;
    properties: (propertyType?: string) => Metadata;
    property: (property: any) => Metadata;
    contact: () => Metadata;
};
export declare const injectStructuredData: (data: any) => void;
export declare const generateSitemapData: (properties: any[]) => {
    staticPages: {
        url: string;
        priority: number;
        changefreq: string;
    }[];
    dynamicPages: {
        url: string;
        priority: number;
        changefreq: string;
        lastmod: any;
    }[];
};
//# sourceMappingURL=seo.d.ts.map