import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Prisma Connection...');
  const users = await prisma.user.findMany();
  console.log('Users found:', users.length);
  console.log(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
