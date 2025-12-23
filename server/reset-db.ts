import { db } from './db';
import { users, companies, subscriptions } from '../shared/schema';
import { createUser, createCompany, createSession, generateToken } from './auth';
import bcrypt from 'bcryptjs';

async function resetDatabase() {
  try {
    console.log('🧹 Limpando dados antigos...');
    
    // Delete all data in reverse order of foreign keys
    await db.delete(users);
    await db.delete(subscriptions);
    await db.delete(companies);
    
    console.log('✅ Dados antigos removidos');
    
    console.log('🏢 Criando empresa padrão...');
    const company = await createCompany('HUA Consultoria', '00.000.000/0000-00');
    console.log(`✅ Empresa criada: ${company.id}`);
    
    console.log('👤 Criando usuário admin...');
    const admin = await createUser(
      company.id,
      'admin',
      'jl.uli1996@gmail.com',
      'jl.uli1996@gmail.com',
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
    
    console.log('\n✨ Banco de dados resetado com sucesso!');
    console.log(`\n📧 Email: jl.uli1996@gmail.com`);
    console.log(`🔐 Senha: jl.uli1996@gmail.com`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error);
    process.exit(1);
  }
}

resetDatabase();
