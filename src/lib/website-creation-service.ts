// Website creation workflow service with all automated steps

import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { jobTracker } from "./job-tracker.js";
import { getNamecheapInstance } from "./namecheap.js";
import { getVercelInstance } from "./vercel.js";

// Theme display name mapping - fetch from database
async function getThemeDisplayName(themeId: string): Promise<string> {
  try {
    const client = new MongoClient(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Juzbuild"
    );

    await client.connect();
    const db = client.db("Juzbuild");
    const themesCollection = db.collection("themes");

    // Try to find theme by ObjectId
    let theme = null;

    try {
      theme = await themesCollection.findOne({ _id: new ObjectId(themeId) });
    } catch {
      // If themeId is not a valid ObjectId, try finding by name
      theme = await themesCollection.findOne({ name: themeId });
    }

    await client.close();

    if (theme && theme.name) {
      return theme.name;
    }

    // Fallback to capitalizing the ID
    return themeId.charAt(0).toUpperCase() + themeId.slice(1);
  } catch (error) {
    console.error("Error fetching theme name:", error);
    return themeId.charAt(0).toUpperCase() + themeId.slice(1);
  }
}

interface WebsiteCreationOptions {
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

interface WorkflowResult {
  success: boolean;
  data?: any;
  error?: string;
  step?: string;
}

class WebsiteCreationService {
  private mongoClient: MongoClient;
  private octokit: Octokit;

  constructor() {
    this.mongoClient = new MongoClient(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Juzbuild"
    );
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  /**
   * Generate a standardized database name for a website
   * Ensures consistent naming across all methods
   */
  private generateDatabaseName(websiteName: string): string {
    return `juzbuild_${websiteName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  }

  /**
   * Prepare environment variables for Vercel deployment
   * Maps user configuration to environment variables needed by the template
   */
  private prepareEnvironmentVariables(
    options: WebsiteCreationOptions
  ): Record<string, string> {
    const dbName = this.generateDatabaseName(options.websiteName);
    const baseURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Juzbuild";

    // Construct the MongoDB URI for this specific website
    let mongodbUri: string;
    if (baseURI.includes("mongodb+srv://") || baseURI.includes("mongodb://")) {
      const uriParts = baseURI.split("/");
      if (uriParts.length >= 3) {
        const lastPart = uriParts[uriParts.length - 1];
        if (lastPart) {
          const queryIndex = lastPart.indexOf("?");
          const queryParams =
            queryIndex !== -1 ? lastPart.substring(queryIndex) : "";
          uriParts[uriParts.length - 1] = dbName + queryParams;
          mongodbUri = uriParts.join("/");
        } else {
          mongodbUri = baseURI + "/" + dbName;
        }
      } else {
        mongodbUri = baseURI + "/" + dbName;
      }
    } else {
      mongodbUri = baseURI.replace(/\/[^\/]*$/, `/${dbName}`);
    }

    // Prepare environment variables
    const envVars: Record<string, string> = {
      // Database
      MONGODB_URI: mongodbUri,

      // Email service
      RESEND_API_KEY: process.env.RESEND_API_KEY || "",

      // Cloudinary for image uploads
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

      // AI Configuration - Gemini API for chatbot
      GOOGLE_API_KEY: options.geminiApiKey || "",
      NEXT_PUBLIC_GOOGLE_API_KEY: options.geminiApiKey || "",

      // Public configuration - Company Info
      NEXT_PUBLIC_COMPANY_NAME: options.companyName,
      NEXT_PUBLIC_COMPANY_TAGLINE: options.tagline,

      // Public configuration - Contact Info
      NEXT_PUBLIC_EMAIL: options.supportEmail || options.userEmail,
      NEXT_PUBLIC_SUPPORT_EMAIL:
        options.supportEmail || options.userEmail || "",
      NEXT_PUBLIC_PHONE_NUMBER: options.phoneNumber || "",
      NEXT_PUBLIC_WHATSAPP_NUMBER:
        options.whatsappNumber || options.phoneNumber || "",
      NEXT_PUBLIC_ADDRESS: options.address || "",

      // Public configuration - Social Media
      NEXT_PUBLIC_FACEBOOK_URL: options.facebookUrl || "",
      NEXT_PUBLIC_TWITTER_URL: options.twitterUrl || "",
      NEXT_PUBLIC_INSTAGRAM_URL: options.instagramUrl || "",
      NEXT_PUBLIC_LINKEDIN_URL: options.linkedinUrl || "",
      NEXT_PUBLIC_YOUTUBE_URL: options.youtubeUrl || "",

      // Public configuration - Email settings
      NEXT_PUBLIC_FROM_EMAIL:
        options.supportEmail ||
        `${options.domainName}@${process.env.NEXT_PUBLIC_FROM_DOMAIN}`,
      NEXT_PUBLIC_FROM_NAME: options.companyName,

      // Public configuration - App URL (Vercel will set this)
      NEXT_PUBLIC_APP_URL: `https://${options.domainName}.onjuzbuild.com`,

      // Additional metadata
      SITE_NAME: options.companyName,
      AUTHOR_NAME: options.fullName,
    };

    // Filter out empty values to avoid setting empty environment variables
    const filteredEnvVars: Record<string, string> = {};
    for (const [key, value] of Object.entries(envVars)) {
      if (value && value.trim() !== "") {
        filteredEnvVars[key] = value;
      }
    }

    console.log(
      `Prepared ${
        Object.keys(filteredEnvVars).length
      } environment variables for deployment`
    );

    return filteredEnvVars;
  }

  /**
   * Main workflow orchestrator
   */
  async createWebsite(
    options: WebsiteCreationOptions,
    jobId?: string
  ): Promise<WorkflowResult> {
    const results: any = {};
    let vercelUrl: string | undefined;

    try {
      // Step 1: Database Creation
      console.log(`📊 Step 1: Creating database for ${options.websiteName}...`);
      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Database Setup",
          "in-progress",
          "Setting up database...",
          15
        );
      }

