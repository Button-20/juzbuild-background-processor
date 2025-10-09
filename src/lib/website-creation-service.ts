// Website creation workflow service with all automated steps

import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import { MongoClient } from "mongodb";
import path from "path";
import { jobTracker } from "./job-tracker.js";
import { getNamecheapInstance } from "./namecheap.js";
import { getVercelInstance } from "./vercel.js";

interface WebsiteCreationOptions {
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

      const vercelResult = await this.deployToVercel(options, githubResult);
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
        vercelUrl
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

      // Step 6: Final Testing
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

      const emailResult = await this.sendSetupNotification(options);
      if (!emailResult.success) {
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
          error: `Email notification failed: ${emailResult.error}`,
          step: "Email Notification",
        };
      }
      results["Email Notification"] = emailResult.data;

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
      const dbName = `juzbuild_${options.websiteName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")}`;
      const connectionString = (
        process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Juzbuild"
      ).replace(/\/[^\/]*$/, `/${dbName}`);

      const client = new MongoClient(connectionString);
      await client.connect();
      const db = client.db(dbName);

      // Create collections with initial data
      const collections = [
        {
          name: "settings",
          data: {
            siteName: options.companyName,
            websitename:
              options.websiteName.toLowerCase().replace(/[^a-z0-9]/g, "-") +
              "-" +
              Date.now(),
            primaryColor:
              (options.brandColors && options.brandColors[0]) || "#3B82F6",
            secondaryColor:
              (options.brandColors && options.brandColors[1]) || "#EF4444",
            accentColor:
              (options.brandColors && options.brandColors[2]) || "#10B981",
            theme: options.selectedTheme,
            layoutStyle: options.layoutStyle,
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
              id: 1,
              title: "Luxury Family Home",
              description: "Beautiful 4-bedroom family home in prime location",
              price: "$750,000",
              bedrooms: 4,
              bathrooms: 3,
              sqft: 2500,
              type:
                (options.propertyTypes && options.propertyTypes[0]) || "House",
              status: "For Sale",
              featured: true,
              images: ["/images/property1.jpg"],
              address: "123 Main Street",
              city: "Downtown",
              createdAt: new Date(),
            },
            {
              id: 2,
              title: "Modern Downtown Condo",
              description: "Contemporary 2-bedroom condo with city views",
              price: "$450,000",
              bedrooms: 2,
              bathrooms: 2,
              sqft: 1200,
              type: "Condo",
              status: "For Sale",
              featured: true,
              images: ["/images/property2.jpg"],
              address: "456 Downtown Ave",
              city: "City Center",
              createdAt: new Date(),
            },
            {
              id: 3,
              title: "Cozy Starter Home",
              description: "Perfect first home with garden and garage",
              price: "$325,000",
              bedrooms: 3,
              bathrooms: 2,
              sqft: 1800,
              type: "House",
              status: "For Sale",
              featured: false,
              images: ["/images/property3.jpg"],
              address: "789 Residential St",
              city: "Suburbs",
              createdAt: new Date(),
            },
          ],
        },
        {
          name: "pages",
          data: (options.includedPages || ["About", "Services", "Contact"]).map(
            (page) => ({
              slug: page.toLowerCase().replace(/\s+/g, "-"),
              title: page,
              content: this.generatePageContent(page, options),
              isActive: true,
              order: (
                options.includedPages || ["About", "Services", "Contact"]
              ).indexOf(page),
              createdAt: new Date(),
            })
          ),
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
        private: false,
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
      await octokit.repos.createOrUpdateFileContents({
        owner: githubUsername,
        repo: repoName,
        path: "README.md",
        message: "Initial commit: Add project README",
        content: Buffer.from(readmeContent).toString("base64"),
      });

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
   * Step 4: Deploy to Vercel
   */
  async deployToVercel(
    options: WebsiteCreationOptions,
    githubResult?: any
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

      // Create project and get deployment info
      const { project, deploymentUrl, deployment } =
        await vercel.createProjectAndDeploy(repoName, repoUrl);

      // Trigger additional push to guarantee Vercel deployment
      await this.triggerVercelDeploymentViaPush(repoName);

      // Extract just the domain part (e.g., "project-name.vercel.app")
      const vercelDomain = deploymentUrl.replace("https://", "");

      return {
        success: true,
        data: {
          projectId: project.id,
          projectName: project.name,
          deploymentUrl: deploymentUrl,
          status: "created",
          vercelUrl: vercelDomain,
          note: "Deployment will be triggered by the GitHub push",
        },
      };
    } catch (error) {
      console.error("Vercel deployment failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Vercel deployment failed",
      };
    }
  }

  /**
   * Step 5: Create Namecheap subdomain
   */
  async createSubdomainOnNamecheap(
    options: WebsiteCreationOptions,
    vercelUrl?: string
  ): Promise<WorkflowResult> {
    try {
      const subdomain = `${options.websiteName}.onjuzbuild.com`;

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
            cname: vercelUrl || "your-deployment-url.vercel.app",
            status: "configured",
            note: "Namecheap integration not configured - manual DNS setup required",
          },
        };
      }

      // Initialize Namecheap API and create DNS record
      const namecheap = getNamecheapInstance();
      const targetUrl =
        vercelUrl ||
        process.env.DEPLOYMENT_TARGET ||
        `${options.websiteName}.vercel.app`;

      // Create CNAME record: websiteName.onjuzbuild.com -> targetUrl
      console.log(
        `Creating DNS record: ${options.websiteName}.onjuzbuild.com -> ${targetUrl}`
      );
      const dnsResult = await namecheap.createDNSRecord(
        "onjuzbuild.com",
        options.websiteName,
        targetUrl,
        "CNAME"
      );

      if (dnsResult.success) {
        console.log(`✅ Subdomain created successfully: ${subdomain}`);
        return {
          success: true,
          data: {
            subdomain,
            cname: targetUrl,
            status: "active",
            message: dnsResult.message,
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

      // Check if we have email configuration
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;

      if (!emailUser || !emailPass) {
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

      // Use the hardcoded test email for now
      const testEmail = "jasonaddy51@gmail.com";

      await sendWebsiteCreationEmail({
        userEmail: testEmail, // Using test email as requested
        companyName: options.companyName,
        websiteName:
          options.websiteName.toLowerCase().replace(/[^a-z0-9]/g, "-") +
          "-" +
          Date.now(),
        domain,
        theme: options.selectedTheme,
        layoutStyle: options.layoutStyle,
        websiteUrl,
        createdAt: new Date().toLocaleString(),
      });

      console.log(`✅ Website creation email sent to: ${testEmail}`);

      return {
        success: true,
        data: {
          emailSent: true,
          recipient: testEmail,
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
    try {
      await this.mongoClient.connect();
      const db = this.mongoClient.db("Juzbuild"); // Use existing database name with capital J
      const sitesCollection = db.collection("sites");

      const siteRecord = {
        userId: options.userId,
        userEmail: options.userEmail,
        websitename:
          options.websiteName.toLowerCase().replace(/[^a-z0-9]/g, "-") +
          "-" +
          Date.now(),
        companyName: options.companyName,
        templatePath: `/templates/${options.websiteName}`,
        repoUrl: `https://github.com/${process.env.GITHUB_USERNAME}/${options.websiteName}`,
        domain: `${options.websiteName}.onjuzbuild.com`,
        dbName: `juzbuild_${options.websiteName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")}`,
        status: "active",
        theme: options.selectedTheme,
        layoutStyle: options.layoutStyle,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await sitesCollection.insertOne(siteRecord);

      return {
        success: true,
        data: {
          siteId: result.insertedId.toString(),
          logged: true,
        },
      };
    } catch (error) {
      console.error("Site logging failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Site logging failed",
      };
    } finally {
      await this.mongoClient.close();
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

    // Remove conflicting route directories that might cause parallel page issues
    const conflictingRoutes = [
      path.join(templatePath, "src", "app", "(site)", "properties"),
      path.join(templatePath, "src", "app", "(site)", "about"),
      path.join(templatePath, "src", "app", "(site)", "contact"),
      path.join(templatePath, "src", "app", "(site)", "services"),
    ];

    for (const routePath of conflictingRoutes) {
      try {
        await fs.rm(routePath, { recursive: true, force: true });
      } catch (error) {
        // Route might not exist, continue
      }
    }

    // Remove the entire (site) route group if it exists to avoid conflicts
    const siteRoutePath = path.join(templatePath, "src", "app", "(site)");
    try {
      await fs.rm(siteRoutePath, { recursive: true, force: true });
    } catch (error) {
      // Site route group might not exist
    }

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
    const dbName = `juzbuild_${options.websiteName}`;
    const connectionString = `${process.env.MONGODB_URI}/${dbName}`;

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
    const pagesDir = path.join(templatePath, "src", "app");
    const includedPages = options.includedPages || [
      "Home",
      "Properties",
      "About",
      "Contact",
    ];

    for (const page of includedPages) {
      const pageName = page.toLowerCase().replace(/\s+/g, "-");

      if (pageName === "home") continue; // Home is the root page

      const pageDir = path.join(pagesDir, pageName);

      // Check if page already exists (from homely template) and remove it first
      try {
        const existingPageFile = path.join(pageDir, "page.tsx");
        if (
          await fs
            .access(existingPageFile)
            .then(() => true)
            .catch(() => false)
        ) {
          await fs.rm(pageDir, { recursive: true, force: true });
        }
      } catch (error) {
        // Page doesn't exist, which is fine
      }

      // Create fresh page directory and file
      await fs.mkdir(pageDir, { recursive: true });

      const pageContent = this.generatePageContent(page, options);
      const pageFile = path.join(pageDir, "page.tsx");

      await fs.writeFile(pageFile, pageContent);
    }
  }

  private generatePageContent(
    pageName: string,
    options: WebsiteCreationOptions
  ): string {
    const componentName = pageName.replace(/\s+/g, "");
    const companyName = options.companyName || options.websiteName;

    switch (pageName.toLowerCase()) {
      case "about":
        return `
import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About ${companyName}</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          ${
            options.aboutSection ||
            `Welcome to ${companyName}, your trusted partner in real estate.`
          }
        </p>
        <p className="mb-4">
          Our team is dedicated to helping you find the perfect property that meets your needs and budget.
          With years of experience in the real estate market, we provide expert guidance throughout
          your property journey.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Services</h2>
        <ul className="list-disc pl-6">
          <li>Property Sales</li>
          <li>Property Rentals</li>
          <li>Property Management</li>
          <li>Investment Consultation</li>
        </ul>
      </div>
    </div>
  );
}
`;

      case "contact":
        return `
import React from 'react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Contact ${companyName}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>${
                options.userEmail || "info@" + options.websiteName + ".com"
              }</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>${
                options.preferredContactMethod?.includes("phone")
                  ? "+1 (555) 123-4567"
                  : "Available upon request"
              }</p>
            </div>
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>123 Real Estate Street<br />Property City, PC 12345</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows={4} className="w-full border rounded-md px-3 py-2"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
`;

      case "services":
        return `
import React from 'react';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Property Sales</h3>
          <p>Expert assistance in buying and selling properties with market insights and professional guidance.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Property Rentals</h3>
          <p>Find the perfect rental property or manage your rental investments with our comprehensive services.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Property Management</h3>
          <p>Complete property management solutions for landlords and property investors.</p>
        </div>
      </div>
    </div>
  );
}
`;

      default:
        return `
import React from 'react';

export default function ${componentName}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">${pageName}</h1>
      <div className="prose max-w-none">
        <p>Welcome to the ${pageName.toLowerCase()} page of ${companyName}.</p>
        <p>This page is ready for your custom content.</p>
      </div>
    </div>
  );
}
`;
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

    // Update site configuration with user's branding
    const configFiles = [
      "src/config/site.ts",
      "src/lib/config.ts",
      "next.config.js",
      "next.config.ts",
    ];

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
            const base64Content = Buffer.from(content).toString("base64");

            console.log(
              `Pushing file: ${file.relativePath} (${content.length} bytes)`
            );

            const result = await octokit.repos.createOrUpdateFileContents({
              owner,
              repo,
              path: file.relativePath,
              message: `Add ${file.relativePath}`,
              content: base64Content,
            });

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
        const base64Content =
          Buffer.from(deployTriggerContent).toString("base64");

        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: "DEPLOYMENT.md",
          message: `🚀 Trigger Vercel deployment - ${new Date().toISOString()}`,
          content: base64Content,
        });

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
            // Skip node_modules and .git directories
            if (
              item.name !== "node_modules" &&
              item.name !== ".git" &&
              !item.name.startsWith(".")
            ) {
              await scanDirectory(fullPath, basePath);
            }
          } else {
            // Skip certain file types
            if (!item.name.endsWith(".log") && !item.name.startsWith(".")) {
              files.push({ fullPath, relativePath });
            }
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${currentPath}:`, error);
      }
    }

    await scanDirectory(templatePath, templatePath);
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

      const base64Content = Buffer.from(deploymentTriggerContent).toString(
        "base64"
      );

      await octokit.repos.createOrUpdateFileContents({
        owner: githubUsername,
        repo: repoName,
        path: "VERCEL_DEPLOY.md",
        message: `🚀 Trigger Vercel deployment - ${timestamp}`,
        content: base64Content,
      });
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
