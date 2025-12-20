// Direct database API calls - bypass Base44 and use our PostgreSQL backend

export const Transaction = {
  async list() {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  async get(id) {
    try {
      const response = await fetch(`/api/transactions/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  },

  async create(data) {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
};

export const Customer = {
  async list() {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },

  async get(id) {
    try {
      const response = await fetch(`/api/customers/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  },

  async create(data) {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }
};

export const Supplier = {
  async list() {
    try {
      const response = await fetch('/api/suppliers');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  },

  async get(id) {
    try {
      const response = await fetch(`/api/suppliers/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching supplier:', error);
      return null;
    }
  },

  async create(data) {
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }
};

// Placeholder stubs for Base44-specific entities not in our database
export const Category = {
  async list() { return []; },
  async get() { return null; }
};

export const Sale = {
  async list() { return []; },
  async get() { return null; }
};

export const Installment = {
  async list() { return []; },
  async get() { return null; }
};

export const Purchase = {
  async list() { return []; },
  async get() { return null; }
};

export const PurchaseInstallment = {
  async list() { return []; },
  async get() { return null; }
};
