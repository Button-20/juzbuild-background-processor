import connectDB from "@/lib/mongodb";
import { PropertyTypeService } from "@/services";
import { footerlinks } from "@/types/footerlinks";

// Function to get included pages from settings
const getIncludedPages = async (): Promise<string[]> => {
  try {
    const { db } = await connectDB();
    const settingsCollection = db.collection("settings");
    const settings = await settingsCollection.findOne({});
    
    return settings?.includedPages || [];
  } catch (error) {
    console.error("Error fetching included pages:", error);
    // Return all pages as fallback
    return ["home", "about", "listings", "blog", "contact"];
  }
};

// Function to get dynamic footer links
export const getFooterLinks = async (): Promise<footerlinks[]> => {
  try {
    // Get included pages from settings
    const includedPages = await getIncludedPages();
    
    // Get active property types from database
    const propertyTypes = await PropertyTypeService.findActive();

    // Map property types to footer links format
    const propertyTypeLinks: footerlinks[] = propertyTypes.map(
      (propertyType) => ({
        label: propertyType.name,
        href: `/properties/${propertyType.slug}`,
      })
    );

    // Static links that depend on included pages
    const staticLinks: footerlinks[] = [];
    
    // Always include Properties (listings page is required)
    staticLinks.push({ label: "All Properties", href: "/properties" });
    
    // Conditionally include Blog if it's in includedPages
    if (includedPages.includes("blog")) {
      staticLinks.push({ label: "Blog", href: "/blogs" });
    }
    
    // Always include Contact (contact page is required)
    staticLinks.push({ label: "Contact Us", href: "/contactus" });
    
    // Conditionally include About if it's in includedPages
    if (includedPages.includes("about")) {
      staticLinks.push({ label: "About Us", href: "/about" });
    }

    // Combine property type links with static links
    return [...propertyTypeLinks, ...staticLinks];
  } catch (error) {
    console.error("Error fetching property types for footer:", error);
    // Fallback to hardcoded links if database fetch fails
    return [
      { label: "Villas", href: "/properties/villa" },
      { label: "Apartments", href: "/properties/apartment" },
      { label: "Offices", href: "/properties/office" },
      { label: "All Properties", href: "/properties" },
      { label: "Blog", href: "/blogs" },
      { label: "Contact Us", href: "/contactus" },
      { label: "About Us", href: "/about" },
    ];
  }
};

// Keep the old export for backward compatibility (deprecated)
// Note: This fallback includes all pages and should be updated by the dynamic getFooterLinks function
export const FooterLinks: footerlinks[] = [
  { label: "Villas", href: "/properties/villa" },
  { label: "Apartments", href: "/properties/apartment" },
  { label: "Offices", href: "/properties/office" },
  { label: "All Properties", href: "/properties" },
  { label: "Contact Us", href: "/contactus" },
];
