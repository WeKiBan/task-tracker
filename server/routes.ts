import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // No API routes needed - frontend uses localStorage.
  // We just serve the frontend (handled by server/index.ts and vite.ts)

  app.get("/api/health", async (req, res) => {
    const healthy = await storage.healthCheck();
    res.json({ status: healthy ? "ok" : "error" });
  });

  return httpServer;
}
