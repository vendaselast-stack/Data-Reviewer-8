import { Express } from "express";
import { registerAuthRoutes } from "./auth.js";
import { registerCustomerRoutes } from "./customers.js";
import { registerTransactionRoutes } from "./transactions.js";
import { registerSupplierRoutes } from "./suppliers.js";
import { registerCategoryRoutes } from "./categories.js";
import { registerSalesPurchasesRoutes } from "./sales-purchases.js";
import { registerAIRoutes } from "./ai.js";
import { registerBankRoutes } from "./bank.js";
import { registerCashFlowRoutes } from "./cash-flow.js";
import { registerAdminRoutes } from "./admin.js";

export function registerAllRoutes(app: Express) {
  registerAuthRoutes(app);
  registerCustomerRoutes(app);
  registerTransactionRoutes(app);
  registerSupplierRoutes(app);
  registerCategoryRoutes(app);
  registerSalesPurchasesRoutes(app);
  registerAIRoutes(app);
  registerBankRoutes(app);
  registerCashFlowRoutes(app);
  registerAdminRoutes(app);
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Fallback para rotas de API não encontradas para evitar retornar HTML
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });
}
