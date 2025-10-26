import { PrismaClient } from '@generated/prisma/client';

const prisma = new PrismaClient();

export async function main() {
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
