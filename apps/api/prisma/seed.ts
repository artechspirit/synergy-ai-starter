import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Idempotent: hanya buat jika belum ada
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@12345', 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created: admin@example.com / Admin@12345');
  } else {
    console.log('ℹ️  Admin user already exists, skipping.');
  }

  // Create 5 test users for development
  const testUserCount = await prisma.user.count({ where: { role: 'USER' } });
  if (testUserCount < 5) {
    const passwordHash = await bcrypt.hash('User@12345', 12);
    const usersToCreate = 5 - testUserCount;
    for (let i = 0; i < usersToCreate; i++) {
      await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          passwordHash,
          role: 'USER',
        },
      });
    }
    console.log(`✅ ${usersToCreate} test user(s) created`);
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
