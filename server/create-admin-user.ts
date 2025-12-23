import { createUser, createCompany, createSession, generateToken } from './auth';
import { db } from './db';
import { subscriptions } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function createAdminUser() {
  try {
    console.log('🏢 Criando empresa...');
    const company = await createCompany('Empresa Admin User', '11.111.111/0000-11');
    console.log(`✅ Empresa: ${company.name} (${company.id})`);
    
    // Atualizar subscription para plano pro
    console.log('📋 Associando plano...');
    await db.update(subscriptions)
      .set({ plan: 'pro', status: 'active' })
      .where(eq(subscriptions.companyId, company.id));
    console.log(`✅ Plano: Pro`);
    
    console.log('👤 Criando usuário admin...');
    const admin = await createUser(
      company.id,
      'admin_user',
      'admin.user@example.com',
      'admin@123456',
      'Admin User',
      'admin',
      false // Não é super admin
    );
    console.log(`✅ Admin criado!`);
    
    const token = generateToken({
      userId: admin.id,
      companyId: company.id,
      role: admin.role,
      isSuperAdmin: false,
    });
    
    await createSession(admin.id, company.id, token);
    
    console.log('\n✨ Novo Admin Criado!');
    console.log(`📧 Username: admin_user`);
    console.log(`🔐 Senha: admin@123456`);
    console.log(`📋 Plano: Pro`);
    console.log(`🏢 Empresa: ${company.name}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

createAdminUser();
