import { Express } from "express";
import { storage } from "../storage";
import { insertCategorySchema, DEFAULT_CATEGORIES } from "../../shared/schema";
import { authMiddleware, AuthenticatedRequest } from "../middleware";

export function registerCategoryRoutes(app: Express) {
  app.get("/api/categories", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      let categories = await storage.getCategories(req.user.companyId);
      if (categories.length === 0) {
        for (const cat of DEFAULT_CATEGORIES) {
          try { await storage.createCategory(req.user.companyId, cat); } catch (e) {}
        }
        categories = await storage.getCategories(req.user.companyId);
      }
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
}
