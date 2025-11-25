// This is the Vercel serverless handler
import { Request, Response } from "express";
import app from "./server.js";

export default (req: Request, res: Response) => {
  return app(req, res);
};
