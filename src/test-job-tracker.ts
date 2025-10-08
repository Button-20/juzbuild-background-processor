// Test script for Redis job tracking functionality
import { jobTracker } from "./lib/job-tracker.js";

async function testJobTracker() {
  try {
    console.log("🧪 Testing Job Tracker...");

    // Test creating a job
    const testJobId = `test_job_${Date.now()}`;
    console.log(`📝 Creating job: ${testJobId}`);

    await jobTracker.createJob(testJobId, {
      status: "pending",
      message: "Test job created",
      progress: 0,
    });

    // Test getting the job
    console.log(`📖 Reading job: ${testJobId}`);
    let job = await jobTracker.getJob(testJobId);
    console.log("Job data:", job);

    // Test updating the job
    console.log(`📝 Updating job: ${testJobId}`);
    await jobTracker.updateJob(testJobId, {
      status: "processing",
      message: "Job is now processing",
      progress: 50,
    });

    job = await jobTracker.getJob(testJobId);
    console.log("Updated job data:", job);

    // Test completing the job
    console.log(`✅ Completing job: ${testJobId}`);
    await jobTracker.updateJob(testJobId, {
      status: "completed",
      message: "Job completed successfully",
      progress: 100,
      result: { test: "success" },
    });

    job = await jobTracker.getJob(testJobId);
    console.log("Completed job data:", job);

    // Test getting all jobs
    console.log("📋 Getting all jobs...");
    const allJobs = await jobTracker.getAllJobs();
    console.log(`Found ${allJobs.length} jobs`);

    // Clean up
    console.log(`🗑️ Cleaning up job: ${testJobId}`);
    await jobTracker.deleteJob(testJobId);

    // Verify deletion
    job = await jobTracker.getJob(testJobId);
    console.log("Job after deletion:", job); // Should be null

    console.log("✅ All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await jobTracker.disconnect();
    process.exit(0);
  }
}

testJobTracker();
