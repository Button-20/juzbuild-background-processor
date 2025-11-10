import PropertiesListing from "@/components/Properties/PropertyList";
import HeroSub from "@/components/shared/HeroSub";
import { generatePageMetadata, SEO_CONFIG } from "@/lib/seo";
import { Metadata } from "next";
import Script from "next/script";

// Enhanced metadata with SEO
export const metadata: Metadata = {
  ...generatePageMetadata.properties(),
};

const page = () => {
  // Generate structured data for properties page
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Properties for Sale in ${SEO_CONFIG.PRIMARY_LOCATION}`,
    description: `Browse our extensive collection of properties for sale in ${SEO_CONFIG.PRIMARY_LOCATION}. Find your dream home with ${SEO_CONFIG.COMPANY_NAME}.`,
    url: `${SEO_CONFIG.WEBSITE_URL}/properties`,
    mainEntity: {
      "@type": "ItemList",
      name: `${SEO_CONFIG.PRIMARY_LOCATION} Property Listings`,
      description: `Real estate listings in ${SEO_CONFIG.PRIMARY_LOCATION}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SEO_CONFIG.WEBSITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Properties",
          item: `${SEO_CONFIG.WEBSITE_URL}/properties`,
        },
      ],
    },
  };

  return (
    <>
      {/* Properties Page Schema */}
      <Script
        id="properties-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <HeroSub
        title={`Discover Properties in ${SEO_CONFIG.PRIMARY_LOCATION}`}
        description={`Experience elegance and comfort with our exclusive properties in ${SEO_CONFIG.PRIMARY_LOCATION}, designed for sophisticated living.`}
        badge="Properties"
      />
      <PropertiesListing />
    </>
  );
};

export default page;
