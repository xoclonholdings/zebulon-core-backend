import { PrismaClient } from '@prisma/client';
declare let activeConnection: 'neon' | 'local';
declare let db: PrismaClient;
declare function executeWithFailover<T>(operation: () => Promise<T>): Promise<T>;
export { db, executeWithFailover, activeConnection };
export declare function getActiveConnection(): {
    connection: "neon" | "local";
    database: string;
};
