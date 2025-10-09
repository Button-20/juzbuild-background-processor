import { jobTracker } from "./lib/job-tracker.js";
import { websiteCreationService } from "./lib/website-creation-service.js";
import type {
  WebsiteCreationOptions,
  WorkflowResult,
} from "./types/workflow.js";

export class WorkflowProcessor {
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
    console.log(` Layout: ${options.layoutStyle}`);

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
      const result = await websiteCreationService.createWebsite(options, actualJobId);

      if (result.success) {
        console.log(
          ` Website creation completed successfully for: ${options.websiteName}`
        );

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
