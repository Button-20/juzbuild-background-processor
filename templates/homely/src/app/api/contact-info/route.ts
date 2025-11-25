import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Dynamically import server-side config
    const { getSiteConfig } = await import("@/lib/siteConfig");
    const config = await getSiteConfig();

    return NextResponse.json({
      success: true,
      logoUrl: config.logoUrl || "",
      contact: config.contact,
      social: config.social,
    });
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contact information",
      },
      { status: 500 }
    );
  }
}
