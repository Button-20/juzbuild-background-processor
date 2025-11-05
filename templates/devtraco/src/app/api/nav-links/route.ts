import { getNavLinks } from "@/app/api/navlink";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const navLinks = await getNavLinks();

    return NextResponse.json({
      success: true,
      navLinks,
    });
  } catch (error) {
    console.error("Error fetching navigation links:", error);

    // Fallback to basic navigation
    const fallbackLinks = [
      { label: "Home", href: "/" },
      { label: "Properties", href: "/properties" },
      { label: "Contact", href: "/contactus" },
    ];

    return NextResponse.json({
      success: true,
      navLinks: fallbackLinks,
    });
  }
}
