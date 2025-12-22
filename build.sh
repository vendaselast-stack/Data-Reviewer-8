#!/bin/bash
set -e

echo "🔨 Building Vite..."
npm run build 2>&1 | tail -5

echo "✅ Creating server file..."
cat > dist/index.cjs << 'SERVEREOF'
const express = require('express');
const path = require('path');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Client({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

let dbConnected = false;
client.connect().then(() => {
  dbConnected = true;
  console.log('✓ Neon database conectado!');
}).catch(err => {
  console.log('⚠ Neon não conectou:', err.message);
  dbConnected = false;
});

const mockData = {
  transactions: [{id:'1',date:new Date().toISOString(),description:'Venda',amount:1500,type:'venda'}],
  customers: [{id:'1',name:'Cliente A',email:'cliente@email.com',phone:'11999999999',address:'Rua A, 123'}],
  categories: [{id:'1',name:'Vendas',type:'entrada'},{id:'2',name:'Matéria Prima',type:'saida'}],
  suppliers: [{id:'1',name:'Fornecedor',email:'fornecedor@email.com',phone:'1133333333',address:'Rua B, 456'}]
};

app.get('/api/transactions', async (req, res) => {
  try {
    if (!dbConnected) return res.json(mockData.transactions);
    const result = await client.query('SELECT * FROM transactions LIMIT 100');
    res.json(result.rows || mockData.transactions);
  } catch (err) {
    res.json(mockData.transactions);
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    if (!dbConnected) return res.json(mockData.customers);
    const result = await client.query('SELECT * FROM customers LIMIT 100');
    res.json(result.rows || mockData.customers);
  } catch (err) {
    res.json(mockData.customers);
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    if (!dbConnected) return res.json(mockData.categories);
    const result = await client.query('SELECT * FROM categories LIMIT 100');
    res.json(result.rows || mockData.categories);
  } catch (err) {
    res.json(mockData.categories);
  }
});

app.get('/api/suppliers', async (req, res) => {
  try {
    if (!dbConnected) return res.json(mockData.suppliers);
    const result = await client.query('SELECT * FROM suppliers LIMIT 100');
    res.json(result.rows || mockData.suppliers);
  } catch (err) {
    res.json(mockData.suppliers);
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    if (!dbConnected) return res.json({id: Date.now().toString(), ...req.body});
    const {date, description, amount, type, customerId, categoryId} = req.body;
    const result = await client.query(
      'INSERT INTO transactions(date, description, amount, type, customer_id, category_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [date || new Date(), description, amount, type, customerId, categoryId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    if (!dbConnected) return res.json({id: Date.now().toString(), ...req.body});
    const {name, email, phone, address} = req.body;
    const result = await client.query(
      'INSERT INTO customers(name, email, phone, address) VALUES($1,$2,$3,$4) RETURNING *',
      [name, email, phone, address]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

app.get('/api/sales', (req, res) => res.json([]));
app.get('/api/purchases', (req, res) => res.json([]));
app.get('/api/installments', (req, res) => res.json([]));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server on port ${PORT}`);
  console.log(`✓ DATABASE: ${process.env.DATABASE_URL ? '✓' : '✗'}`);
});
SERVEREOF

echo "✅ Build complete! dist/index.cjs ready"
ls -lh dist/index.cjs