      const dbResult = await this.createLocalDatabase(options);
      if (!dbResult.success) {
        if (jobId) {
          await jobTracker.updateStep(
            jobId,
            "Database Setup",
            "failed",
            "Database setup failed",
            15
          );
        }
        return {
          success: false,
          error: `Database creation failed: ${dbResult.error}`,
          step: "Database Creation",
        };
      }
      results["Database Creation"] = dbResult.data;

      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Database Setup",
          "completed",
          "Database setup completed",
          30
        );
      }
      console.log(`✅ Database created successfully`);

      // Step 2: Template Generation
      console.log(
        `🎨 Step 2: Generating template for ${options.websiteName}...`
      );
      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Template Configuration",
          "in-progress",
          "Configuring website template...",
          45
        );
      }

      const templateResult = await this.generateTemplate(options);
      if (!templateResult.success) {
        if (jobId) {
          await jobTracker.updateStep(
            jobId,
            "Template Configuration",
            "failed",
            "Template configuration failed",
            45
          );
        }
        return {
          success: false,
          error: `Template generation failed: ${templateResult.error}`,
          step: "Template Generation",
        };
      }
      results["Template Generation"] = templateResult.data;

      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Template Configuration",
          "completed",
          "Template configuration completed",
          55
        );
      }
      console.log(`✅ Template generated successfully`);

      // Step 3: GitHub Repository
      console.log(
        `🐙 Step 3: Creating GitHub repository for ${options.websiteName}...`
      );
      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "GitHub Repository",
          "in-progress",
          "Creating GitHub repository...",
          65
        );
      }

      const githubResult = await this.pushToGitHub(options);
      if (!githubResult.success) {
        if (jobId) {
          await jobTracker.updateStep(
            jobId,
            "GitHub Repository",
            "failed",
            "GitHub repository creation failed",
            65
          );
        }
        return {
          success: false,
          error: `GitHub repository creation failed: ${githubResult.error}`,
          step: "GitHub Repository",
        };
      }
      results["GitHub Repository"] = githubResult.data;

      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "GitHub Repository",
          "completed",
          "GitHub repository created",
          75
        );
      }
      console.log(`✅ GitHub repository created successfully`);

      // Step 4: Vercel Deployment
      console.log(
        `🚀 Step 4: Deploying to Vercel for ${options.websiteName}...`
      );
      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Vercel Deployment",
          "in-progress",
          "Deploying to Vercel...",
          85
        );
      }

      const vercelResult = await this.deployToVercel(
        options,
        githubResult,
        jobId
      );
      if (!vercelResult.success) {
        if (jobId) {
          await jobTracker.updateStep(
            jobId,
            "Vercel Deployment",
            "failed",
            "Vercel deployment failed",
            85
          );
        }
        return {
          success: false,
          error: `Vercel deployment failed: ${vercelResult.error}`,
          step: "Vercel Deployment",
        };
      }
      results["Vercel Deployment"] = vercelResult.data;
      vercelUrl = vercelResult.data?.vercelUrl;
      const aliasUrl = vercelResult.data?.aliasUrl; // Get the alias URL
      const vercelProjectName = vercelResult.data?.projectName; // Get the project name

      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Vercel Deployment",
          "completed",
          "Vercel deployment completed",
          90
        );
      }
      console.log(`✅ Vercel deployment completed successfully`);

      // Step 5: Subdomain Setup
      console.log(
        `🌐 Step 5: Setting up subdomain for ${options.websiteName}...`
      );
      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Domain Configuration",
          "in-progress",
          "Configuring domain...",
          95
        );
      }

      const subdomainResult = await this.createSubdomainOnNamecheap(
        options,
        vercelUrl,
        vercelProjectName
      );
      if (!subdomainResult.success) {
        if (jobId) {
          await jobTracker.updateStep(
            jobId,
            "Domain Configuration",
            "failed",
            "Domain configuration failed",
            95
          );
        }
        return {
          success: false,
          error: `Subdomain setup failed: ${subdomainResult.error}`,
          step: "Subdomain Setup",
        };
      }
      results["Subdomain Setup"] = subdomainResult.data;

      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Domain Configuration",
          "completed",
          "Domain configuration completed",
          98
        );
      }
      console.log(`✅ Subdomain configured successfully`);

      // Step 6: Final Testing & Email Notification (non-blocking)
      console.log(
        `🧪 Step 6: Running final tests for ${options.websiteName}...`
      );
      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Final Testing",
          "in-progress",
          "Running final tests...",
          99
        );
      }

      // Email notification - non-blocking (don't fail workflow if email fails)
      try {
        const emailResult = await this.sendSetupNotification(options);
        if (emailResult.success) {
          results["Email Notification"] = emailResult.data;
          console.log("✅ Setup notification email sent successfully");
        } else {
          console.warn(
            `⚠️ Email notification failed (non-critical): ${emailResult.error}`
          );
          results["Email Notification"] = {
            sent: false,
            error: emailResult.error,
            note: "Email notification failed but website creation succeeded",
          };
        }
      } catch (emailError: any) {
        console.warn(
          `⚠️ Email notification error (non-critical): ${
            emailError?.message || emailError
          }`
        );
        results["Email Notification"] = {
          sent: false,
          error: emailError?.message || "Email service error",
          note: "Email notification failed but website creation succeeded",
        };
      }

      // Step 7: Database Logging
      const loggingResult = await this.logSiteCreation(options);
      if (!loggingResult.success) {
        if (jobId) {
          await jobTracker.updateStep(
            jobId,
            "Final Testing",
            "failed",
            "Final testing failed",
            99
          );
        }
        return {
          success: false,
          error: `Database logging failed: ${loggingResult.error}`,
          step: "Database Logging",
        };
      }
      results["Database Logging"] = loggingResult.data;

      if (jobId) {
        await jobTracker.updateStep(
          jobId,
          "Final Testing",
          "completed",
          "Website creation completed!",
          100
        );
      }
      console.log(`✅ Website creation completed successfully`);

      // Step 8: Cleanup temporary template
      console.log(
        `🧹 Step 8: Cleaning up template files for ${options.websiteName}...`
      );
      await this.cleanupTemplate(options.websiteName);
      console.log(`✅ Template cleanup completed`);

      console.log(
        `🎉 Website creation completed successfully for ${options.websiteName}!`
      );

      return {
        success: true,
        data: {
          websitename:
            options.websiteName.toLowerCase().replace(/[^a-z0-9]/g, "-") +
            "-" +
            Date.now(),
          domain: `${options.domainName}.onjuzbuild.com`,
          websiteUrl:
            vercelUrl || `https://${options.domainName}.onjuzbuild.com`,
          aliasUrl: aliasUrl, // Include the alias URL for the frontend
          status: "active",
          results,
        },
      };
    } catch (error) {
      console.error("Website creation workflow failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Step 1: Create local MongoDB database
   */
  async createLocalDatabase(
    options: WebsiteCreationOptions
  ): Promise<WorkflowResult> {
    try {
      const dbName = this.generateDatabaseName(options.websiteName);

      // Properly construct the MongoDB URI with the new database name
      const baseURI =
        process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Juzbuild";
      let connectionString: string;

      if (
        baseURI.includes("mongodb+srv://") ||
        baseURI.includes("mongodb://")
      ) {
        // For MongoDB Atlas URIs, replace the database name properly
        // Pattern: mongodb+srv://user:pass@cluster.net/dbname?params
        const uriParts = baseURI.split("/");
        if (uriParts.length >= 3) {
          // Replace the database name (after the last slash, before query params)
          const lastPart = uriParts[uriParts.length - 1];
          if (lastPart) {
            const queryIndex = lastPart.indexOf("?");
            const queryParams =
              queryIndex !== -1 ? lastPart.substring(queryIndex) : "";

            uriParts[uriParts.length - 1] = dbName + queryParams;
            connectionString = uriParts.join("/");
          } else {
            connectionString = baseURI + "/" + dbName;
          }
        } else {
          connectionString = baseURI + "/" + dbName;
        }
      } else {
        connectionString = baseURI.replace(/\/[^\/]*$/, `/${dbName}`);
      }

      const client = new MongoClient(connectionString);
      await client.connect();
      const db = client.db(dbName);

      // Create property types first
      const propertyTypeIds = new Map<string, ObjectId>();

      // Generate property type icons for common types
      const propertyTypeIcons: Record<string, string> = {
        Houses: "🏠",
        Apartments: "🏢",
        Condos: "🏬",
        Townhouses: "🏘️",
        Lands: "🌍",
        Commercial: "🏪",
        Rentals: "🏚️",
        "Luxury Homes": "🏛️",
      };

      // Generate property type images for custom types
      const propertyTypeImages: Record<string, string> = {
        Houses:
          "https://res.cloudinary.com/dho8jec7k/image/upload/v1760940915/house_mic0ne.jpg",
        Apartments:
          "https://res.cloudinary.com/dho8jec7k/image/upload/v1760941571/freepik__generate-a-high-quality-background-sized-image-of-__51374_joitmh.png",
        Condos:
          "https://res.cloudinary.com/dho8jec7k/image/upload/v1760941867/freepik__the-style-is-candid-image-photography-with-natural__51375_thscsq.png",
        Townhouses:
          "https://res.cloudinary.com/dho8jec7k/image/upload/v1760943197/freepik__the-style-is-candid-image-photography-with-natural__51376_fropgl.png",
        Lands:
          "https://res.cloudinary.com/dho8jec7k/image/upload/v1760943604/73ad8688-ed02-4641-aaa3-2a9f88736ecb_ie15de.jpg",
        Commercial:
          "https://res.cloudinary.com/dho8jec7k/image/upload/v1760943753/d693266c-6352-4818-bb54-bead3b9eb86c_urzsci.jpg",
        Rentals:
          "https://res.cloudinary.com/dho8jec7k/image/upload/v1760943870/36728946-3323-4407-ac5f-39eb72e49a5b_a45amg.jpg",
        "Luxury Homes":
          "https://res.cloudinary.com/dho8jec7k/image/upload/v1760944265/luxury_homes_os9otk.jpg",
      };

      // Create property types from user selections
      const userPropertyTypes = options.propertyTypes.map((typeName) => {
        const _id = new ObjectId();
        const slug = typeName.toLowerCase().replace(/[^a-z0-9]/g, "-");

        // Store ID for reference when creating sample properties
        propertyTypeIds.set(typeName, _id);

        return {
          _id,
          name: typeName,
          slug,
          description: `${typeName} properties`,
          image: propertyTypeImages[typeName] || "",
          icon: propertyTypeIcons[typeName] || "�",
          isActive: true,
          userId: options.userId,
          domain: `${options.domainName}.onjuzbuild.com`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      // Insert property types
      const propertyTypesCollection = db.collection("property-types");
      await propertyTypesCollection.insertMany(userPropertyTypes);

      // Create collections with initial data
      const collections = [
        {
          name: "settings",
          data: {
            siteName: options.companyName,
            primaryColor:
              (options.brandColors && options.brandColors[0]) || "#3B82F6",
            secondaryColor:
              (options.brandColors && options.brandColors[1]) || "#EF4444",
            accentColor:
              (options.brandColors && options.brandColors[2]) || "#10B981",
            theme: options.selectedTheme,
            tagline: options.tagline,
            aboutSection: options.aboutSection,
            contactMethods: options.preferredContactMethod,
            userEmail: options.userEmail,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          name: "properties",
          data: [
            {
              _id: new ObjectId(),
              name: "Luxury Family Home",
              slug: "luxury-family-home",
              description:
                "Beautiful 4-bedroom family home in prime location with modern amenities and spacious living areas.",
              location: "123 Main Street, Downtown",
              price: 750000,
              currency: "USD",
              propertyType:
                propertyTypeIds
                  .get(options.propertyTypes[0] || "House")
                  ?.toString() || new ObjectId().toString(),
              status: "for-sale",
              beds: 4,
              baths: 3,
              area: 2500,
              images: [
                {
                  src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760938451/image-3_pbgbet.jpg",
                  alt: "Luxury Family Home - Main View",
                  isMain: true,
                },
              ],
              amenities: ["Garden", "Garage", "Modern Kitchen", "Fireplace"],
              features: ["Family Room", "Master Suite", "Walk-in Closet"],
              coordinates: {
                lat: 40.7128,
                lng: -74.006,
              },
              isActive: true,
              isFeatured: true,
              userId: options.userId,
              websiteId: undefined,
              domain: `${options.domainName}.onjuzbuild.com`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              _id: new ObjectId(),
              name: "Modern Downtown Condo",
              slug: "modern-downtown-condo",
              description:
                "Contemporary 2-bedroom condo with stunning city views and premium finishes throughout.",
              location: "456 Downtown Ave, City Center",
              price: 450000,
              currency: "USD",
              propertyType:
                propertyTypeIds
                  .get(
                    options.propertyTypes[1] ||
                      options.propertyTypes[0] ||
                      "Condo"
                  )
                  ?.toString() || new ObjectId().toString(),
              status: "for-sale",
              beds: 2,
              baths: 2,
              area: 1200,
              images: [
                {
                  src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760938446/image-2_btqiku.jpg",
                  alt: "Modern Downtown Condo - Living Area",
                  isMain: true,
                },
              ],
              amenities: ["City Views", "Balcony", "Gym Access", "Concierge"],
              features: [
                "Open Floor Plan",
                "Floor-to-Ceiling Windows",
                "In-Unit Laundry",
              ],
              coordinates: {
                lat: 40.7589,
                lng: -73.9851,
              },
              isActive: true,
              isFeatured: true,
              userId: options.userId,
              websiteId: undefined,
              domain: `${options.domainName}.onjuzbuild.com`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              _id: new ObjectId(),
              name: "Cozy Starter Home",
              slug: "cozy-starter-home",
              description:
                "Perfect first home with beautiful garden and attached garage in a quiet neighborhood.",
              location: "789 Residential St, Suburbs",
              price: 325000,
              currency: "USD",
              propertyType:
                propertyTypeIds
                  .get(options.propertyTypes[0] || "House")
                  ?.toString() || new ObjectId().toString(),
              status: "for-sale",
              beds: 3,
              baths: 2,
              area: 1800,
              images: [
                {
                  src: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760938448/image-4_jhxupa.jpg",
                  alt: "Cozy Starter Home - Front View",
                  isMain: true,
                },
              ],
              amenities: ["Garden", "Attached Garage", "Patio", "Storage"],
              features: [
                "Quiet Neighborhood",
                "Updated Kitchen",
                "Hardwood Floors",
              ],
              coordinates: {
                lat: 40.6892,
                lng: -74.0445,
              },
              isActive: true,
              isFeatured: false,
              userId: options.userId,
              websiteId: undefined,
              domain: `${options.domainName}.onjuzbuild.com`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          name: "pages",
          data: (
            options.includedPages || ["home", "listings", "about", "contact"]
          ).map((pageId) => ({
            pageId: pageId,
            slug: pageId === "home" ? "/" : `/${pageId}`,
            title: pageId.charAt(0).toUpperCase() + pageId.slice(1),
            isEnabled: true,
            order: (
              options.includedPages || ["home", "listings", "about", "contact"]
            ).indexOf(pageId),
            createdAt: new Date(),
          })),
        },
        {
          name: "users",
          data: [],
        },
        {
          name: "inquiries",
          data: [],
        },
      ];

      for (const collection of collections) {
        const coll = db.collection(collection.name);
        if (Array.isArray(collection.data)) {
          // Only insert if array has data
          if (collection.data.length > 0) {
            await coll.insertMany(collection.data);
          }
        } else {
          await coll.insertOne(collection.data);
        }
      }

      await client.close();

      return {
        success: true,
        data: {
          databaseName: dbName,
          connectionString,
          collections: collections.map((c) => c.name),
        },
      };
    } catch (error) {
      console.error("Database creation failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Database creation failed",
      };
    }
  }

  /**
   * Step 2: Generate website template based on homely template
   */
  async generateTemplate(
    options: WebsiteCreationOptions
  ): Promise<WorkflowResult> {
    try {
      const homelyBasePath = path.join(process.cwd(), "templates", "homely");
      const templatePath = path.join(
        process.cwd(),
        "templates",
        options.websiteName
      );

      // Check if homely template exists
      if (
        !(await fs
          .access(homelyBasePath)
          .then(() => true)
          .catch(() => false))
      ) {
        throw new Error("Homely base template not found");
      }

      // Copy homely template to user's template directory
      await this.copyDirectory(homelyBasePath, templatePath);

      // Remove admin dashboard configuration
      await this.removeAdminDashboard(templatePath);

      // Configure dynamic database connection
      await this.configureDynamicDatabase(templatePath, options);

      // Create additional pages based on user selections
      await this.createUserPages(templatePath, options);

      // Update navigation based on selected pages
      await this.updateNavigation(templatePath, options);

      // Update template configuration and branding
      await this.customizeTemplate(templatePath, options);

      return {
        success: true,
        data: {
          templatePath,
          structure:
            "Customized homely template with user-specific configuration",
          removedAdmin: true,
          dynamicDatabase: true,
          customPages: options.includedPages?.length || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Template generation failed",
      };
    }
  }

  /**
   * Step 3: Create GitHub repository and push code
   */
  async pushToGitHub(options: WebsiteCreationOptions): Promise<WorkflowResult> {
    try {
      // Check if we have GitHub configuration
      const githubToken = process.env.GITHUB_TOKEN;
      const githubUsername = process.env.GITHUB_USERNAME;

      if (!githubToken || !githubUsername) {
        console.log(
          "GitHub integration not configured, skipping repository creation"
        );
        const repoName =
          options.websiteName.toLowerCase().replace(/[^a-z0-9]/g, "-") +
          "-" +
          Date.now();
        return {
          success: true,
          data: {
            repoUrl: `https://github.com/${
              githubUsername || "juzbuild"
            }/${repoName}`,
            reponame: repoName,
            owner: githubUsername || "juzbuild",
            note: "GitHub integration not configured - skipped",
          },
        };
      }

      // Initialize Octokit with authentication
      const octokit = new Octokit({ auth: githubToken });

      // Create safe repository name
      const repoName =
        options.websiteName.toLowerCase().replace(/[^a-z0-9]/g, "-") +
        "-" +
        Date.now();

      // Create repository
      console.log(`Creating GitHub repository: ${repoName}`);
      const repo = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: `Real estate website for ${options.companyName} - Created with Juzbuild`,
        private: true,
        auto_init: false, // Don't initialize with README, we'll create our own
      });

      console.log(`✅ GitHub repository created: ${repo.data.html_url}`);

      // Create README.md for the repository
      const readmeContent = `# ${options.companyName} - Real Estate Website

This is a professional real estate website created with [Juzbuild](https://juzbuild.com).

## About ${options.companyName}

${options.aboutSection}

**Tagline:** ${options.tagline}

## Website Features

- 🏠 Property listings and search
- 📱 Mobile-responsive design
- 🎨 Modern, professional styling
- ⚡ Fast loading and optimized
- 📧 Contact forms and lead capture

## Getting Started

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Run development server: \`npm run dev\`
4. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This website is configured for easy deployment to Vercel, Netlify, or any other hosting platform.

## Support

For support and customization, contact [Juzbuild Support](https://juzbuild.com/support).

---

*Built with Juzbuild - Professional Real Estate Websites*
`;
      // First, add the README
      await this.safeCreateOrUpdateFile(
        octokit,
        githubUsername,
        repoName,
        "README.md",
        readmeContent,
        "Initial commit: Add project README"
      );

      // Now push all template files to the repository
      console.log("Pushing template files to GitHub repository...");
      const templatePath = path.join(
        process.cwd(),
        "templates",
        options.websiteName
      );
      await this.pushTemplateFiles(
        octokit,
        githubUsername,
        repoName,
        templatePath
      );

      return {
        success: true,
        data: {
          repoUrl: repo.data.html_url,
          reponame: repoName,
          owner: githubUsername,
          cloneUrl: repo.data.clone_url,
        },
      };
    } catch (error) {
      console.error("GitHub push failed:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "GitHub repository creation failed",
      };
    }
  }

  /**
   * Verify that GitHub repository exists and has commits before Vercel deployment
   */
  private async verifyGitHubRepository(
    orgName: string,
    repoName: string,
    maxAttempts: number = 10,
    delayMs: number = 2000
  ): Promise<void> {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    console.log(
      `Verifying repository ${orgName}/${repoName} exists and has content...`
    );

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Check if repository exists
        const repo = await octokit.repos.get({
          owner: orgName,
          repo: repoName,
        });

        if (!repo.data) {
          throw new Error("Repository not found");
        }

        console.log(
          `Repository ${orgName}/${repoName} exists (attempt ${attempt})`
        );

        // Check if repository has commits
        try {
          const commits = await octokit.repos.listCommits({
            owner: orgName,
            repo: repoName,
            per_page: 1,
          });

          if (commits.data && commits.data.length > 0) {
            console.log(
              `Repository has ${commits.data.length} commits - ready for deployment`
            );

            // Check if main branch exists
            try {
              await octokit.repos.getBranch({
                owner: orgName,
                repo: repoName,
                branch: "main",
              });
              console.log("Main branch verified - repository is ready");
              return; // Success!
            } catch (branchError) {
              console.log(
                "Main branch not found, checking for master branch..."
              );
              try {
                await octokit.repos.getBranch({
                  owner: orgName,
                  repo: repoName,
                  branch: "master",
                });
                console.log("Master branch found - repository is ready");
                return; // Success!
              } catch (masterError) {
                console.log("Neither main nor master branch found, waiting...");
              }
            }
          } else {
            console.log(
              `Repository exists but has no commits yet (attempt ${attempt})`
            );
          }
        } catch (commitsError) {
          console.log(
            `Repository exists but commits not accessible yet (attempt ${attempt})`
          );
        }

        // Wait before next attempt
        if (attempt < maxAttempts) {
          console.log(
            `Waiting ${delayMs}ms before next verification attempt...`
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.log(
          `Repository verification attempt ${attempt} failed:`,
          error instanceof Error ? error.message : String(error)
        );

        if (attempt < maxAttempts) {
          console.log(`Waiting ${delayMs}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw new Error(
      `Repository ${orgName}/${repoName} is not ready for deployment after ${maxAttempts} attempts. ` +
        "Please ensure the repository exists and has been fully populated with commits."
    );
  }

  /**
   * Step 4: Deploy to Vercel
   */
  async deployToVercel(
    options: WebsiteCreationOptions,
    githubResult?: any,
    jobId?: string
  ): Promise<WorkflowResult> {
    try {
      // Check if we have Vercel configuration
      const vercelToken = process.env.VERCEL_TOKEN;

      if (!vercelToken) {
        console.log("Vercel integration not configured, skipping deployment");
        return {
          success: true,
          data: {
            deploymentUrl: `https://${options.websiteName}.vercel.app`,
            status: "skipped",
            note: "Vercel integration not configured - manual deployment required",
          },
        };
      }

      // Initialize Vercel API
      const vercel = getVercelInstance();

      // Use GitHub result data if available, otherwise fallback
      const repoUrl =
        githubResult?.data?.repoUrl ||
        `https://github.com/${process.env.GITHUB_USERNAME || "juzbuild"}/${
          options.websiteName
        }`;
      const repoName = githubResult?.data?.reponame || options.websiteName;

      // Extract GitHub org and repo from URL
      const repoPath = repoUrl.replace("https://github.com/", "");
      const [orgName, repoNameOnly] = repoPath.split("/");

      if (!orgName || !repoNameOnly) {
        throw new Error(`Invalid GitHub URL format: ${repoUrl}`);
      }

      console.log(`Creating Vercel deployment for ${orgName}/${repoNameOnly}`);

      // Verify GitHub repository exists and has content before deploying
      console.log("Verifying GitHub repository readiness...");
      await this.verifyGitHubRepository(orgName, repoNameOnly);

      // Update step status - Creating project
      if (jobId) {
        const { jobTracker } = await import("./job-tracker.js");
        await jobTracker.updateStep(
          jobId,
          "Vercel Deployment",
          "in-progress",
          "Creating Vercel project...",
          70
        );
      }

      // Create project with a clean name (just use the base website name without timestamp)
      const cleanProjectName = options.websiteName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");

      // Prepare environment variables for the project
      const envVars = this.prepareEnvironmentVariables(options);

      // Log WhatsApp number configuration for debugging
      console.log(`📱 WhatsApp Configuration:
        - Input WhatsApp Number: ${options.whatsappNumber || "(not provided)"}
        - Input Phone Number: ${options.phoneNumber || "(not provided)"}
        - Final NEXT_PUBLIC_WHATSAPP_NUMBER: ${
          envVars.NEXT_PUBLIC_WHATSAPP_NUMBER || "(empty)"
        }
      `);

      const project = await vercel.createProject(
        cleanProjectName,
        repoUrl,
        "nextjs",
        envVars
      );
      console.log(
        `Vercel project created: ${project.id} with name: ${cleanProjectName}`
      );

      // Wait for project setup to complete, GitHub to propagate, and environment variables to be applied
      // Environment variables need time to propagate in Vercel's system before deployment
      console.log(
        "⏳ Waiting for environment variables to propagate in Vercel..."
      );
      await new Promise((resolve) => setTimeout(resolve, 15000)); // Increased from 8s to 15s

      // Update step status - Creating deployment
      if (jobId) {
        const { jobTracker } = await import("./job-tracker.js");
        await jobTracker.updateStep(
          jobId,
          "Vercel Deployment",
          "in-progress",
          "Creating deployment...",
          75
        );
      }

      // Create deployment using the clean project name
      const deployment = await vercel.createDeploymentFromGit(
        cleanProjectName,
        repoUrl
      );
      console.log(
        `Deployment created: ID ${deployment.id} with status ${deployment.status}`
      );

      // Check deployment status with polling
      let deploymentStatus = deployment.status;
      let deploymentURL = deployment.url;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max wait time

      // Update step status - Building
      if (jobId) {
        const { jobTracker } = await import("./job-tracker.js");
        await jobTracker.updateStep(
          jobId,
          "Vercel Deployment",
          "in-progress",
          "Building and deploying...",
          80
        );
      }

      while (
        (deploymentStatus === "BUILDING" ||
          deploymentStatus === "INITIALIZING" ||
          deploymentStatus === "QUEUED") &&
        attempts < maxAttempts
      ) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds between checks
        attempts++;

        try {
          const statusUpdate = await vercel.getDeploymentStatus(deployment.id);
          deploymentStatus = statusUpdate.status;
          deploymentURL = statusUpdate.url;
          console.log(
            `Deployment status check ${attempts}: ${deploymentStatus}`
          );

          // Update progress during deployment
          if (jobId && attempts % 3 === 0) {
            // Update every 3rd attempt to avoid spam
            const { jobTracker } = await import("./job-tracker.js");
            const progressMsg =
              deploymentStatus === "BUILDING"
                ? `Building deployment (${Math.min(attempts * 2 + 80, 85)}%)...`
                : `Deployment ${deploymentStatus.toLowerCase()}...`;
            await jobTracker.updateStep(
              jobId,
              "Vercel Deployment",
              "in-progress",
              progressMsg,
              Math.min(attempts * 2 + 80, 85)
            );
          }
        } catch (error) {
          console.warn(
            `Failed to check deployment status (attempt ${attempts}):`,
            error
          );
          // Continue polling, might be temporary API issue
        }
      }

      if (deploymentStatus === "READY") {
        console.log(`Deployment successful. URL: https://${deploymentURL}`);

        // Create alias for production deployment with the clean project name
        try {
          const aliasName = `${cleanProjectName}.vercel.app`;
          console.log(`Creating alias: ${aliasName}`);

          // The deployment URL should use the clean project name for the alias
          const aliasUrl = `${cleanProjectName}.vercel.app`;

          return {
            success: true,
            data: {
              projectId: project.id,
              projectName: cleanProjectName, // Use cleanProjectName for consistency
              deploymentId: deployment.id,
              deploymentUrl: `https://${aliasUrl}`,
              status: "ready",
              vercelUrl: aliasUrl,
              aliasUrl: `https://${aliasUrl}`, // Add the alias URL specifically
              readyState: deployment.readyState,
              note: "Deployment completed successfully",
            },
          };
        } catch (aliasError) {
          console.warn(
            "Alias creation failed, but deployment succeeded:",
            aliasError
          );

          // Return with the original deployment URL if alias fails
          return {
            success: true,
            data: {
              projectId: project.id,
              projectName: project.name,
              deploymentId: deployment.id,
              deploymentUrl: `https://${deploymentURL}`,
              status: "ready",
              vercelUrl: deploymentURL,
              aliasUrl: `https://${cleanProjectName}.vercel.app`, // Still provide the expected alias URL
              readyState: deployment.readyState,
              note: "Deployment completed successfully",
            },
          };
        }
      } else if (
        deploymentStatus === "ERROR" ||
        deploymentStatus === "CANCELED"
      ) {
        throw new Error(
          `Deployment ${deploymentStatus.toLowerCase()}: ${
            deploymentURL || "No URL available"
          }`
        );
      } else {
        // Deployment is still in progress but we've reached max attempts
        console.warn(
          `Deployment still in progress after ${maxAttempts} attempts. Status: ${deploymentStatus}`
        );

        return {
          success: true,
          data: {
            projectId: project.id,
            projectName: project.name,
            deploymentId: deployment.id,
            deploymentUrl: `https://${cleanProjectName}.vercel.app`,
            status: "building",
            vercelUrl: `${cleanProjectName}.vercel.app`,
            aliasUrl: `https://${cleanProjectName}.vercel.app`,
            readyState: deployment.readyState,
            note: `Deployment in progress (${deploymentStatus}). Check Vercel dashboard for updates.`,
          },
        };
      }
    } catch (error) {
      console.error("Vercel deployment failed:", error);

      let errorMessage = "Vercel deployment failed";

      if (error instanceof Error) {
        // Check for specific GitHub repository errors
        if (
          error.message.includes("incorrect_git_source_info") ||
          error.message.includes("does not contain the requested branch")
        ) {
          errorMessage =
            "GitHub repository is not ready for deployment. " +
            "The repository may be empty or still being created. " +
            "Please try again in a few minutes.";
        } else if (
          error.message.includes("Repository") &&
          error.message.includes("not ready")
        ) {
          errorMessage = error.message; // Use our custom verification error message
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Step 5: Create Namecheap subdomain and configure Vercel custom domain
   */
  async createSubdomainOnNamecheap(
    options: WebsiteCreationOptions,
    vercelUrl?: string,
    vercelProjectName?: string
  ): Promise<WorkflowResult> {
    try {
      const subdomain = `${options.websiteName}.onjuzbuild.com`;
      const customDomain = `${options.domainName}.onjuzbuild.com`;

      // Check if we have Namecheap configuration
      const namecheapApiUser = process.env.NAMECHEAP_API_USER;
      const namecheapApiKey = process.env.NAMECHEAP_API_KEY;

      if (!namecheapApiUser || !namecheapApiKey) {
        console.log(
          `Namecheap integration not configured, skipping subdomain creation for: ${subdomain}`
        );
        return {
          success: true,
          data: {
            subdomain,
            customDomain,
            cname: vercelUrl || "your-deployment-url.vercel.app",
            status: "configured",
            note: "Namecheap integration not configured - manual DNS setup required",
          },
        };
      }

      // Initialize Namecheap API
      const namecheap = getNamecheapInstance();

      // Step 1: Add custom domain to Vercel project
      let cnameTarget = "cname.vercel-dns.com"; // Default Vercel CNAME target
      let domainAddedToVercel = false;

      if (vercelProjectName && process.env.VERCEL_TOKEN) {
        try {
          console.log(
            `Adding custom domain ${customDomain} to Vercel project ${vercelProjectName}...`
          );
          const vercel = getVercelInstance();

          // Add domain to Vercel
          const domainResult = await vercel.addProjectDomain(
            vercelProjectName,
            customDomain
          );

          domainAddedToVercel = true;
          console.log(
            `✓ Domain added to Vercel: ${domainResult.name} (Verified: ${domainResult.verified})`
          );

          // Get the CNAME target from Vercel
          const domainConfig = await vercel.getDomainConfig(
            vercelProjectName,
            customDomain
          );

          if (domainConfig.cnameTarget) {
            cnameTarget = domainConfig.cnameTarget;
            console.log(`✓ CNAME target from Vercel: ${cnameTarget}`);
          } else {
            console.log(`✓ Using default CNAME target: ${cnameTarget}`);
          }
        } catch (vercelError: any) {
          console.error(
            `Failed to add domain to Vercel:`,
            vercelError?.message || vercelError
          );
          console.log(`Will proceed with default CNAME target: ${cnameTarget}`);
        }
      } else {
        console.log(
          `Vercel configuration not available. Using default CNAME: ${cnameTarget}`
        );
      }

      // Step 2: Create CNAME record on Namecheap
      console.log(`Creating CNAME record: ${customDomain} -> ${cnameTarget}`);

      const dnsResult = await namecheap.createVercelCNAME(
        options.domainName,
        "onjuzbuild.com",
        cnameTarget
      );

      if (dnsResult.success) {
        console.log(
          `✅ CNAME record created successfully: ${customDomain} -> ${cnameTarget}`
        );

        // Wait for DNS propagation (optional)
        console.log("Waiting for DNS propagation...");
        await new Promise((resolve) => setTimeout(resolve, 3000));

        return {
          success: true,
          data: {
            subdomain,
            customDomain,
            cname: cnameTarget,
            vercelDomain: vercelUrl,
            domainAddedToVercel,
            status: "active",
            message: dnsResult.message,
            dnsPropagationNote:
              "DNS changes may take up to 24-48 hours to fully propagate",
          },
        };
      } else {
        console.error(`❌ DNS creation failed: ${dnsResult.message}`);
        return {
          success: false,
          error: `Subdomain creation failed: ${dnsResult.message}`,
        };
      }
    } catch (error) {
      console.error("Subdomain creation failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Subdomain creation failed",
      };
    }
  }

  /**
   * Step 6: Send setup notification email
   */
  async sendSetupNotification(
    options: WebsiteCreationOptions
  ): Promise<WorkflowResult> {
    try {
      const domain = `${options.websiteName}.onjuzbuild.com`;
      const websiteUrl = `https://${domain}`;

      // Check if we have Resend API key configured
      const resendApiKey = process.env.JUZBUILD_RESEND_API_KEY;

      if (!resendApiKey) {
        console.log(
          `Email not configured, skipping notification to: ${options.userEmail}`
        );
        return {
          success: true,
          data: {
            emailSent: false,
            recipient: options.userEmail,
            domain,
            note: "Email service not configured - notification skipped",
          },
        };
      }

      // Import and use the email service
      const { sendWebsiteCreationEmail } = await import("./email.js");

      // Get theme display name
      const themeDisplayName = await getThemeDisplayName(options.selectedTheme);

      await sendWebsiteCreationEmail({
        userEmail: options.userEmail,
        companyName: options.companyName,
        websiteName: options.companyName, // Use actual company name instead of slug
        domain,
        theme: themeDisplayName,
        websiteUrl,
        createdAt: new Date().toLocaleString(),
      });

      console.log(`✅ Website creation email sent to: ${options.userEmail}`);

      return {
        success: true,
        data: {
          emailSent: true,
          recipient: options.userEmail,
          originalRecipient: options.userEmail,
          domain,
          websiteUrl,
        },
      };
    } catch (error) {
      console.error("Email notification failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Email notification failed",
      };
    }
  }

  /**
   * Step 7: Log site creation in main database
   */
  async logSiteCreation(
    options: WebsiteCreationOptions
  ): Promise<WorkflowResult> {
    console.log(
      "[logSiteCreation] Starting site creation logging for:",
      options.companyName
    );

    // Create a new MongoDB client for this operation to avoid connection conflicts
    const client = new MongoClient(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Juzbuild"
    );

    try {
      console.log("[logSiteCreation] Connecting to MongoDB...");
      await client.connect();
      console.log("[logSiteCreation] Connected to MongoDB successfully");

      const db = client.db("Juzbuild");
      const sitesCollection = db.collection("sites");

      const siteRecord = {
        userId: options.userId,
        userEmail: options.userEmail,
        websiteName: options.companyName || options.websiteName, // Use companyName as display name
        companyName: options.companyName,
        templatePath: `/templates/${options.websiteName}`,
        repoUrl: `https://github.com/${process.env.GITHUB_USERNAME}/${options.websiteName}`,
        domain: `${options.domainName}.onjuzbuild.com`,
        websiteUrl: `https://${options.domainName}.onjuzbuild.com`,
        dbName: this.generateDatabaseName(options.websiteName),
        status: "active",
        theme: options.selectedTheme,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log(
        "[logSiteCreation] Logging site creation for userId:",
        options.userId
      );
      console.log("[logSiteCreation] userId type:", typeof options.userId);
      console.log(
        "[logSiteCreation] Site record:",
        JSON.stringify(siteRecord, null, 2)
      );
      console.log("[logSiteCreation] Inserting into sites collection...");

      const result = await sitesCollection.insertOne(siteRecord);

      console.log(
        "[logSiteCreation] ✅ Site record inserted successfully! ID:",
        result.insertedId.toString()
      );

      return {
        success: true,
        data: {
          siteId: result.insertedId.toString(),
          logged: true,
        },
      };
    } catch (error) {
      console.error("[logSiteCreation] ❌ Site logging failed:", error);
      console.error("[logSiteCreation] Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Site logging failed",
      };
    } finally {
      console.log("[logSiteCreation] Closing MongoDB connection");
      await client.close();
    }
  }

  // Helper methods continue with all the original implementations...
  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  private async removeAdminDashboard(templatePath: string): Promise<void> {
    const adminPath = path.join(templatePath, "src", "app", "admin");

    // Remove admin directory if it exists
    try {
      await fs.rm(adminPath, { recursive: true, force: true });
    } catch (error) {
      // Admin directory might not exist, continue
    }

    // Note: We preserve the (site) route group and all its contents
    // The (site) folder contains the public-facing routes and must be preserved
    // so it can be pushed to GitHub as part of the generated template.

    // Fix layout.tsx syntax issues
    const layoutPath = path.join(templatePath, "src", "app", "layout.tsx");
    try {
      let layoutContent = await fs.readFile(layoutPath, "utf-8");

      // Remove admin-related imports and routes
      layoutContent = layoutContent.replace(/import.*admin.*\n/gi, "");
      layoutContent = layoutContent.replace(/\/admin.*\n/gi, "");

      // Fix broken title syntax - remove "Generated by create next app" if it's malformed
      layoutContent = layoutContent.replace(
        /title:\s*"([^"]*)"[^",\n]*Generated[^",\n]*"/g,
        'title: "$1"'
      );

      // Ensure proper comma after title
      layoutContent = layoutContent.replace(
        /title:\s*"([^"]*)"(?!\s*[,}])/g,
        'title: "$1",'
      );

      await fs.writeFile(layoutPath, layoutContent);
    } catch (error) {
      // Layout file might not exist or have different structure
    }
  }

  private async configureDynamicDatabase(
    templatePath: string,
    options: WebsiteCreationOptions
  ): Promise<void> {
    const dbName = this.generateDatabaseName(options.websiteName);

    // Properly construct the MongoDB URI with the new database name
    const baseURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Juzbuild";
    let connectionString: string;

    if (baseURI.includes("mongodb+srv://") || baseURI.includes("mongodb://")) {
      // For MongoDB Atlas URIs, replace the database name properly
      const uriParts = baseURI.split("/");
      if (uriParts.length >= 3) {
        const lastPart = uriParts[uriParts.length - 1];
        if (lastPart) {
          const queryIndex = lastPart.indexOf("?");
          const queryParams =
            queryIndex !== -1 ? lastPart.substring(queryIndex) : "";

          uriParts[uriParts.length - 1] = dbName + queryParams;
          connectionString = uriParts.join("/");
        } else {
          connectionString = baseURI + "/" + dbName;
        }
      } else {
        connectionString = baseURI + "/" + dbName;
      }
    } else {
      connectionString = `${baseURI}/${dbName}`;
    }

    // Update database configuration files
    const configFiles = [
      "src/lib/mongodb.ts",
      "src/lib/database.ts",
      "src/config/database.ts",
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(templatePath, configFile);
      try {
        let content = await fs.readFile(configPath, "utf-8");

        // Replace database connection with user-specific database
        content = content.replace(/mongodb:\/\/[^"']+/g, connectionString);

        // Replace database name references
        content = content.replace(
          /database\s*=\s*client\.db\(['"]\w+['"]\)/g,
          `database = client.db("${dbName}")`
        );

        await fs.writeFile(configPath, content);
      } catch (error) {
        // File might not exist, continue with next file
      }
    }

    // Create environment file with database configuration
    const envPath = path.join(templatePath, ".env.local");
    const envContent = `
MONGODB_URI=${connectionString}
DATABASE_NAME=${dbName}
NEXT_PUBLIC_SITE_NAME=${options.companyName || options.websiteName}
NEXT_PUBLIC_SITE_URL=https://${options.websiteName}.vercel.app
`;

    await fs.writeFile(envPath, envContent.trim());
  }

  private async createUserPages(
    templatePath: string,
    options: WebsiteCreationOptions
  ): Promise<void> {
    const appPagesDir = path.join(templatePath, "src", "app");

    // Map onboarding page IDs to actual folder names in the template
    const pageMapping: Record<string, string> = {
      home: "", // Root page (page.tsx in app folder)
      listings: "properties",
      about: "about",
      contact: "contactus",
      blog: "blogs",
    };

    // Pages/folders that should always be kept (not page folders)
    const alwaysKeepItems = [
      "privacy-policy",
      "terms-of-service",
      "api",
      "context",
      "favicon.ico",
      "globals.css",
      "layout.tsx",
      "not-found.tsx",
      "page.tsx", // Home page
    ];

    // Get the list of selected pages (use IDs from onboarding)
    const includedPageIds = options.includedPages || [
      "home",
      "listings",
      "about",
      "contact",
    ];

    // Get all items in app directory
    const existingItems = await fs.readdir(appPagesDir, {
      withFileTypes: true,
    });

    // Remove pages that were NOT selected
    for (const item of existingItems) {
      const itemName = item.name;

      // Always keep essential files and legal pages
      if (alwaysKeepItems.includes(itemName)) {
        continue;
      }

      // Only process directories (page folders)
      if (!item.isDirectory()) {
        continue;
      }

      // Check if this folder corresponds to a page that should be kept
      const shouldKeep = Object.entries(pageMapping).some(
        ([pageId, mappedFolder]) => {
          return mappedFolder === itemName && includedPageIds.includes(pageId);
        }
      );

      // Remove the folder if it wasn't selected
      if (!shouldKeep) {
        const itemPath = path.join(appPagesDir, itemName);
        console.log(`Removing unselected page: ${itemName}`);
        await fs.rm(itemPath, { recursive: true, force: true });
      }
    }

    console.log(
      `Enabled pages: ${includedPageIds
        .map((id) => pageMapping[id] || id)
        .filter((p) => p)
        .join(", ")} + legal pages`
    );
  }

  private async updateNavigation(
    templatePath: string,
    options: WebsiteCreationOptions
  ): Promise<void> {
    const navLinkPath = path.join(
      templatePath,
      "src",
      "app",
      "api",
      "navlink.tsx"
    );

    // Map onboarding page IDs to navigation items
    const pageToNavItem: Record<
      string,
      { label: string; href: string; order: number }
    > = {
      home: { label: "Home", href: "/", order: 1 },
      about: { label: "About", href: "/about", order: 2 },
      listings: { label: "Properties", href: "/properties", order: 3 },
      blog: { label: "Blog", href: "/blogs", order: 4 },
      contact: { label: "Contact", href: "/contactus", order: 5 },
    };

    // Get selected pages
    const includedPageIds = options.includedPages || [
      "home",
      "listings",
      "contact",
    ];

    // Build navigation items based on selected pages
    const navItems = includedPageIds
      .map((pageId) => pageToNavItem[pageId])
      .filter(
        (item): item is { label: string; href: string; order: number } =>
          item !== undefined
      )
      .sort((a, b) => a.order - b.order);

    // Generate new navigation file content
    const navContent = `import { NavLinks } from "@/types/navlink";

export const navLinks: NavLinks[] = [
${navItems
  .map((item) => `  { label: "${item.label}", href: "${item.href}" },`)
  .join("\n")}
];
`;

    try {
      await fs.writeFile(navLinkPath, navContent);
      console.log(
        `Updated navigation with ${navItems.length} links: ${navItems
          .map((n) => n.label)
          .join(", ")}`
      );
    } catch (error) {
      console.error("Failed to update navigation:", error);
    }
  }

  private async customizeTemplate(
    templatePath: string,
    options: WebsiteCreationOptions
  ): Promise<void> {
    // Update package.json with user's project name
    const packageJsonPath = path.join(templatePath, "package.json");
    try {
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8")
      );
      packageJson.name = options.websiteName;
      packageJson.description = `${
        options.companyName || options.websiteName
      } - Real Estate Website`;

      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      // Package.json might not exist or be malformed
    }

    // Update next.config.ts with comprehensive user data
    await this.updateNextConfigFile(templatePath, options);

    // Update globals.css with selected color palette
    await this.updateGlobalsCssColors(templatePath, options);

    // Update other site configuration files with user's branding
    const configFiles = ["src/config/site.ts", "src/lib/config.ts"];

    for (const configFile of configFiles) {
      const configPath = path.join(templatePath, configFile);
      try {
        let content = await fs.readFile(configPath, "utf-8");

        // Replace site name and branding
        content = content.replace(
          /site.*name.*:.*"[^"]+"/gi,
          `siteName: "${options.companyName || options.websiteName}"`
        );
        content = content.replace(
          /title.*:.*"[^"]+"/gi,
          `title: "${options.companyName || options.websiteName}"`
        );
        content = content.replace(
          /description.*:.*"[^"]+"/gi,
          `description: "${
            options.tagline || "Professional Real Estate Services"
          }"`
        );

        // Replace color scheme if provided
        if (options.brandColors && options.brandColors.length > 0) {
          content = content.replace(
            /primary.*:.*"[^"]+"/gi,
            `primary: "${options.brandColors[0]}"`
          );
        }

        await fs.writeFile(configPath, content);
      } catch (error) {
        // File might not exist
      }
    }

    // Update main layout with user's branding
    const layoutPath = path.join(templatePath, "src", "app", "layout.tsx");
    try {
      let layoutContent = await fs.readFile(layoutPath, "utf-8");

      // Fix common syntax issues in layout.tsx first
      // Remove any malformed title strings with "Generated by" text
      layoutContent = layoutContent.replace(
        /title:\s*"([^"]*)"[^",\n]*Generated[^",\n]*"/g,
        'title: "$1"'
      );

      // Ensure proper metadata structure
      layoutContent = layoutContent.replace(
        /title:\s*"([^"]*)"(?!\s*[,}\n])/g,
        'title: "$1",'
      );

      // Update metadata with user's information
      layoutContent = layoutContent.replace(
        /(title:\s*)"[^"]*"/g,
        `$1"${options.companyName || options.websiteName}"`
      );
      layoutContent = layoutContent.replace(
        /(description:\s*)"[^"]*"/g,
        `$1"${options.tagline || "Professional Real Estate Services"}"`
      );

      // Fix any trailing commas or syntax issues
      layoutContent = layoutContent.replace(/,(\s*})/g, "$1");

      await fs.writeFile(layoutPath, layoutContent);
    } catch (error) {
      // Layout might have different structure, create a minimal one
      const minimalLayout = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${options.companyName || options.websiteName}',
  description: '${options.tagline || "Professional Real Estate Services"}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`;
      await fs.writeFile(layoutPath, minimalLayout);
    }

    // Replace logos with user's uploaded logo if provided
    if (options.logoUrl) {
      await this.replaceLogosInTemplate(templatePath, options.logoUrl);
    }
  }

  private async replaceLogosInTemplate(
    templatePath: string,
    logoUrl: string
  ): Promise<void> {
    try {
      // Optimize logo URL for sizing if it's a Cloudinary URL
      const optimizedLogoUrl = this.optimizeLogoUrl(logoUrl);

      // Replace favicon.ico with the logo
      await this.replaceFavicon(templatePath, logoUrl);

      // Common logo file patterns to replace
      const logoPatterns = [
        "logo.svg",
        "logo.png",
        "logo.jpg",
        "logo-dark.svg",
        "logo-light.svg",
        "icon.svg",
        "icon.png",
      ];

      // Search in common directories
      const searchDirs = [
        "public",
        "public/images",
        "public/icons",
        "public/assets",
        "src/assets",
        "assets",
      ];

      for (const searchDir of searchDirs) {
        const fullSearchPath = path.join(templatePath, searchDir);

        try {
          const files = await fs.readdir(fullSearchPath, { recursive: true });

          for (const file of files) {
            const fileName = path.basename(file.toString());
            if (logoPatterns.includes(fileName.toLowerCase())) {
              const filePath = path.join(fullSearchPath, file.toString());

              // Download the optimized logo from Cloudinary and replace the file
              try {
                const response = await fetch(optimizedLogoUrl);
                if (response.ok) {
                  const buffer = await response.arrayBuffer();
                  await fs.writeFile(filePath, Buffer.from(buffer));
                }
              } catch (downloadError) {
                // Continue with other files if one fails
              }
            }
          }
        } catch (dirError) {
          // Directory might not exist, continue with others
        }
      }

      // Also replace logo references in component files
      await this.replaceLogoReferencesInComponents(
        templatePath,
        optimizedLogoUrl
      );

      // Add CSS rules for logo sizing
      await this.addLogoSizingCSS(templatePath);
    } catch (error) {
      // Logo replacement is optional, don't fail the entire process
    }
  }

  private async replaceLogoReferencesInComponents(
    templatePath: string,
    logoUrl: string
  ): Promise<void> {
    try {
      // Find all component files that might reference logos
      const componentDirs = ["src/components", "components"];

      for (const componentDir of componentDirs) {
        const fullComponentPath = path.join(templatePath, componentDir);

        try {
          const files = await fs.readdir(fullComponentPath, {
            recursive: true,
          });

          for (const file of files) {
            const fileName = file.toString();
            if (
              fileName.endsWith(".tsx") ||
              fileName.endsWith(".jsx") ||
              fileName.endsWith(".ts") ||
              fileName.endsWith(".js")
            ) {
              const filePath = path.join(fullComponentPath, fileName);

              try {
                let content = await fs.readFile(filePath, "utf-8");

                // Replace common logo import patterns
                content = content.replace(
                  /(['"`])\/[^'"`]*logo[^'"`]*\.(svg|png|jpg|jpeg)['"`]/gi,
                  `$1${logoUrl}$1`
                );

                // Replace relative logo paths
                content = content.replace(
                  /(['"`])\.\.[^'"`]*logo[^'"`]*\.(svg|png|jpg|jpeg)['"`]/gi,
                  `$1${logoUrl}$1`
                );

                // Replace src attributes in img tags and add size constraints
                content = content.replace(
                  /src\s*=\s*(['"`])[^'"`]*logo[^'"`]*\.(svg|png|jpg|jpeg)['"`]/gi,
                  `src=$1${logoUrl}$1`
                );

                // Add size constraints to logo img tags that don't already have them
                content = content.replace(
                  /<img([^>]*src\s*=\s*['"`][^'"`]*\/[^'"`]*(?:logo|Logo)[^'"`]*['"`][^>]*?)(?!\s+(?:style|className|width|height))/gi,
                  (match, imgAttrs) => {
                    // Check if it already has size styling
                    if (
                      imgAttrs.includes("style=") ||
                      imgAttrs.includes("className=") ||
                      imgAttrs.includes("width=") ||
                      imgAttrs.includes("height=")
                    ) {
                      return match; // Keep existing styling
                    }
                    return `<img${imgAttrs} className="h-8 w-auto max-h-12"`;
                  }
                );

                // Also handle Next.js Image components
                content = content.replace(
                  /<Image([^>]*src\s*=\s*['"`][^'"`]*\/[^'"`]*(?:logo|Logo)[^'"`]*['"`][^>]*?)(?!\s+(?:style|className|width|height))/gi,
                  (match, imgAttrs) => {
                    if (
                      imgAttrs.includes("width=") ||
                      imgAttrs.includes("height=") ||
                      imgAttrs.includes("className=")
                    ) {
                      return match;
                    }
                    return `<Image${imgAttrs} width={120} height={48} className="h-8 w-auto max-h-12"`;
                  }
                );

                await fs.writeFile(filePath, content);
              } catch (fileError) {
                // Continue with other files
              }
            }
          }
        } catch (dirError) {
          // Directory might not exist
        }
      }
    } catch (error) {
      // Logo reference replacement is optional
    }
  }

  private optimizeLogoUrl(logoUrl: string): string {
    try {
      // Check if it's a Cloudinary URL
      if (
        logoUrl.includes("cloudinary.com") ||
        logoUrl.includes("res.cloudinary.com")
      ) {
        // Add Cloudinary transformation parameters for logo sizing
        // This will resize the logo to a maximum of 200x48 pixels while maintaining aspect ratio
        const transformations = "w_200,h_48,c_fit,f_auto,q_auto";

        // Insert transformations into Cloudinary URL
        if (logoUrl.includes("/upload/")) {
          return logoUrl.replace("/upload/", `/upload/${transformations}/`);
        }
      }

      // Return original URL if not Cloudinary or transformation fails
      return logoUrl;
    } catch (error) {
      // Return original URL if any error occurs
      return logoUrl;
    }
  }

  /**
   * Replace the favicon with the user's logo
   */
  private async replaceFavicon(
    templatePath: string,
    logoUrl: string
  ): Promise<void> {
    try {
      // Favicon-specific transformation for square icon (32x32)
      let faviconUrl = logoUrl;
      if (
        logoUrl.includes("cloudinary.com") ||
        logoUrl.includes("res.cloudinary.com")
      ) {
        // Transform to ICO format, 32x32, cropped to square
        const faviconTransformations = "w_32,h_32,c_fill,f_ico,q_auto";
        if (logoUrl.includes("/upload/")) {
          faviconUrl = logoUrl.replace(
            "/upload/",
            `/upload/${faviconTransformations}/`
          );
        }
      }

      // Paths where favicon might be located
      const faviconPaths = [
        path.join(templatePath, "public", "favicon.ico"),
        path.join(templatePath, "src", "app", "favicon.ico"),
        path.join(templatePath, "app", "favicon.ico"),
      ];

      // Download and replace favicon
      for (const faviconPath of faviconPaths) {
        try {
          // Check if file exists
          await fs.access(faviconPath);

          // Download the favicon-sized logo
          const response = await fetch(faviconUrl);
          if (response.ok) {
            const buffer = await response.arrayBuffer();
            await fs.writeFile(faviconPath, Buffer.from(buffer));
            console.log(`✅ Replaced favicon at: ${faviconPath}`);
          }
        } catch (error) {
          // File doesn't exist or couldn't be replaced, continue to next path
          continue;
        }
      }

      // Also create icon.png versions for better compatibility
      await this.createIconVariants(templatePath, logoUrl);
    } catch (error) {
      console.error("❌ Failed to replace favicon:", error);
      // Favicon replacement is optional, don't fail the entire process
    }
  }

  /**
   * Create icon variants (icon.png, apple-touch-icon.png, etc.)
   */
  private async createIconVariants(
    templatePath: string,
    logoUrl: string
  ): Promise<void> {
    try {
      if (
        !logoUrl.includes("cloudinary.com") &&
        !logoUrl.includes("res.cloudinary.com")
      ) {
        // Only create variants for Cloudinary URLs where we can transform
        return;
      }

      const iconVariants = [
        {
          name: "icon.png",
          size: 192,
          paths: [
            path.join(templatePath, "public", "icon.png"),
            path.join(templatePath, "src", "app", "icon.png"),
          ],
        },
        {
          name: "apple-touch-icon.png",
          size: 180,
          paths: [
            path.join(templatePath, "public", "apple-touch-icon.png"),
            path.join(templatePath, "src", "app", "apple-touch-icon.png"),
          ],
        },
      ];

      for (const variant of iconVariants) {
        // Create transformation for this size
        const transformations = `w_${variant.size},h_${variant.size},c_fill,f_png,q_auto`;
        const iconUrl = logoUrl.replace(
          "/upload/",
          `/upload/${transformations}/`
        );

        // Try each possible path
        for (const iconPath of variant.paths) {
          try {
            const response = await fetch(iconUrl);
            if (response.ok) {
              const buffer = await response.arrayBuffer();
              await fs.writeFile(iconPath, Buffer.from(buffer));
              console.log(`✅ Created ${variant.name} at: ${iconPath}`);
              break; // Success, move to next variant
            }
          } catch (error) {
            // Continue to next path
            continue;
          }
        }
      }
    } catch (error) {
      console.error("❌ Failed to create icon variants:", error);
      // Icon variant creation is optional
    }
  }

  private async addLogoSizingCSS(templatePath: string): Promise<void> {
    try {
      // Common CSS file locations
      const cssFiles = [
        "src/app/globals.css",
        "styles/globals.css",
        "public/styles.css",
        "src/styles/globals.css",
      ];

      const logoSizingCSS = `
              /* Logo sizing constraints */
              .logo,
              [class*="logo"],
              img[src*="logo" i],
              img[alt*="logo" i] {
                max-height: 48px !important;
                height: auto !important;
                width: auto !important;
                max-width: 200px !important;
              }

              /* Specific logo sizing for headers and navigation */
              header .logo,
              nav .logo,
              .header .logo,
              .navbar .logo {
                max-height: 32px !important;
              }

              /* Footer logo sizing */
              footer .logo,
              .footer .logo {
                max-height: 28px !important;
              }
              `;

      let cssAdded = false;

      for (const cssFile of cssFiles) {
        const cssPath = path.join(templatePath, cssFile);

        try {
          // Check if CSS file exists
          await fs.access(cssPath);

          // Read current content
          let cssContent = await fs.readFile(cssPath, "utf-8");

          // Check if logo sizing CSS is already present
          if (!cssContent.includes("Logo sizing constraints")) {
            // Append logo sizing CSS
            cssContent += "\n" + logoSizingCSS;
            await fs.writeFile(cssPath, cssContent);
            cssAdded = true;
            break; // Only add to the first CSS file found
          }
        } catch (error) {
          // CSS file doesn't exist, continue to next
          continue;
        }
      }

      // If no existing CSS file was found, create one
      if (!cssAdded) {
        const globalsCssPath = path.join(templatePath, "src/app/globals.css");
        try {
          await fs.writeFile(globalsCssPath, logoSizingCSS);
        } catch (error) {
          // Even CSS creation failed, but don't break the process
        }
      }
    } catch (error) {
      // CSS addition is optional, don't fail the process
    }
  }

  /**
   * Update next.config.ts with user's comprehensive configuration
   */
  private async updateNextConfigFile(
    templatePath: string,
    options: WebsiteCreationOptions
  ): Promise<void> {
    const nextConfigPath = path.join(templatePath, "next.config.ts");

    try {
      const websiteUrl = `https://${options.websiteName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}.vercel.app`;

      // Generate the complete next.config.ts content
      const configContent = `import type { NextConfig } from "next";

// All Configuration - MongoDB, App Settings, and Site Configuration
const appConfig = {
  // Database Configuration
  database: {
    mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/${this.generateDatabaseName(
      options.websiteName
    )}",
  },
  // App Configuration
  app: {
    url: "${websiteUrl}",
  },
  // Site Configuration - Contact Information, Social Links, Company Info
  contact: {
    phone: "${options.phoneNumber || options.whatsappNumber || ""}",
    email: "${options.userEmail}",
    supportEmail: "${options.supportEmail || options.userEmail}",
    whatsappNumber: "${options.whatsappNumber || options.phoneNumber || ""}",
    address: "${options.address || ""}",
  },
  social: {
    facebook: "${options.facebookUrl || ""}",
    twitter: "${options.twitterUrl || ""}",
    instagram: "${options.instagramUrl || ""}",
    linkedin: "${options.linkedinUrl || ""}",
    youtube: "${options.youtubeUrl || ""}",
  },
  company: {
    name: "${options.companyName}",
    tagline: "${options.tagline || "Find Your Dream Home"}",
  },
  // AI Configuration (if any)
  ai: {
    googleApiKey: process.env.GOOGLE_API_KEY || "",
  },
};

const nextConfig: NextConfig = {
  env: {
    // Database Configuration
    MONGODB_URI: appConfig.database.mongoUri,
    // App Configuration
    NEXT_PUBLIC_APP_URL: appConfig.app.url,
    // Make site config available as environment variables
    NEXT_PUBLIC_PHONE_NUMBER: appConfig.contact.phone,
    NEXT_PUBLIC_EMAIL: appConfig.contact.email,
    NEXT_PUBLIC_SUPPORT_EMAIL: appConfig.contact.supportEmail,
    NEXT_PUBLIC_WHATSAPP_NUMBER: appConfig.contact.whatsappNumber,
    NEXT_PUBLIC_ADDRESS: appConfig.contact.address,
    NEXT_PUBLIC_FACEBOOK_URL: appConfig.social.facebook,
    NEXT_PUBLIC_TWITTER_URL: appConfig.social.twitter,
    NEXT_PUBLIC_INSTAGRAM_URL: appConfig.social.instagram,
    NEXT_PUBLIC_LINKEDIN_URL: appConfig.social.linkedin,
    NEXT_PUBLIC_YOUTUBE_URL: appConfig.social.youtube,
    NEXT_PUBLIC_COMPANY_NAME: appConfig.company.name,
    NEXT_PUBLIC_COMPANY_TAGLINE: appConfig.company.tagline,
    NEXT_PUBLIC_GOOGLE_API_KEY: appConfig.ai.googleApiKey,
  },
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

};

export default nextConfig;
`;

      await fs.writeFile(nextConfigPath, configContent);
      console.log(`✅ Updated next.config.ts with user configuration`);
    } catch (error) {
      console.error("Error updating next.config.ts:", error);
      // Don't fail the entire process if config update fails
    }
  }

  /**
   * Update globals.css with selected color palette
   */
  private async updateGlobalsCssColors(
    templatePath: string,
    options: WebsiteCreationOptions
  ): Promise<void> {
    try {
      // Check if brandColors has 4 colors (from palette selection)
      if (!options.brandColors || options.brandColors.length !== 4) {
        console.log(
          "⚠️ No complete color palette selected, skipping globals.css color customization"
        );
        return;
      }

      const [primary, skyblue, lightskyblue, dark] = options.brandColors;

      // Find globals.css file - try multiple possible locations
      const possiblePaths = [
        "src/app/globals.css",
        "src/styles/globals.css",
        "styles/globals.css",
        "app/globals.css",
      ];

      let globalsCssPath: string | null = null;

      for (const possiblePath of possiblePaths) {
        const fullPath = path.join(templatePath, possiblePath);
        try {
          await fs.access(fullPath);
          globalsCssPath = fullPath;
          break;
        } catch {
          // File doesn't exist at this path, try next
        }
      }

      if (!globalsCssPath) {
        console.log("⚠️ globals.css not found, skipping color customization");
        return;
      }

      // Read the globals.css file
      let cssContent = await fs.readFile(globalsCssPath, "utf-8");

      // Replace the color CSS variables in the @theme block
      cssContent = cssContent.replace(
        /--color-primary:\s*#[0-9a-fA-F]{6};/g,
        `--color-primary: ${primary};`
      );
      cssContent = cssContent.replace(
        /--color-skyblue:\s*#[0-9a-fA-F]{6};/g,
        `--color-skyblue: ${skyblue};`
      );
      cssContent = cssContent.replace(
        /--color-lightskyblue:\s*#[0-9a-fA-F]{6};/g,
        `--color-lightskyblue: ${lightskyblue};`
      );
      cssContent = cssContent.replace(
        /--color-dark:\s*#[0-9a-fA-F]{6};/g,
        `--color-dark: ${dark};`
      );

      // Write the updated content back
      await fs.writeFile(globalsCssPath, cssContent);

      console.log(
        `✅ Updated globals.css with color palette: ${primary}, ${skyblue}, ${lightskyblue}, ${dark}`
      );
    } catch (error) {
      console.error("Error updating globals.css colors:", error);
      // Don't fail the entire process if color update fails
    }
  }

  /**
   * Safely create or update a file in GitHub repository
   * Handles SHA requirement for existing files
   */
  private async safeCreateOrUpdateFile(
    octokit: any,
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string
  ): Promise<any> {
    try {
      // First, try to get the existing file to get its SHA
      let existingFileSha: string | undefined;

      try {
        const existingFile = await octokit.repos.getContent({
          owner,
          repo,
          path,
        });

        // If file exists, get its SHA
        if (existingFile.data && !Array.isArray(existingFile.data)) {
          existingFileSha = existingFile.data.sha;
        }
      } catch (error) {
        // File doesn't exist, which is fine for creation
        existingFileSha = undefined;
      }

      // Create or update the file with SHA if it exists
      const requestData: any = {
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
      };

      // Add SHA if file exists
      if (existingFileSha) {
        requestData.sha = existingFileSha;
      }

      return await octokit.repos.createOrUpdateFileContents(requestData);
    } catch (error) {
      console.error(`Error creating/updating file ${path}:`, error);
      throw error;
    }
  }

  private async pushTemplateFiles(
    octokit: any,
    owner: string,
    repo: string,
    templatePath: string
  ): Promise<void> {
    try {
      // Get all files from the template directory
      const files = await this.getAllTemplateFiles(templatePath);

      console.log(`Found ${files.length} files to push to GitHub:`);
      files.forEach((file) => console.log(`  - ${file.relativePath}`));

      // Push files in batches to avoid rate limiting
      const batchSize = 3;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);

        // Push files sequentially instead of in parallel to avoid rate limiting
        for (const file of batch) {
          try {
            const content = await fs.readFile(file.fullPath, "utf8");

            console.log(
              `Pushing file: ${file.relativePath} (${content.length} bytes)`
            );

            await this.safeCreateOrUpdateFile(
              octokit,
              owner,
              repo,
              file.relativePath,
              content,
              `Add ${file.relativePath}`
            );

            console.log(`✅ Successfully pushed: ${file.relativePath}`);

            // Small delay between individual file pushes
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (error) {
            console.error(
              `❌ Failed to push file ${file.relativePath}:`,
              error instanceof Error ? error.message : error
            );
            // Continue with other files even if one fails
          }
        }

        // Add small delay between batches
        if (i + batchSize < files.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log("✅ All template files pushed to GitHub");

      // Add a small deployment trigger commit to ensure Vercel deploys
      try {
        console.log("Adding deployment trigger commit...");
        const deployTriggerContent = `# ${repo}\n\nThis Next.js website was automatically generated and deployed by JuzBuild.\n\nDeployment triggered at: ${new Date().toISOString()}\n`;

        await this.safeCreateOrUpdateFile(
          octokit,
          owner,
          repo,
          "DEPLOYMENT.md",
          deployTriggerContent,
          `🚀 Trigger Vercel deployment - ${new Date().toISOString()}`
        );

        console.log("✅ Deployment trigger commit added");
      } catch (error) {
        console.log(
          "Note: Could not add deployment trigger commit, deployment may be delayed"
        );
      }
    } catch (error) {
      console.error("Error pushing template files:", error);
      throw error;
    }
  }

  private async getAllTemplateFiles(templatePath: string): Promise<
    Array<{
      fullPath: string;
      relativePath: string;
    }>
  > {
    const files: Array<{ fullPath: string; relativePath: string }> = [];

    async function scanDirectory(currentPath: string, basePath: string) {
      try {
        const items = await fs.readdir(currentPath, { withFileTypes: true });

        for (const item of items) {
          const fullPath = path.join(currentPath, item.name);
          const relativePath = path
            .relative(basePath, fullPath)
            .replace(/\\/g, "/");

          if (item.isDirectory()) {
            // Only skip node_modules and .git directories
            // Include all other directories, including those with special characters like (site)
            if (item.name !== "node_modules" && item.name !== ".git") {
              await scanDirectory(fullPath, basePath);
            }
          } else {
            // Include all files except logs and common build artifacts
            // Be more selective about what we exclude to ensure we don't miss important files
            if (
              !item.name.endsWith(".log") &&
              item.name !== ".DS_Store" &&
              item.name !== "Thumbs.db" &&
              !item.name.startsWith(".env") &&
              item.name !== ".gitignore"
            ) {
              files.push({ fullPath, relativePath });
            }
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${currentPath}:`, error);
      }
    }

    await scanDirectory(templatePath, templatePath);

    // Log the first few files to help with debugging
    console.log(`📁 Found ${files.length} files to upload to GitHub:`);
    files.slice(0, 10).forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.relativePath}`);
    });
    if (files.length > 10) {
      console.log(`  ... and ${files.length - 10} more files`);
    }

    // Specifically check for (site) folder contents
    const siteFiles = files.filter((file) =>
      file.relativePath.includes("(site)")
    );
    if (siteFiles.length > 0) {
      console.log(`✅ Found ${siteFiles.length} files in (site) folder:`);
      siteFiles.slice(0, 5).forEach((file) => {
        console.log(`  - ${file.relativePath}`);
      });
    } else {
      console.log(
        `⚠️  No files found in (site) folder - this may indicate an issue`
      );
    }

    return files;
  }

  private async triggerVercelDeploymentViaPush(
    repoName: string
  ): Promise<void> {
    try {
      // Wait for Vercel-GitHub connection to be established
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const githubToken = process.env.GITHUB_TOKEN;
      const githubUsername = process.env.GITHUB_USERNAME || "juzbuild";

      if (!githubToken) {
        return;
      }

      const octokit = new Octokit({ auth: githubToken });

      // Create a deployment trigger file
      const timestamp = new Date().toISOString();
      const deploymentTriggerContent = `# Vercel Deployment Trigger

This file was created to trigger automatic deployment on Vercel.

**Deployment Details:**
- Website: ${repoName}
- Triggered at: ${timestamp}
- Trigger reason: Ensuring Vercel deployment after project connection

## Automatic Deployment Process

1. ✅ GitHub repository created with Next.js files
2. ✅ Vercel project created and connected to GitHub
3. ✅ This trigger file added to force deployment
4. 🚀 Vercel should now automatically deploy the website

---
*This file is part of the automated deployment process by JuzBuild*
`;

      await this.safeCreateOrUpdateFile(
        octokit,
        githubUsername,
        repoName,
        "VERCEL_DEPLOY.md",
        deploymentTriggerContent,
        `🚀 Trigger Vercel deployment - ${timestamp}`
      );
    } catch (error) {
      // Silently handle deployment trigger errors
    }
  }

  async cleanupTemplate(websiteName: string): Promise<void> {
    const templatePath = path.join(process.cwd(), "templates", websiteName);
    try {
      await fs.rm(templatePath, { recursive: true, force: true });
    } catch (error) {
      // Template directory might not exist or already cleaned up
    }
  }
}

export const websiteCreationService = new WebsiteCreationService();
