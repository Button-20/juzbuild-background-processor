"use client";

import FAQ from "@/components/Home/FAQs";
import FeaturedProperty from "@/components/Home/FeaturedProperty";
import GetInTouch from "@/components/Home/GetInTouch";
import Hero from "@/components/Home/Hero";
import Properties from "@/components/Home/Properties";
import Services from "@/components/Home/Services";
import Testimonial from "@/components/Home/Testimonial";
import BlogSmall from "@/components/shared/Blog";
import SEOComponent from "@/components/shared/SEOComponent";
import { useSettings } from "@/hooks/useSettings";
import {
  generatePageMetadata,
  generateStructuredData,
  SEO_CONFIG,
} from "@/lib/seo";
import { useEffect } from "react";

export default function Home() {
  const { isBlogEnabled } = useSettings();
  const homeMetadata = generatePageMetadata.homepage();

  useEffect(() => {
    // Track homepage view for analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }
  }, []);

  return (
    <>
      <SEOComponent
        title={homeMetadata.title as string}
        description={homeMetadata.description as string}
        canonical={SEO_CONFIG.WEBSITE_URL}
        ogImage={SEO_CONFIG.DEFAULT_OG_IMAGE}
        keywords={homeMetadata.keywords as string}
        structuredData={generateStructuredData.organization()}
      />

      <main>
        <Hero />
        <Services />
        <Properties />
        <FeaturedProperty />
        <Testimonial />
        {isBlogEnabled && <BlogSmall />}
        <GetInTouch />
        <FAQ />
      </main>
    </>
  );
}
