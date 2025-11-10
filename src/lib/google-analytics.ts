// Google Analytics 4 Integration Service
// Manages GA4 property creation and credential management for user websites

import { google } from "googleapis";

// Initialize Google Analytics Admin API
let analyticsAdmin: any = null;

async function initializeAnalyticsAdmin() {
  if (analyticsAdmin) return analyticsAdmin;

  try {
    // Get credentials from environment
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!keyFile) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set"
      );
    }

    // Parse the service account key
    const credentials = JSON.parse(
      Buffer.from(keyFile, "base64").toString("utf-8")
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/analytics.edit"],
    });

    analyticsAdmin = google.analyticsadmin({
      version: "v1beta",
      auth,
    });

    return analyticsAdmin;
  } catch (error) {
    console.error("Failed to initialize Google Analytics Admin API:", error);
    throw error;
  }
}

interface GAPropertyConfig {
  displayName: string;
  propertyType: "PROPERTY_TYPE_ORDINARY" | "PROPERTY_TYPE_UNSPECIFIED";
  timeZone: string;
  currencyCode: string;
}

interface GAPropertyResponse {
  measurementId: string;
  propertyName: string;
  googleAnalyticsAccountId: string;
  success: boolean;
}

/**
 * Create a new Google Analytics 4 property for a website
 */
export async function createGA4Property(
  websiteName: string,
  timezone: string = "America/New_York",
  currency: string = "USD"
): Promise<GAPropertyResponse> {
  try {
    // Get the parent account ID from environment
    const parentAccountId = process.env.GOOGLE_ANALYTICS_ACCOUNT_ID;
    if (!parentAccountId) {
      throw new Error(
        "GOOGLE_ANALYTICS_ACCOUNT_ID environment variable not set"
      );
    }

    // Get credentials from environment
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!keyFile) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set"
      );
    }

    const credentials = JSON.parse(
      Buffer.from(keyFile, "base64").toString("utf-8")
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/analytics.edit"],
    });

    const authClient = await auth.getClient();

    // Create GA4 property using direct REST API
    const propertyCreateResponse = await authClient.request({
      method: "POST",
      url: `https://analyticsadmin.googleapis.com/v1beta/properties`,
      data: {
        parent: `accounts/${parentAccountId}`,
        displayName: `${websiteName} - GA4 Property`,
        timeZone: timezone,
        currencyCode: currency,
        propertyType: "PROPERTY_TYPE_ORDINARY",
      },
    } as any);

    const propertyName = (propertyCreateResponse.data as any)?.name;
    const propertyId = propertyName?.split("/")[1];

    if (!propertyId) {
      throw new Error("Failed to extract property ID from GA response");
    }

    // Create a web data stream for the property
    const streamCreateResponse = await authClient.request({
      method: "POST",
      url: `https://analyticsadmin.googleapis.com/v1beta/${propertyName}/dataStreams`,
      data: {
        displayName: `${websiteName} Website Stream`,
        type: "WEB_DATA_STREAM", // Must use enum value, not "WEB"
        webStreamData: {
          defaultUri: `https://${websiteName
            .toLowerCase()
            .replace(/\s+/g, "-")}.com`,
        },
      },
    } as any);

    const streamData = streamCreateResponse.data as any;
    const measurementId = streamData?.webStreamData?.measurementId;

    if (!measurementId) {
      throw new Error("Failed to get measurement ID from data stream");
    }

    // Create conversion events using direct REST API
    await createConversionEvent(
      propertyName,
      "contact_form_submission",
      authClient
    );
    await createConversionEvent(propertyName, "property_inquiry", authClient);
    await createConversionEvent(
      propertyName,
      "contact_phone_click",
      authClient
    );

    return {
      measurementId,
      propertyName,
      googleAnalyticsAccountId: propertyId,
      success: true,
    };
  } catch (error) {
    console.error("Error creating GA4 property:", error);
    throw error;
  }
}

/**
 * Create a conversion event in the GA4 property
 */
async function createConversionEvent(
  propertyName: string,
  eventName: string,
  authClient?: any
): Promise<void> {
  try {
    let client = authClient;

    // If no client provided, create one
    if (!client) {
      const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      if (!keyFile) {
        throw new Error(
          "GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set"
        );
      }

      const credentials = JSON.parse(
        Buffer.from(keyFile, "base64").toString("utf-8")
      );

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/analytics.edit"],
      });

      client = await auth.getClient();
    }

    // Create conversion event using direct REST API
    await client.request({
      method: "POST",
      url: `https://analyticsadmin.googleapis.com/v1beta/${propertyName}/conversionEvents`,
      data: {
        eventName,
      },
    } as any);

    console.log(`Created conversion event: ${eventName}`);
  } catch (error: any) {
    // It's okay if the event already exists
    if (error.message && error.message.includes("already exists")) {
      console.log(`Conversion event ${eventName} already exists`);
    } else {
      console.error(`Error creating conversion event ${eventName}:`, error);
    }
  }
}

