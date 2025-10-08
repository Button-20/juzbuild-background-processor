import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { jobTracker } from "./lib/job-tracker.js";
import { WorkflowProcessor } from "./workflow-processor.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Initialize workflow processor
const workflowProcessor = new WorkflowProcessor();

// Security middleware to verify requests come from main application
const verifySecret = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const secret = req.headers["x-processor-secret"];
  const expectedSecret = process.env.BACKGROUND_PROCESSOR_SECRET;

  if (!secret || secret !== expectedSecret) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized access to background processor",
    });
  }

  next();
};

// Health check endpoint
app.get("/health", async (req, res) => {
  const redisConnected = jobTracker.isConnected();

  res.json({
    status: "healthy",
    service: "juzbuild-background-processor",
    redis: redisConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Main workflow processing endpoint
app.post("/process-website-creation", verifySecret, async (req, res) => {
  try {
    const websiteData = req.body;
    const jobId = `${websiteData.websiteName}_${Date.now()}`;

    console.log(
      `[${new Date().toISOString()}] Starting background website creation for: ${
        websiteData.websiteName
      } (Job ID: ${jobId})`
    );

    // Create initial job entry
    try {
      await jobTracker.createJob(jobId, {
        status: "pending",
        message: `Website creation queued for ${websiteData.websiteName}`,
        progress: 0,
      });
    } catch (redisError) {
      console.warn("Failed to create job in Redis:", redisError);
    }

    // Process the workflow in background
    workflowProcessor
      .processWebsiteCreation(websiteData, jobId)
      .then((result: any) => {
        console.log(
          `[${new Date().toISOString()}] Website creation completed for: ${
            websiteData.websiteName
          } (Job ID: ${jobId})`,
          result
        );
      })
      .catch((error: any) => {
        console.error(
          `[${new Date().toISOString()}] Website creation failed for: ${
            websiteData.websiteName
          } (Job ID: ${jobId})`,
          error
        );
      });

    // Return immediately to main application
    res.json({
      success: true,
      message: `Website creation started for ${websiteData.websiteName}. Processing in background.`,
      jobId: jobId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Background processor error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Job status endpoint
app.get("/job-status/:jobId", verifySecret, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: "Job ID is required",
        timestamp: new Date().toISOString(),
      });
    }

    const jobStatus = await jobTracker.getJob(jobId);

    if (!jobStatus) {
      return res.status(404).json({
        success: false,
        error: `Job ${jobId} not found`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      job: jobStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching job status:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Get all jobs endpoint (for debugging/monitoring)
app.get("/jobs", verifySecret, async (req, res) => {
  try {
    const jobs = await jobTracker.getAllJobs();

    res.json({
      success: true,
      jobs: jobs,
      count: jobs.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Delete job endpoint
app.delete("/job/:jobId", verifySecret, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: "Job ID is required",
        timestamp: new Date().toISOString(),
      });
    }

    await jobTracker.deleteJob(jobId);

    res.json({
      success: true,
      message: `Job ${jobId} deleted successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handling middleware
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
);

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(
    `[${new Date().toISOString()}] Received ${signal}. Graceful shutdown...`
  );

  try {
    await jobTracker.disconnect();
    console.log(`[${new Date().toISOString()}] Redis connection closed.`);
  } catch (error) {
    console.error("Error during Redis shutdown:", error);
  }

  process.exit(0);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
const server = app.listen(port, () => {
  console.log(
    `[${new Date().toISOString()}] JuzBuild Background Processor running on port ${port}`
  );
  console.log(
    `[${new Date().toISOString()}] Health check available at: http://localhost:${port}/health`
  );
  console.log(
    `[${new Date().toISOString()}] Job status endpoint: http://localhost:${port}/job-status/:jobId`
  );
});

export default app;
