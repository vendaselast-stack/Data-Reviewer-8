/**
 * ⚡ QUICK DATABASE RESET SCRIPT
 * Simple reset with Super Admin user
 * 
 * For a more comprehensive reset with multiple users and categories,
 * use: npx tsx server/reset-db-improved.ts
 */

import { db } from './db';
import {
  users, companies, subscriptions, categories, customers, suppliers,
  transactions, cashFlow, sales, purchases, installments, purchaseInstallments,
  invitations, auditLogs, sessions, loginAttempts
} from '../shared/schema';
import { createUser, createCompany, createSession, generateToken } from './auth';

async function resetDatabase() {
  try {
    console.log('\n🧹 Limpando banco de dados...\n');

    // Delete all data in reverse order of foreign keys
    const tables = [
      { name: 'loginAttempts', table: loginAttempts },
      { name: 'auditLogs', table: auditLogs },
      { name: 'sessions', table: sessions },
      { name: 'invitations', table: invitations },
      { name: 'installments', table: installments },
      { name: 'purchaseInstallments', table: purchaseInstallments },
      { name: 'purchases', table: purchases },
      { name: 'sales', table: sales },
      { name: 'transactions', table: transactions },
      { name: 'cashFlow', table: cashFlow },
      { name: 'categories', table: categories },
      { name: 'customers', table: customers },
      { name: 'suppliers', table: suppliers },
      { name: 'subscriptions', table: subscriptions },
      { name: 'users', table: users },
      { name: 'companies', table: companies },
    ];

    for (const { name, table } of tables) {
      await db.delete(table);
      console.log(`  ✅ ${name}`);
    }

    console.log('\n✅ Banco limpo');

    console.log('\n🏢 Criando empresa padrão...');
    const company = await createCompany('HUA Consultoria', '00.000.000/0000-00');
    console.log(`✅ Empresa criada: ${company.id}`);

    console.log('👤 Criando usuário Super Admin...');
    const admin = await createUser(
      company.id,
      'admin',
      'admin@example.com',
      'senha123456',
      'Admin User',
      'admin',
      true
    );
    console.log(`✅ Admin criado: ${admin.id}`);

    console.log('🔑 Gerando token de sessão...');
    const token = generateToken({
      userId: admin.id,
      companyId: company.id,
      role: admin.role,
      isSuperAdmin: true,
    });

    await createSession(admin.id, company.id, token);
    console.log(`✅ Sessão criada`);

    console.log('\n' + '='.repeat(60));
    console.log('✨ BANCO DE DADOS RESETADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\n🔐 CREDENCIAIS DE ACESSO:\n');
    console.log('Usuário: admin');
    console.log('Senha: senha123456');
    console.log('Email: admin@example.com');
    console.log('Tipo: Super Admin\n');
    console.log('='.repeat(60));
    console.log('\n💡 Dica: Para um reset mais completo com múltiplos usuários,');
    console.log('   execute: npx tsx server/reset-db-improved.ts\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error);
    process.exit(1);
  }
}

resetDatabase();