/**
 * Get GA4 measurement ID for a property
 */
export async function getGA4MeasurementId(
  propertyName: string
): Promise<string | null> {
  try {
    const admin = await initializeAnalyticsAdmin();

    const response = await admin.properties_dataStreams.list({
      parent: propertyName,
    });

    const dataStreams = response.data.dataStreams || [];
    for (const stream of dataStreams) {
      if (stream.type === "WEB") {
        return stream.webStreamData?.measurementId || null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching measurement ID:", error);
    return null;
  }
}

interface GAReportRequest {
  measurementId: string;
  metrics: string[];
  dimensions?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface GAMetrics {
  users: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  pageviews: number;
  avgSessionDuration: number;
  conversionRate: number;
  totalConversions: number;
  [key: string]: number;
}

/**
 * Fetch GA4 metrics data using the Reporting API
 */
export async function fetchGA4Report(
  measurementId: string,
  startDate: string = "30daysAgo",
  endDate: string = "today"
): Promise<GAMetrics> {
  try {
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!keyFile) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set"
      );
    }

    const credentials = JSON.parse(
      Buffer.from(keyFile, "base64").toString("utf-8")
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsdata = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    const response = await analyticsdata.properties.runReport({
      property: `properties/${measurementId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "bounceRate" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "conversions" },
        ],
        dimensions: [{ name: "date" }],
      },
    });

    // Process and aggregate the data
    let totalUsers = 0;
    let totalNewUsers = 0;
    let totalSessions = 0;
    let totalBounceRate = 0;
    let totalPageviews = 0;
    let totalAvgDuration = 0;
    let totalConversions = 0;
    let rowCount = 0;

    const rows = response.data.rows || [];
    rows.forEach((row: any) => {
      const values = row.metricValues || [];
      if (values.length >= 7) {
        totalUsers += parseInt(values[0]?.value || "0", 10);
        totalNewUsers += parseInt(values[1]?.value || "0", 10);
        totalSessions += parseInt(values[2]?.value || "0", 10);
        totalBounceRate += parseFloat(values[3]?.value || "0");
        totalPageviews += parseInt(values[4]?.value || "0", 10);
        totalAvgDuration += parseFloat(values[5]?.value || "0");
        totalConversions += parseInt(values[6]?.value || "0", 10);
        rowCount++;
      }
    });

    const conversionRate =
      totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

    return {
      users: totalUsers,
      newUsers: totalNewUsers,
      sessions: totalSessions,
      bounceRate: rowCount > 0 ? totalBounceRate / rowCount : 0,
      pageviews: totalPageviews,
      avgSessionDuration: rowCount > 0 ? totalAvgDuration / rowCount : 0,
      conversionRate,
      totalConversions,
    };
  } catch (error) {
    console.error("Error fetching GA4 report:", error);
    // Return default metrics if API call fails
    return {
      users: 0,
      newUsers: 0,
      sessions: 0,
      bounceRate: 0,
      pageviews: 0,
      avgSessionDuration: 0,
      conversionRate: 0,
      totalConversions: 0,
    };
  }
}

/**
 * Generate GA4 script tag for embedding in website templates
 */
export function generateGA4Script(measurementId: string): string {
  return `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId}', {
    'page_path': window.location.pathname,
    'anonymize_ip': true,
    'send_page_view': true
  });
  
  // Track form submissions
  window.trackFormSubmission = function(formName) {
    gtag('event', 'form_submission', {
      'form_name': formName,
      'timestamp': new Date().toISOString()
    });
  };
  
  // Track property inquiries
  window.trackPropertyInquiry = function(propertyId, propertyName) {
    gtag('event', 'property_inquiry', {
      'property_id': propertyId,
      'property_name': propertyName,
      'timestamp': new Date().toISOString()
    });
  };
  
  // Track contact clicks
  window.trackContactClick = function(contactType) {
    gtag('event', 'contact_click', {
      'contact_type': contactType,
      'timestamp': new Date().toISOString()
    });
  };
</script>`;
}

/**
 * Generate environment variables for GA4 integration
 */
export function generateGA4EnvVariables(
  measurementId: string
): Record<string, string> {
  return {
    NEXT_PUBLIC_GA_ID: measurementId,
    NEXT_PUBLIC_GA_ENABLED: "true",
  };
}

export default {
  createGA4Property,
  getGA4MeasurementId,
  fetchGA4Report,
  generateGA4Script,
  generateGA4EnvVariables,
};
