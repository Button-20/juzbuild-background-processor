// This is the Vercel serverless handler
import { Request, Response } from "express";
import app from "./server.js";

// Main handler - Vercel will invoke this for all requests
export default (req: Request, res: Response) => {
  try {
    // Pass request to Express app
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};
