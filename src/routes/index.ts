import { Express } from "express";
import loadTestRoutes from "./loadTest.routes";
import healthRoutes from "./health.routes";

export const setupRoutes = (app: Express) => {
  app.use("/api", loadTestRoutes);
  app.use("/api", healthRoutes);
};
