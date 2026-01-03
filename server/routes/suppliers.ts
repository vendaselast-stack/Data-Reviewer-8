import { Express } from "express";
import { storage } from "../storage";
import { insertSupplierSchema } from "../../shared/schema";
import { authMiddleware, AuthenticatedRequest } from "../middleware";

export function registerSupplierRoutes(app: Express) {
  app.get("/api/suppliers", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const suppliers = await storage.getSuppliers(req.user.companyId);
      res.json(suppliers.map(s => ({ ...s, totalPurchases: Number(s.totalPurchases || 0) })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const data = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(req.user.companyId, data);
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid supplier data" });
    }
  });
}
