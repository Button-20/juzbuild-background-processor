// Redis client for job tracking
import { createClient } from "redis";

export interface JobStatus {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  message: string;
  progress?: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
  result?: any;
}

class JobTracker {
  private client: ReturnType<typeof createClient>;
  private connected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    this.client = createClient({
      url: redisUrl,
    });

    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
      this.connected = false;
    });

    this.client.on("connect", () => {
      console.log("Redis Client Connected");
      this.connected = true;
    });
  }

  async connect(): Promise<void> {
    try {
      if (!this.connected) {
        await this.client.connect();
      }
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connected) {
        await this.client.disconnect();
        this.connected = false;
      }
    } catch (error) {
      console.error("Failed to disconnect from Redis:", error);
    }
  }

  private getJobKey(jobId: string): string {
    return `job:${jobId}`;
  }

  async createJob(
    jobId: string,
    initialData: Partial<JobStatus>
  ): Promise<void> {
    try {
      await this.connect();

      const jobData: JobStatus = {
        jobId,
        status: "pending",
        message: "Job created",
        startedAt: new Date().toISOString(),
        ...initialData,
      };

      await this.client.setEx(
        this.getJobKey(jobId),
        3600, // Expire after 1 hour
        JSON.stringify(jobData)
      );
    } catch (error) {
      console.error("Failed to create job:", error);
      throw error;
    }
  }

  async updateJob(jobId: string, updates: Partial<JobStatus>): Promise<void> {
    try {
      await this.connect();

      const currentData = await this.getJob(jobId);
      if (!currentData) {
        throw new Error(`Job ${jobId} not found`);
      }

      const updatedData: JobStatus = {
        ...currentData,
        ...updates,
      };

      if (updates.status === "completed" || updates.status === "failed") {
        updatedData.completedAt = new Date().toISOString();
      }

      await this.client.setEx(
        this.getJobKey(jobId),
        3600, // Expire after 1 hour
        JSON.stringify(updatedData)
      );
    } catch (error) {
      console.error("Failed to update job:", error);
      throw error;
    }
  }

  async getJob(jobId: string): Promise<JobStatus | null> {
    try {
      await this.connect();

      const data = await this.client.get(this.getJobKey(jobId));
      if (!data) {
        return null;
      }

      return JSON.parse(data) as JobStatus;
    } catch (error) {
      console.error("Failed to get job:", error);
      return null;
    }
  }

  async deleteJob(jobId: string): Promise<void> {
    try {
      await this.connect();
      await this.client.del(this.getJobKey(jobId));
    } catch (error) {
      console.error("Failed to delete job:", error);
      throw error;
    }
  }

  async getAllJobs(): Promise<JobStatus[]> {
    try {
      await this.connect();

      const keys = await this.client.keys("job:*");
      const jobs: JobStatus[] = [];

      for (const key of keys) {
        const data = await this.client.get(key);
        if (data) {
          jobs.push(JSON.parse(data) as JobStatus);
        }
      }

      return jobs.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
    } catch (error) {
      console.error("Failed to get all jobs:", error);
      return [];
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Create and export a singleton instance
export const jobTracker = new JobTracker();
