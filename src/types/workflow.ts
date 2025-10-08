// Types for background processor workflow
export interface WebsiteCreationOptions {
  userId: string;
  websiteName: string;
  userEmail: string;
  fullName: string;
  companyName: string;
  domainName: string;
  brandColors: string[];
  tagline: string;
  aboutSection: string;
  selectedTheme: string;
  layoutStyle: string;
  propertyTypes: string[];
  includedPages: string[];
  preferredContactMethod: string[];
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
