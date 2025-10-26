import { PrismaClient } from '@generated/prisma/client';
import * as argon2 from 'argon2';
import { UserRole } from '../src/generated/prisma/enums';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function main() {
  const passwordHash = await argon2.hash('12345678');
  await prisma.user.create({
    data: {
      id: '8da983c3-b28b-458a-ba59-7813475ec2e5',
      email: 'admin@cpme.com',
      displayName: 'Admin',
      firstName: 'Admin',
      password: passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log('Seed completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
