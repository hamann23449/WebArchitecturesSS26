const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // count users (table may be empty)
  const users = await prisma.user.count();
  console.log('Prisma client ok, users count:', users);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
