import { Express } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middleware";

export function registerAIRoutes(app: Express) {
  app.post("/api/ai/analyze", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      // Lógica de IA será movida para cá
      res.json({ message: "AI Backend route placeholder" });
    } catch (error) {
      res.status(500).json({ error: "AI analysis failed" });
    }
  });
}
