/**
 * Client-side contact info fetcher
 * Uses the /api/contact-info endpoint to get contact data
 */

export interface ContactData {
  contact: {
    phone: string;
    email: string;
    supportEmail: string;
    whatsappNumber: string;
    address: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  logoUrl?: string;
}

let cachedContactData: ContactData | null = null;
let cachetime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchContactData(): Promise<ContactData> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedContactData && now < cachetime) {
    return cachedContactData;
  }

  try {
    const response = await fetch("/api/contact-info", { cache: "no-store" });
    const data = await response.json();

    if (data.success) {
      cachedContactData = {
        contact: data.contact,
        social: data.social,
        logoUrl: data.logoUrl || "",
      };
      cachetime = now + CACHE_DURATION;
      return cachedContactData;
    }
  } catch (error) {
    console.error("Failed to fetch contact data:", error);
  }

  // Return default fallback values
  return {
    contact: {
      phone: "+233-550-653-404",
      email: "hello@homely.com",
      supportEmail: "support@homely.com",
      whatsappNumber: "+233123456789",
      address: "Accra, Ghana",
    },
    social: {
      facebook: "https://facebook.com/homelyrealestate",
      twitter: "https://twitter.com/homelyrealestate",
      instagram: "https://instagram.com/homelyrealestate",
      linkedin: "https://linkedin.com/company/homelyrealestate",
      youtube: "",
    },
    logoUrl: "",
  };
}
