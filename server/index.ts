import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createScan, listScans } from "./routes/scans";
import { getKeycardByUniqueId } from "./routes/keycards";
import { listAttendance } from "./routes/attendance";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // QR Scans API
  app.get("/api/scans", listScans);
  app.post("/api/scans", createScan);

  // Keycards lookup
  app.get("/api/keycards/:unique_id", getKeycardByUniqueId);

  // Attendance monitoring
  app.get("/api/attendance", listAttendance);

  return app;
}
