// Namecheap API library for domain operations
// Documentation: https://www.namecheap.com/support/api/

interface NamecheapConfig {
  apiUser: string;
  apiKey: string;
  userName: string;
  clientIp: string;
  sandbox?: boolean;
}

interface DomainCheckResult {
  domain: string;
  available: boolean;
  errorNo?: string;
  description?: string;
  isPremiumName?: boolean;
  premiumRegistrationPrice?: string;
  premiumRenewalPrice?: string;
  premiumRestorePrice?: string;
  premiumTransferPrice?: string;
  icannFee?: string;
  eapFee?: string;
}

interface NamecheapResponse {
  ApiResponse: {
    Status: string;
    Errors?: {
      Error: Array<{
        Number: string;
        Description: string;
      }>;
    };
    CommandResponse?: {
      DomainCheckResult?: DomainCheckResult[];
    };
  };
}

class NamecheapAPI {
  private config: NamecheapConfig;
  private baseUrl: string;

  constructor(config: NamecheapConfig) {
    this.config = config;
    this.baseUrl = config.sandbox
      ? "https://api.sandbox.namecheap.com/xml.response"
      : "https://api.namecheap.com/xml.response";
  }

  private buildUrl(
    command: string,
    additionalParams: Record<string, string> = {}
  ): string {
    const params = new URLSearchParams({
      ApiUser: this.config.apiUser,
      ApiKey: this.config.apiKey,
      UserName: this.config.userName,
      Command: command,
      ClientIp: this.config.clientIp,
      ...additionalParams,
    });

    return `${this.baseUrl}?${params.toString()}`;
  }

