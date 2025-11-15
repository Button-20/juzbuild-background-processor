import { jobTracker } from "./lib/job-tracker.js";
import { websiteCreationService } from "./lib/website-creation-service.js";
import type {
  WebsiteCreationOptions,
  WorkflowResult,
} from "./types/workflow.js";

export class WorkflowProcessor {
  private async updateWebsiteStatus(
    websiteId: string,
    updates: any
  ): Promise<void> {
    try {
      const { MongoClient, ObjectId } = await import("mongodb");
      const client = new MongoClient(
        process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Juzbuild"
      );

      await client.connect();
      const db = client.db("Juzbuild");
      const websitesCollection = db.collection("websites");

      await websitesCollection.updateOne(
        { _id: new ObjectId(websiteId) },
        { $set: updates }
      );

      await client.close();
    } catch (error) {
      console.error("Error updating website status:", error);
      throw error;
    }
  }

  async processWebsiteCreation(
    options: WebsiteCreationOptions,
    jobId?: string
  ): Promise<WorkflowResult> {
    const actualJobId = jobId || `${options.websiteName}_${Date.now()}`;

    console.log(
      `[${new Date().toISOString()}]  Starting REAL website creation workflow for: ${
        options.websiteName
      } (Job ID: ${actualJobId})`
    );
    console.log(` User: ${options.userEmail}`);
    console.log(` Company: ${options.companyName}`);
    console.log(` Domain: ${options.domainName}`);
    console.log(` Theme: ${options.selectedTheme}`);

    // Create job in Redis with initial steps
    try {
      await jobTracker.createJob(actualJobId, {
        status: "processing",
        message: `Starting website creation for ${options.websiteName}`,
        currentStep: "Initializing website creation...",
        progress: 0,
        estimatedCompletion: "5-8 minutes",
        steps: [
          { name: "Database Setup", status: "pending" },
          { name: "Template Configuration", status: "pending" },
          { name: "GitHub Repository", status: "pending" },
          { name: "Vercel Deployment", status: "pending" },
          { name: "Domain Configuration", status: "pending" },
          { name: "Final Testing", status: "pending" },
        ],
      });
    } catch (error) {
      console.warn("Failed to create job in Redis:", error);
    }

    try {
      // Update job progress
      await jobTracker.updateJob(actualJobId, {
        status: "processing",
        message: "Initializing website creation service...",
        progress: 10,
      });

      // Use the actual website creation service with step tracking
      const result = await websiteCreationService.createWebsite(
        options,
        actualJobId
      );

      if (result.success) {
        // Website creation completed successfully

        // Update website status in database if websiteId is provided
        if (options.websiteId) {
          try {
            await this.updateWebsiteStatus(options.websiteId, {
              status: "active",
              deploymentStatus: "completed",
              websiteUrl: result.data?.websiteUrl, // This is the onjuzbuild.com URL
              vercelUrl: result.data?.vercelUrl, // This is the actual vercel.app URL
              aliasUrl: result.data?.aliasUrl,
              "analytics.googleAnalytics.measurementId":
                result.data?.ga4MeasurementId || null,
              "analytics.googleAnalytics.propertyId":
                result.data?.ga4PropertyId || null,
              "analytics.googleAnalytics.isEnabled":
                result.data?.analyticsEnabled || false,
              completedAt: new Date(),
              updatedAt: new Date(),
            });
          } catch (dbError) {
            console.warn(
              "Failed to update website status in database:",
              dbError
            );
          }
        }

        // Update job as completed
        try {
          await jobTracker.updateJob(actualJobId, {
            status: "completed",
            message: `Website creation completed successfully for ${options.websiteName}`,
            currentStep: "Website ready!",
            progress: 100,
            websiteUrl: result.data?.websiteUrl,
            result: result.data,
          });
        } catch (error) {
          console.warn("Failed to update job completion in Redis:", error);
        }

        return {
          success: true,
          data: result.data,
        };
      } else {
        console.error(
          ` Website creation failed for: ${options.websiteName}`,
          result.error
        );

        // Update website status in database if websiteId is provided
        if (options.websiteId) {
          try {
            await this.updateWebsiteStatus(options.websiteId, {
              status: "failed",
              deploymentStatus: "failed",
              errorMessage: result.error,
              updatedAt: new Date(),
            });
          } catch (dbError) {
            console.warn(
              "Failed to update website status in database:",
              dbError
            );
          }
        }

        // Update job as failed
        try {
          await jobTracker.updateJob(actualJobId, {
            status: "failed",
            message: `Website creation failed for ${options.websiteName}`,
            error: result.error || "Website creation failed",
          });
        } catch (error) {
          console.warn("Failed to update job failure in Redis:", error);
        }

        return {
          success: false,
          error: result.error || "Website creation failed",
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        ` Website creation error for: ${options.websiteName}`,
        errorMessage
      );

      // Update website status in database if websiteId is provided
      if (options.websiteId) {
        try {
          await this.updateWebsiteStatus(options.websiteId, {
            status: "failed",
            deploymentStatus: "failed",
            errorMessage: errorMessage,
            updatedAt: new Date(),
          });
        } catch (dbError) {
          console.warn("Failed to update website status in database:", dbError);
        }
      }

      // Update job as failed
      try {
        await jobTracker.updateJob(actualJobId, {
          status: "failed",
          message: `Website creation error for ${options.websiteName}`,
          error: errorMessage,
        });
      } catch (jobError) {
        console.warn("Failed to update job error in Redis:", jobError);
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
