import { SEO_CONFIG } from "@/lib/seo";
import { NextResponse } from "next/server";

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${SEO_CONFIG.WEBSITE_URL}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /dashboard/

# Allow important pages
Allow: /
Allow: /properties
Allow: /contact
Allow: /about
Allow: /blog

# Crawl-delay (optional - helps prevent overloading)
Crawl-delay: 1`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
    },
  });
}
