import { db } from './db';
import { users, companies, categories, DEFAULT_CATEGORIES } from '../shared/schema';
import { createUser } from './auth';
import { sql } from 'drizzle-orm';

async function seed() {
  try {
    console.log('🌱 Seeding database...\n');

    // Get or create master company
    let masterCompany = await db.select().from(companies).where(sql`id = '00000000-0000-0000-0000-000000000000'`);
    if (!masterCompany.length) {
      const result = await db.insert(companies).values({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Base44 Admin',
        document: '00000000000000'
      }).returning();
      masterCompany = result;
    }

    // Get or create demo company
    let demoCompany = await db.select().from(companies).where(sql`id = '11111111-1111-1111-1111-111111111111'`);
    if (!demoCompany.length) {
      const result = await db.insert(companies).values({
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Demo Company',
        document: '12345678901234'
      }).returning();
      demoCompany = result;
    }

    console.log('✅ Companies ready');

    // Create super admin user
    try {
      const existingAdmin = await db.select().from(users).where(sql`username = 'admin'`);
      if (!existingAdmin.length) {
        await createUser(
          masterCompany[0].id,
          'admin',
          'admin@base44.com',
          'admin123',
          'Super Administrator',
          'admin',
          true
        );
        console.log('✅ Super admin user created');
        console.log('   Username: admin | Password: admin123');
      }
    } catch (e) {
      console.log('⚠️  Admin user already exists or error creating');
    }

    // Create demo company admin
    try {
      const existingDemoAdmin = await db.select().from(users).where(sql`username = 'demo_admin'`);
      if (!existingDemoAdmin.length) {
        await createUser(
          demoCompany[0].id,
          'demo_admin',
          'admin@demo.com',
          'demo123',
          'Demo Admin',
          'admin',
          false
        );
        console.log('✅ Demo admin user created');
        console.log('   Username: demo_admin | Password: demo123');
      }
    } catch (e) {
      console.log('⚠️  Demo admin already exists or error creating');
    }

    // Create demo operational user
    try {
      const existingOp = await db.select().from(users).where(sql`username = 'operacional'`);
      if (!existingOp.length) {
        await createUser(
          demoCompany[0].id,
          'operacional',
          'op@demo.com',
          'op123',
          'Operacional User',
          'operational',
          false
        );
        console.log('✅ Operacional user created');
        console.log('   Username: operacional | Password: op123');
      }
    } catch (e) {
      console.log('⚠️  Operacional user already exists or error creating');
    }

    // Create categories for demo company
    try {
      const existingCategories = await db.select().from(categories).where(sql`company_id = '11111111-1111-1111-1111-111111111111'`);
      if (!existingCategories.length) {
        await db.insert(categories).values(
          DEFAULT_CATEGORIES.map(cat => ({
            name: cat.name,
            type: cat.type,
            companyId: demoCompany[0].id
          }))
        );
        console.log('✅ Categories created for demo company');
      }
    } catch (e) {
      console.log('⚠️  Categories already exist or error creating');
    }

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
