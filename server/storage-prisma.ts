import pkg from '@prisma/client';
const { PrismaClient } = pkg;
// import { User } from '../shared/schema.js';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['error', 'warn', 'info', 'query'],
});

export class PrismaStorage {
  // User management
  // Only keep user methods that match the actual schema
  async getUser(id: string) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }



  // All other methods removed due to missing models in schema
}

// Export singleton instance
export const storage = new PrismaStorage();
export default storage;