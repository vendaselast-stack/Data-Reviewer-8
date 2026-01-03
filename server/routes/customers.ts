import { Express } from "express";
import { storage } from "../storage";
import { insertCustomerSchema } from "../../shared/schema";
import { authMiddleware, AuthenticatedRequest } from "../middleware";

export function registerCustomerRoutes(app: Express) {
  app.get("/api/customers", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const customers = await storage.getCustomers(req.user.companyId);
      res.json(customers.map(c => ({ ...c, totalSales: Number(c.totalSales || 0) })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const cleanData: any = {};
      for (const [key, value] of Object.entries(req.body)) {
        cleanData[key] = (value === '' || value === undefined) ? null : value;
      }
      const data = insertCustomerSchema.parse(cleanData);
      const customer = await storage.createCustomer(req.user.companyId, data);
      res.status(201).json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid customer data" });
    }
  });

  app.patch("/api/customers/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const cleanData: any = {};
      for (const [key, value] of Object.entries(req.body)) {
        cleanData[key] = (value === '' || value === undefined) ? null : value;
      }
      const data = insertCustomerSchema.partial().parse(cleanData);
      const customer = await storage.updateCustomer(req.user.companyId, req.params.id, data);
      if (!customer) return res.status(404).json({ error: "Customer not found" });
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid customer data" });
    }
  });

  app.delete("/api/customers/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      await storage.deleteCustomer(req.user.companyId, req.params.id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete customer" });
    }
  });
}
