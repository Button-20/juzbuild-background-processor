import { getFooterLinks } from "@/app/api/footerlinks";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const footerLinks = await getFooterLinks();

    return NextResponse.json({
      success: true,
      footerLinks,
    });
  } catch (error) {

    // Fallback to hardcoded links
    const fallbackLinks = [
      { label: "Villas", href: "/properties/villa" },
      { label: "Apartments", href: "/properties/apartment" },
      { label: "Offices", href: "/properties/office" },
      { label: "All Properties", href: "/properties" },
      { label: "Blog", href: "/blogs" },
      { label: "Contact Us", href: "/contactus" },
      { label: "About Us", href: "/#about" },
    ];

    return NextResponse.json({
      success: true,
      footerLinks: fallbackLinks,
    });
  }
}
