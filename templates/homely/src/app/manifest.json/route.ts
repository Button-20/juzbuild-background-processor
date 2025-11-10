import { SEO_CONFIG } from "@/lib/seo";
import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    name: SEO_CONFIG.WEBSITE_NAME || SEO_CONFIG.COMPANY_NAME,
    short_name: SEO_CONFIG.COMPANY_NAME,
    description: SEO_CONFIG.COMPANY_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#07be8a",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["business", "lifestyle", "utilities"],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "640x1136",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };

  return new NextResponse(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
