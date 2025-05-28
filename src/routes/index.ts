import { Express } from "express";
import loadTestRoutes from "./loadTest.routes";
import healthRoutes from "./health.routes";

export const setupRoutes = (app: Express) => {
  app.use("/api/monitor/load-test", loadTestRoutes);
  app.use("/api/monitor/health", healthRoutes);
};