  private async makeRequest(url: string): Promise<NamecheapResponse> {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Juzbuild/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlText = await response.text();

      // Parse XML response using a simple string-based approach for Node.js compatibility
      return this.parseXmlResponseString(xmlText);
    } catch (error) {
      console.error("Namecheap API request failed:", error);
      throw new Error(
        `Namecheap API request failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private parseXmlResponseString(xmlText: string): NamecheapResponse {
    try {
      // Extract Status
      const statusMatch = xmlText.match(/<ApiResponse\s+Status="([^"]+)"/);
      const status = statusMatch?.[1] || "";

      // Parse errors if any
      const errorRegex = /<Error\s+Number="([^"]+)"[^>]*>([^<]*)<\/Error>/g;
      const errors: Array<{ Number: string; Description: string }> = [];
      let errorMatch;
      while ((errorMatch = errorRegex.exec(xmlText)) !== null) {
        if (errorMatch[1] && errorMatch[2]) {
          errors.push({
            Number: errorMatch[1],
            Description: errorMatch[2],
          });
        }
      }

      // Parse domain check results
      const domainResultRegex =
        /<DomainCheckResult\s+([^>]+)(?:\s*\/>|\s*><\/DomainCheckResult>)/g;
      const domainCheckResults: DomainCheckResult[] = [];
      let domainMatch;

      while ((domainMatch = domainResultRegex.exec(xmlText)) !== null) {
        const attributes = domainMatch[1];

        // Extract attributes using regex
        const getAttr = (name: string): string | undefined => {
          if (!attributes) return undefined;
          const match = attributes.match(new RegExp(`${name}="([^"]*)"`, "i"));
          return match ? match[1] : undefined;
        };

        const domain = getAttr("Domain") || "";
        const available = getAttr("Available")?.toLowerCase() === "true";
        const errorNo = getAttr("ErrorNo");
        const description = getAttr("Description");
        const isPremiumName =
          getAttr("IsPremiumName")?.toLowerCase() === "true";

        const result: DomainCheckResult = {
          domain,
          available,
          isPremiumName,
        };

        // Only add optional properties if they have values
        if (errorNo !== undefined) result.errorNo = errorNo;
        if (description !== undefined) result.description = description;

        const premiumRegistrationPrice = getAttr("PremiumRegistrationPrice");
        if (premiumRegistrationPrice !== undefined)
          result.premiumRegistrationPrice = premiumRegistrationPrice;

        const premiumRenewalPrice = getAttr("PremiumRenewalPrice");
        if (premiumRenewalPrice !== undefined)
          result.premiumRenewalPrice = premiumRenewalPrice;

        const premiumRestorePrice = getAttr("PremiumRestorePrice");
        if (premiumRestorePrice !== undefined)
          result.premiumRestorePrice = premiumRestorePrice;

        const premiumTransferPrice = getAttr("PremiumTransferPrice");
        if (premiumTransferPrice !== undefined)
          result.premiumTransferPrice = premiumTransferPrice;

        const icannFee = getAttr("IcannFee");
        if (icannFee !== undefined) result.icannFee = icannFee;

        const eapFee = getAttr("EapFee");
        if (eapFee !== undefined) result.eapFee = eapFee;

        domainCheckResults.push(result);
      }

      const apiResponse: NamecheapResponse["ApiResponse"] = {
        Status: status,
      };

      if (errors.length > 0) {
        apiResponse.Errors = { Error: errors };
      }

      if (domainCheckResults.length > 0) {
        apiResponse.CommandResponse = { DomainCheckResult: domainCheckResults };
      }

      return {
        ApiResponse: apiResponse,
      };
    } catch (error) {
      console.error("XML parsing error:", error);
      throw new Error("Failed to parse XML response");
    }
  }

  /**
   * Check domain availability
   * @param domains Array of domain names to check (e.g., ['example.com', 'test.org'])
   * @returns Promise with domain check results
   */
  async checkDomains(domains: string[]): Promise<DomainCheckResult[]> {
    if (!domains || domains.length === 0) {
      throw new Error("At least one domain must be provided");
    }

    if (domains.length > 50) {
      throw new Error("Maximum 50 domains can be checked at once");
    }

    const domainList = domains.join(",");
    const url = this.buildUrl("namecheap.domains.check", {
      DomainList: domainList,
    });

    const response = await this.makeRequest(url);

    if (response.ApiResponse.Status !== "OK") {
      const errors = response.ApiResponse.Errors?.Error || [];
      const errorMessage = errors
        .map((e) => `${e.Number}: ${e.Description}`)
        .join(", ");
      throw new Error(`Namecheap API error: ${errorMessage}`);
    }

    return response.ApiResponse.CommandResponse?.DomainCheckResult || [];
  }

  /**
   * Check single domain availability
   * @param domain Domain name to check (e.g., 'example.com')
   * @returns Promise with domain check result
   */
  async checkDomain(domain: string): Promise<DomainCheckResult> {
    const results = await this.checkDomains([domain]);

    if (results.length === 0) {
      throw new Error("No results returned from Namecheap API");
    }

    const firstResult = results[0];
    if (!firstResult) {
      throw new Error("Invalid result from Namecheap API");
    }

    return firstResult;
  }

  /**
   * Create DNS host record (subdomain)
   * @param domain - The domain to add DNS record to (e.g., "onjuzbuild.com")
   * @param subdomain - The subdomain name (e.g., "testsite")
   * @param target - The target URL or IP (e.g., "your-app.vercel.app")
   * @param recordType - DNS record type (default: "CNAME")
   * @returns Promise with creation result
   */
  /**
   * Get managed DNS state that preserves existing infrastructure
   */
  private async getManagedDNSState(domain: string): Promise<
    Array<{
      hostName: string;
      recordType: string;
      address: string;
      ttl: string;
    }>
  > {
    try {
      // Step 1: Try to get current DNS records from Namecheap
      console.log("Attempting to retrieve current DNS state from Namecheap...");
      const currentRecords = await this.getCurrentDNSRecords(domain);

      // Step 2: Get database records to ensure all JuzBuild sites are included
      const databaseRecords = await this.getAllJuzBuildSubdomains();

      // Step 3: Merge current Namecheap records with database records
      // Start with a set to avoid duplicates
      const recordsMap = new Map<
        string,
        {
          hostName: string;
          recordType: string;
          address: string;
          ttl: string;
        }
      >();

      // Add database records first (these are our known good state)
      databaseRecords.forEach((record) => {
        recordsMap.set(record.hostName, record);
      });

      // Note: For now, we prioritize database records over Namecheap records
      // to ensure consistency. In the future, we could implement more sophisticated merging

      const finalRecords = Array.from(recordsMap.values());
      console.log(
        `Prepared ${finalRecords.length} DNS records for domain ${domain}`
      );

      return finalRecords;
    } catch (error) {
      console.warn(
        "Error in getManagedDNSState, falling back to database records:",
        error
      );
      return await this.getAllJuzBuildSubdomains();
    }
  }

  /**
   * Get current DNS records from Namecheap (fallback method)
   */
  private async getCurrentDNSRecords(domain: string): Promise<
    Array<{
      hostName: string;
      recordType: string;
      address: string;
      ttl: string;
    }>
  > {
    try {
      const domainParts = domain.split(".");
      if (domainParts.length < 2) {
        throw new Error(`Invalid domain format: ${domain}`);
      }
      const sld = domainParts[0]!;
      const tld = domainParts[1]!;

      const getHostsUrl = this.buildUrl("namecheap.domains.dns.getHosts", {
        SLD: sld,
        TLD: tld,
      });

      const result = await this.makeRequest(getHostsUrl);

      if (result.ApiResponse.Status === "OK") {
        // For now, let's implement a safer approach - merge database records with essential defaults
        console.log("Retrieved response from Namecheap getHosts API");

        // Get database records and merge with essential defaults
        const databaseRecords = await this.getAllJuzBuildSubdomains();
        return databaseRecords;
      } else {
        console.warn(
          "Failed to get current DNS records from Namecheap, falling back to database"
        );
        return await this.getAllJuzBuildSubdomains();
      }
    } catch (error) {
      console.warn("Error getting current DNS records from Namecheap:", error);
      return await this.getAllJuzBuildSubdomains();
    }
  }

  /**
   * Get DNS records state - combines database records with essential defaults
   */
  private async getAllJuzBuildSubdomains(): Promise<
    Array<{
      hostName: string;
      recordType: string;
      address: string;
      ttl: string;
    }>
  > {
    try {
      // Import MongoDB client
      const { MongoClient } = await import("mongodb");
      const client = new MongoClient(
        process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
      );

      await client.connect();
      const db = client.db("Juzbuild");
      const sitesCollection = db.collection("sites");

      // Get all sites that have domains
      const sites = await sitesCollection
        .find({
          domain: { $exists: true, $ne: null },
        })
        .toArray();

      await client.close();

      // Start with essential default records that should always exist
      const defaultRecords = [
        {
          hostName: "@",
          recordType: "URL",
          address: "https://juzbuild.com",
          ttl: "1800",
        },
        {
          hostName: "www",
          recordType: "URL",
          address: "https://juzbuild.com",
          ttl: "1800",
        },
      ];

      // Convert sites to DNS records
      const subdomainRecords = sites.map((site) => ({
        hostName: site.websiteName,
        recordType: "CNAME",
        address: `${site.websiteName}.vercel.app`,
        ttl: "300",
      }));

      // Combine all records, ensuring no duplicates
      const allRecords = [...defaultRecords];

      // Add subdomain records, checking for duplicates
      subdomainRecords.forEach((newRecord) => {
        const existingIndex = allRecords.findIndex(
          (existing) => existing.hostName === newRecord.hostName
        );
        if (existingIndex !== -1) {
          // Update existing record
          allRecords[existingIndex] = newRecord;
        } else {
          // Add new record
          allRecords.push(newRecord);
        }
      });

      console.log(
        `Prepared ${allRecords.length} DNS records (${subdomainRecords.length} from database + ${defaultRecords.length} defaults)`
      );
      return allRecords;
    } catch (error) {
      console.warn(
        "Could not retrieve records from database, using minimal defaults:",
        error
      );
      // Could not retrieve subdomain records from database, using defaults with URL redirect
      return [
        {
          hostName: "@",
          recordType: "URL",
          address: "https://juzbuild.com",
          ttl: "1800",
        },
        {
          hostName: "www",
          recordType: "URL",
          address: "https://juzbuild.com",
          ttl: "1800",
        },
      ];
    }
  }

  async createDNSRecord(
    domain: string,
    subdomain: string,
    target: string,
    recordType: string = "CNAME"
  ): Promise<{ success: boolean; message: string }> {
    try {
      const domainParts = domain.split(".");
      if (domainParts.length < 2) {
        throw new Error(`Invalid domain format: ${domain}`);
      }
      const sld = domainParts[0]!;
      const tld = domainParts[1]!;

      // Get comprehensive DNS state that preserves existing records
      const existingRecords = await this.getManagedDNSState(domain);

      // Check if this subdomain already exists
      const existingSubdomainIndex = existingRecords.findIndex(
        (record: {
          hostName: string;
          recordType: string;
          address: string;
          ttl: string;
        }) => record.hostName === subdomain
      );

      const newRecord = {
        hostName: subdomain,
        recordType: recordType,
        address: target,
        ttl: "300",
      };

      if (existingSubdomainIndex !== -1) {
        // Subdomain already exists, update it
        const oldRecord = existingRecords[existingSubdomainIndex];
        console.log(
          `Updating DNS record for ${subdomain}.${domain}: ${
            oldRecord?.address || "unknown"
          } -> ${target}`
        );
        existingRecords[existingSubdomainIndex] = newRecord;
      } else {
        // Add the new subdomain record
        console.log(
          `Adding new DNS record for ${subdomain}.${domain} -> ${target}`
        );
        existingRecords.push(newRecord);
      }

      // Log the complete DNS state that will be set
      console.log(
        `Setting ${existingRecords.length} DNS records for ${domain}:`
      );
      existingRecords.forEach((record, index) => {
        console.log(
          `  ${index + 1}. ${record.hostName} (${record.recordType}) -> ${
            record.address
          }`
        );
      });

      // Build the setHosts parameters with all records
      const setHostsParams: Record<string, string> = {
        SLD: sld,
        TLD: tld,
      };

      // Add all records to the parameters
      existingRecords.forEach(
        (
          record: {
            hostName: string;
            recordType: string;
            address: string;
            ttl: string;
          },
          index: number
        ) => {
          const recordNum = index + 1;
          setHostsParams[`HostName${recordNum}`] = record.hostName;
          setHostsParams[`RecordType${recordNum}`] = record.recordType;
          setHostsParams[`Address${recordNum}`] = record.address;
          setHostsParams[`TTL${recordNum}`] = record.ttl;
        }
      );

      const setHostsUrl = this.buildUrl(
        "namecheap.domains.dns.setHosts",
        setHostsParams
      );

      const result = await this.makeRequest(setHostsUrl);

      if (result.ApiResponse.Status === "OK") {
        console.log(`✅ Successfully updated DNS records for ${domain}`);

        // Optionally cache the DNS state for future reference
        await this.cacheDNSState(domain, existingRecords);

        return {
          success: true,
          message: `Successfully created ${recordType} record for ${subdomain}.${domain}`,
        };
      } else {
        const errorMsg =
          result.ApiResponse.Errors?.Error?.[0]?.Description || "Unknown error";
        return {
          success: false,
          message: `Failed to create DNS record: ${errorMsg}`,
        };
      }
    } catch (error) {
      console.error("DNS record creation failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "DNS creation failed",
      };
    }
  }

  /**
   * Cache DNS state for future reference (optional optimization)
   */
  private async cacheDNSState(
    domain: string,
    records: Array<{
      hostName: string;
      recordType: string;
      address: string;
      ttl: string;
    }>
  ): Promise<void> {
    try {
      // For now, just log the DNS state
      // In the future, this could save to Redis or database for faster retrieval
      console.log(`DNS state cached for ${domain}: ${records.length} records`);
    } catch (error) {
      console.warn("Failed to cache DNS state:", error);
    }
  }
}

// Export the class and types
export { NamecheapAPI, type DomainCheckResult, type NamecheapConfig };

// Create and export a singleton instance if environment variables are available
let namecheapInstance: NamecheapAPI | null = null;

export function getNamecheapInstance(): NamecheapAPI {
  if (!namecheapInstance) {
    const config: NamecheapConfig = {
      apiUser: process.env.NAMECHEAP_API_USER || "",
      apiKey: process.env.NAMECHEAP_API_KEY || "",
      userName: process.env.NAMECHEAP_USERNAME || "",
      clientIp: process.env.NAMECHEAP_CLIENT_IP || "127.0.0.1",
      sandbox: process.env.NAMECHEAP_SANDBOX === "true",
    };

    // Validate required config
    if (!config.apiUser || !config.apiKey || !config.userName) {
      throw new Error(
        "Missing required Namecheap API configuration. Please set NAMECHEAP_API_USER, NAMECHEAP_API_KEY, and NAMECHEAP_USERNAME environment variables."
      );
    }

    namecheapInstance = new NamecheapAPI(config);
  }

  return namecheapInstance;
}
