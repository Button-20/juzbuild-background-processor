import { PropertyTypeService } from "@/services";
import { footerlinks } from "@/types/footerlinks";

// Static links that don't come from property types
const staticLinks: footerlinks[] = [
  { label: "All Properties", href: "/properties" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact Us", href: "/contactus" },
  { label: "About Us", href: "/#about" },
];

// Function to get dynamic footer links
export const getFooterLinks = async (): Promise<footerlinks[]> => {
  try {
    // Get active property types from database
    const propertyTypes = await PropertyTypeService.findActive();

    // Map property types to footer links format
    const propertyTypeLinks: footerlinks[] = propertyTypes.map(
      (propertyType) => ({
        label: propertyType.name,
        href: `/properties/${propertyType.slug}`,
      })
    );

    // Combine property type links with static links
    return [...propertyTypeLinks, ...staticLinks];
  } catch (error) {
    console.error("Error fetching property types for footer:", error);
    // Fallback to hardcoded links if database fetch fails
    return [
      { label: "Villas", href: "/properties/villa" },
      { label: "Apartments", href: "/properties/apartment" },
      { label: "Offices", href: "/properties/office" },
      ...staticLinks,
    ];
  }
};

// Keep the old export for backward compatibility (deprecated)
export const FooterLinks: footerlinks[] = [
  { label: "Villas", href: "/properties/villa" },
  { label: "Apartments", href: "/properties/apartment" },
  { label: "Offices", href: "/properties/office" },
  { label: "All Properties", href: "/properties" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact Us", href: "/contactus" },
  { label: "About Us", href: "/#about" },
];
