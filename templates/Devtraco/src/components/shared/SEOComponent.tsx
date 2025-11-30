"use client";

import { useEffect } from "react";

interface SEOComponentProps {
  structuredData?: any;
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
}

export default function SEOComponent({
  structuredData,
  title,
  description,
  canonical,
  ogImage,
  keywords,
}: SEOComponentProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    const updatePropertyTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("property", property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    // Update meta description
    if (description) {
      updateMetaTag("description", description);
      updatePropertyTag("og:description", description);
      updateMetaTag("twitter:description", description);
    }

    // Update keywords
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }

    // Update Open Graph tags
    if (title) {
      updatePropertyTag("og:title", title);
      updateMetaTag("twitter:title", title);
    }

    if (ogImage) {
      updatePropertyTag("og:image", ogImage);
      updateMetaTag("twitter:image", ogImage);
    }

    // Update canonical link
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonical);
    }

    // Inject structured data
    if (structuredData) {
      // Remove existing structured data scripts to avoid duplicates
      const existingScripts = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      existingScripts.forEach((script) => {
        if (script.textContent?.includes(structuredData["@type"])) {
          script.remove();
        }
      });

      // Add new structured data
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [structuredData, title, description, canonical, ogImage, keywords]);

  return null; // This component doesn't render anything
}
