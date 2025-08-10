<<<<<<< HEAD
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
=======
export function checkDatabaseConnection() {}
export {}
>>>>>>> d1a6b5690cb748e3c7d5e957460e093f3d9db20e
