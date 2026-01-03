import { Express } from "express";
import { registerAuthRoutes } from "./auth";
import { registerCustomerRoutes } from "./customers";
import { registerTransactionRoutes } from "./transactions";

export function registerAllRoutes(app: Express) {
  registerAuthRoutes(app);
  registerCustomerRoutes(app);
  registerTransactionRoutes(app);
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
}
