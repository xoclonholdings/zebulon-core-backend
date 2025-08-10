import { PrismaClient } from '@prisma/client';
// import { User } from '../shared/schema.js';
// Initialize Prisma Client
const prisma = new PrismaClient({
    log: ['error', 'warn', 'info', 'query'],
});
export class PrismaStorage {
    // User management
    // Only keep user methods that match the actual schema
    async getUser(id) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }
}
// Export singleton instance
export const storage = new PrismaStorage();
export default storage;
//# sourceMappingURL=storage-prisma.js.map