import { createUser, createCompany, createSession, generateToken } from './auth';

async function createAdmin() {
  try {
    console.log('🏢 Criando empresa...');
    const company = await createCompany('HUA Consultoria', '00.000.000/0000-00');
    console.log(`✅ Empresa: ${company.name}`);
    
    console.log('👤 Criando admin...');
    const admin = await createUser(
      company.id,
      'admin',
      'jl.uli1996@gmail.com',
      'jl.uli1996@gmail.com',
      'Admin',
      'admin',
      true
    );
    console.log(`✅ Admin criado!`);
    
    const token = generateToken({
      userId: admin.id,
      companyId: company.id,
      role: admin.role,
      isSuperAdmin: true,
    });
    
    await createSession(admin.id, company.id, token);
    
    console.log('\n✨ Pronto para login!');
    console.log(`📧 Email: jl.uli1996@gmail.com`);
    console.log(`🔐 Senha: jl.uli1996@gmail.com`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

createAdmin();
