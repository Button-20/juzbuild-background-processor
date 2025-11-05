// Types for background processor workflow
export interface WebsiteCreationOptions {
  userId: string;
  websiteName: string;
  userEmail: string;
  fullName: string;
  companyName: string;
  domainName: string;
  logoUrl?: string; // Cloudinary URL for uploaded logo
  brandColors: string[];
  tagline: string;
  aboutSection: string;
  selectedTheme: string;
  propertyTypes: string[];
  includedPages: string[];
  preferredContactMethod: string[];
  leadCaptureMethods?: string[];
  geminiApiKey?: string;

  // Contact Information
  phoneNumber?: string;
  supportEmail?: string;
  whatsappNumber?: string;
  address?: string;

  // Social Media Links
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
}

export interface WorkflowResult {
  success: boolean;
  data?: any;
  error?: string;
  step?: string;
}

export interface WebsiteCreationJob {
  id: string;
  websiteName: string;
  status: "pending" | "processing" | "completed" | "failed";
  startTime: Date;
  endTime?: Date;
  currentStep?: string;
  error?: string;
  results?: any;
}
