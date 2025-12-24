/**
 * 🧹 IMPROVED DATABASE RESET SCRIPT
 * Deletes ALL tables in correct dependency order
 * Creates Super Admin + Company Admin + Default Categories
 * Run with: npx tsx server/reset-db-improved.ts
 */

import { db } from './db';
import {
  users, companies, subscriptions, categories, customers, suppliers,
  transactions, cashFlow, sales, purchases, installments, purchaseInstallments,
  invitations, auditLogs, sessions, loginAttempts
} from '../shared/schema';
import { createUser, createCompany, createSession, generateToken } from './auth';

async function resetDatabaseImproved() {
  try {
    console.log('\n🔴 ⚠️  INICIANDO RESET COMPLETO DO BANCO DE DADOS...\n');

    console.log('🧹 Deletando dados em ordem reversa de dependências...\n');

    // Order matters! Delete tables with foreign keys FIRST
    const tablesToDelete = [
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

    for (const { name, table } of tablesToDelete) {
      try {
        await db.delete(table);
        console.log(`  ✅ ${name}`);
      } catch (error) {
        console.log(`  ⚠️  ${name} (possivelmente vazio)`);
      }
    }

    console.log('\n✅ Todos os dados foram deletados\n');

    // ============= CREATE DEFAULT COMPANY =============
    console.log('🏢 Criando empresa padrão "HUA Consultoria"...');
    const company = await createCompany('HUA Consultoria', '00.000.000/0000-00');
    console.log(`✅ Empresa criada: ${company.id}\n`);

    // ============= CREATE SUPER ADMIN =============
    console.log('👤 Criando SUPER ADMIN (acesso ao painel de admin)...');
    const superAdmin = await createUser(
      company.id,
      'superadmin',
      'superadmin@huaconsultoria.com',
      'senha123456',
      'Super Admin',
      'admin',
      true // isSuperAdmin = true
    );
    console.log(`✅ Super Admin criado: ${superAdmin.id}`);
    console.log(`   - Usuário: superadmin`);
    console.log(`   - Email: superadmin@huaconsultoria.com`);
    console.log(`   - Acesso: Painel de Admin (Super Admin)\n`);

    // ============= CREATE COMPANY ADMIN =============
    console.log('👤 Criando ADMIN da Empresa (acesso ao sistema)...');
    const companyAdmin = await createUser(
      company.id,
      'admin',
      'admin@huaconsultoria.com',
      'senha123456',
      'Admin HUA',
      'admin',
      false // isSuperAdmin = false
    );
    console.log(`✅ Admin da Empresa criado: ${companyAdmin.id}`);
    console.log(`   - Usuário: admin`);
    console.log(`   - Email: admin@huaconsultoria.com`);
    console.log(`   - Acesso: Sistema da Empresa\n`);

    // ============= CREATE MANAGER =============
    console.log('👤 Criando GERENTE (acesso limitado)...');
    const manager = await createUser(
      company.id,
      'gerente',
      'gerente@huaconsultoria.com',
      'senha123456',
      'Gerente HUA',
      'manager',
      false
    );
    console.log(`✅ Gerente criado: ${manager.id}`);
    console.log(`   - Usuário: gerente`);
    console.log(`   - Email: gerente@huaconsultoria.com\n`);

    // ============= CREATE DEFAULT CATEGORIES =============
    console.log('📂 Criando categorias padrão...');
    const defaultCategories = [
      { name: 'Vendas', type: 'entrada' },
      { name: 'Compras', type: 'saida' },
      { name: 'Devolução', type: 'entrada' },
      { name: 'Ajuste', type: 'saida' },
      { name: 'Pagamento', type: 'saida' },
    ];

    for (const cat of defaultCategories) {
      await db.insert(categories).values({
        companyId: company.id,
        ...cat,
      });
    }
    console.log(`✅ ${defaultCategories.length} categorias criadas\n`);

    // ============= CREATE SESSIONS =============
    console.log('🔑 Criando sessões...');

    // Super Admin Session
    const superAdminToken = generateToken({
      userId: superAdmin.id,
      companyId: company.id,
      role: superAdmin.role,
      isSuperAdmin: true,
    });
    await createSession(superAdmin.id, company.id, superAdminToken);

    // Company Admin Session
    const companyAdminToken = generateToken({
      userId: companyAdmin.id,
      companyId: company.id,
      role: companyAdmin.role,
      isSuperAdmin: false,
    });
    await createSession(companyAdmin.id, company.id, companyAdminToken);

    console.log(`✅ Sessões criadas\n`);

    // ============= FINAL SUMMARY =============
    console.log('='.repeat(70));
    console.log('✨ ✨ ✨  BANCO DE DADOS RESETADO COM SUCESSO!  ✨ ✨ ✨');
    console.log('='.repeat(70));

    console.log('\n🔐 CREDENCIAIS DE ACESSO:\n');

    console.log('📊 SUPER ADMIN (Painel de Admin Global):');
    console.log('   Usuário:  superadmin');
    console.log('   Senha:    senha123456');
    console.log('   Email:    superadmin@huaconsultoria.com');
    console.log('   Acesso:   Painel de Admin');

    console.log('\n💼 ADMIN DA EMPRESA (Sistema Principal):');
    console.log('   Usuário:  admin');
    console.log('   Senha:    senha123456');
    console.log('   Email:    admin@huaconsultoria.com');
    console.log('   Acesso:   Sistema Completo');

    console.log('\n👨‍💼 GERENTE (Acesso Limitado):');
    console.log('   Usuário:  gerente');
    console.log('   Senha:    senha123456');
    console.log('   Email:    gerente@huaconsultoria.com');
    console.log('   Acesso:   Funcionalidades Restritas');

    console.log('\n🏢 EMPRESA CRIADA:');
    console.log(`   Nome:     HUA Consultoria`);
    console.log(`   ID:       ${company.id}`);
    console.log(`   Documento: 00.000.000/0000-00`);

    console.log('\n' + '='.repeat(70) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO ao resetar banco de dados:');
    console.error(error);
    console.error('\nVerifique se:');
    console.error('  1. O banco de dados está rodando');
    console.error('  2. As tabelas foram criadas com Drizzle migrations');
    console.error('  3. As variáveis de ambiente estão configuradas\n');
    process.exit(1);
  }
}

resetDatabaseImproved();
