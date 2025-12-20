// Use database API instead of Base44
import {
  Transaction,
  Customer,
  Category,
  Sale,
  Installment,
  Supplier,
  Purchase,
  PurchaseInstallment
} from './database';

export {
  Transaction,
  Customer,
  Category,
  Sale,
  Installment,
  Supplier,
  Purchase,
  PurchaseInstallment
};

// Fallback for User if needed
export const User = { auth: {} };