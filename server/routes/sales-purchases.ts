import { Express } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { sales, transactions, cashFlow, purchases } from "../../shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { authMiddleware, AuthenticatedRequest } from "../middleware";

export function registerSalesPurchasesRoutes(app: Express) {
  app.get("/api/sales", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const salesData = await storage.getSales(req.user.companyId);
      res.json(salesData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  });

  app.get("/api/purchases", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const purchasesData = await storage.getPurchases(req.user.companyId);
      res.json(purchasesData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  });
}
