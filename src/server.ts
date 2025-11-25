import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { jobTracker } from "./lib/job-tracker.js";
import domainRouter from "./routes/domain.js";
import { WorkflowProcessor } from "./workflow-processor.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Mount domain router
app.use("/api/domain", domainRouter);

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

// Track active jobs to prevent duplicates
const activeJobs = new Set<string>();

// Main workflow processing endpoint
app.post("/process-website-creation", verifySecret, async (req, res) => {
  try {
    const websiteData = req.body;
    const domainKey = `${websiteData.userId}_${websiteData.domainName}`;

    // Check if there's already an active job for this user/domain combination
    if (activeJobs.has(domainKey)) {
      console.log(
        `[${new Date().toISOString()}] Duplicate job request blocked for: ${
          websiteData.websiteName
        } (User: ${websiteData.userId}, Domain: ${websiteData.domainName})`
      );
      return res.status(409).json({
        success: false,
        error: "Job already in progress for this domain",
        timestamp: new Date().toISOString(),
      });
    }

    const jobId = `${websiteData.websiteName}_${Date.now()}`;

    // Add to active jobs set
    activeJobs.add(domainKey);

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
        // Remove from active jobs set
        activeJobs.delete(domainKey);
      })
      .catch((error: any) => {
        console.error(
          `[${new Date().toISOString()}] Website creation failed for: ${
            websiteData.websiteName
          } (Job ID: ${jobId})`,
          error
        );
        // Remove from active jobs set even on failure
        activeJobs.delete(domainKey);
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

    // Return job status in the format expected by the frontend
    res.json({
      success: true,
      ...jobStatus, // Spread all job properties at root level
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

// Initialize Redis connection on startup
const initializeRedis = async () => {
  try {
    await jobTracker.connect();
    console.log(
      `[${new Date().toISOString()}] Redis connection initialized successfully`
    );
  } catch (error) {
    console.warn(
      `[${new Date().toISOString()}] Redis connection failed:`,
      error
    );
  }
};

// Initialize Redis on module load
initializeRedis();

// Start server only in local development
// In Vercel/serverless, the app is exported and doesn't call listen()
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
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
}

// Export app for Vercel/serverless environments
export default app;
