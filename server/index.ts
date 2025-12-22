import express from 'express';
import path from 'path';
import { storage } from './storage';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());

const cwd = process.cwd();
const staticPath = path.join(cwd, 'dist', 'public');
app.use(express.static(staticPath));

// ============== TRANSACTIONS ==============
app.get('/api/transactions', async (_req, res) => {
  try {
    const data = await storage.getTransactions();
    res.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.get('/api/transactions/:id', async (req, res) => {
  try {
    const item = await storage.getTransaction(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const newItem = await storage.createTransaction(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.patch('/api/transactions/:id', async (req, res) => {
  try {
    const updated = await storage.updateTransaction(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await storage.deleteTransaction(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// ============== CUSTOMERS ==============
app.get('/api/customers', async (_req, res) => {
  try {
    const data = await storage.getCustomers();
    res.json(data);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const item = await storage.getCustomer(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const newItem = await storage.createCustomer(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.patch('/api/customers/:id', async (req, res) => {
  try {
    const updated = await storage.updateCustomer(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await storage.deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// ============== CATEGORIES ==============
app.get('/api/categories', async (_req, res) => {
  try {
    const data = await storage.getCategories();
    res.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const item = await storage.getCategory(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const newItem = await storage.createCategory(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.patch('/api/categories/:id', async (req, res) => {
  try {
    const updated = await storage.updateCategory(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await storage.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ============== SUPPLIERS ==============
app.get('/api/suppliers', async (_req, res) => {
  try {
    const data = await storage.getSuppliers();
    res.json(data);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

app.get('/api/suppliers/:id', async (req, res) => {
  try {
    const item = await storage.getSupplier(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const newItem = await storage.createSupplier(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

app.patch('/api/suppliers/:id', async (req, res) => {
  try {
    const updated = await storage.updateSupplier(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    await storage.deleteSupplier(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

// ============== CASH FLOW ==============
app.get('/api/cash-flow', async (_req, res) => {
  try {
    const data = await storage.getCashFlows();
    res.json(data);
  } catch (error) {
    console.error('Error fetching cash flow:', error);
    res.status(500).json({ error: 'Failed to fetch cash flow' });
  }
});

app.get('/api/cash-flow/:id', async (req, res) => {
  try {
    const item = await storage.getCashFlow(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error fetching cash flow:', error);
    res.status(500).json({ error: 'Failed to fetch cash flow' });
  }
});

app.post('/api/cash-flow', async (req, res) => {
  try {
    const newItem = await storage.createCashFlow(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating cash flow:', error);
    res.status(500).json({ error: 'Failed to create cash flow' });
  }
});

app.patch('/api/cash-flow/:id', async (req, res) => {
  try {
    const updated = await storage.updateCashFlow(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Error updating cash flow:', error);
    res.status(500).json({ error: 'Failed to update cash flow' });
  }
});

app.delete('/api/cash-flow/:id', async (req, res) => {
  try {
    await storage.deleteCashFlow(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting cash flow:', error);
    res.status(500).json({ error: 'Failed to delete cash flow' });
  }
});

// ============== SALES (In-memory for now - tables exist but no storage methods) ==============
const inMemoryData: {
  sales: any[];
  purchases: any[];
  installments: any[];
  purchaseInstallments: any[];
} = {
  sales: [],
  purchases: [],
  installments: [],
  purchaseInstallments: []
};

const findAndUpdate = (arr: any[], id: string, data: any) => {
  const idx = arr.findIndex((item: any) => item.id === id);
  if (idx !== -1) {
    arr[idx] = { ...arr[idx], ...data };
    return arr[idx];
  }
  return null;
};

const findAndDelete = (arr: any[], id: string) => {
  const idx = arr.findIndex((item: any) => item.id === id);
  if (idx !== -1) {
    arr.splice(idx, 1);
    return true;
  }
  return false;
};

app.get('/api/sales', (_req, res) => res.json(inMemoryData.sales));
app.get('/api/sales/:id', (req, res) => {
  const item = inMemoryData.sales.find(s => s.id === req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/sales', (req, res) => {
  const id = Date.now().toString();
  const newItem = { id, ...req.body };
  inMemoryData.sales.push(newItem);
  res.status(201).json(newItem);
});
app.patch('/api/sales/:id', (req, res) => {
  const updated = findAndUpdate(inMemoryData.sales, req.params.id, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
});
app.delete('/api/sales/:id', (req, res) => {
  findAndDelete(inMemoryData.sales, req.params.id);
  res.status(204).send();
});

// ============== PURCHASES ==============
app.get('/api/purchases', (_req, res) => res.json(inMemoryData.purchases));
app.get('/api/purchases/:id', (req, res) => {
  const item = inMemoryData.purchases.find(p => p.id === req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/purchases', (req, res) => {
  const id = Date.now().toString();
  const newItem = { id, ...req.body };
  inMemoryData.purchases.push(newItem);
  res.status(201).json(newItem);
});
app.patch('/api/purchases/:id', (req, res) => {
  const updated = findAndUpdate(inMemoryData.purchases, req.params.id, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
});
app.delete('/api/purchases/:id', (req, res) => {
  findAndDelete(inMemoryData.purchases, req.params.id);
  res.status(204).send();
});

// ============== INSTALLMENTS ==============
app.get('/api/installments', (_req, res) => res.json(inMemoryData.installments));
app.get('/api/installments/:id', (req, res) => {
  const item = inMemoryData.installments.find(i => i.id === req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/installments', (req, res) => {
  const id = Date.now().toString();
  const newItem = { id, ...req.body };
  inMemoryData.installments.push(newItem);
  res.status(201).json(newItem);
});
app.patch('/api/installments/:id', (req, res) => {
  const updated = findAndUpdate(inMemoryData.installments, req.params.id, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
});
app.delete('/api/installments/:id', (req, res) => {
  findAndDelete(inMemoryData.installments, req.params.id);
  res.status(204).send();
});

// ============== PURCHASE INSTALLMENTS ==============
app.get('/api/purchase-installments', (_req, res) => res.json(inMemoryData.purchaseInstallments));
app.get('/api/purchase-installments/:id', (req, res) => {
  const item = inMemoryData.purchaseInstallments.find(i => i.id === req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/purchase-installments', (req, res) => {
  const id = Date.now().toString();
  const newItem = { id, ...req.body };
  inMemoryData.purchaseInstallments.push(newItem);
  res.status(201).json(newItem);
});
app.patch('/api/purchase-installments/:id', (req, res) => {
  const updated = findAndUpdate(inMemoryData.purchaseInstallments, req.params.id, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
});
app.delete('/api/purchase-installments/:id', (req, res) => {
  findAndDelete(inMemoryData.purchaseInstallments, req.params.id);
  res.status(204).send();
});

// SPA fallback - serve index.html for all other routes
app.get('*', (_req, res) => {
  const indexPath = path.join(cwd, 'dist', 'public', 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} - Connected to Neon PostgreSQL`);
});

export default app;
