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
//# sourceMappingURL=db.js.map