"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.PrismaStorage = void 0;
const client_1 = __importDefault(require("@prisma/client"));
const { PrismaClient } = client_1.default;
// import { User } from '../shared/schema.js';
// Initialize Prisma Client
const prisma = new PrismaClient({
    log: ['error', 'warn', 'info', 'query'],
});
class PrismaStorage {
    // User management
    // Only keep user methods that match the actual schema
    async getUser(id) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }
}
exports.PrismaStorage = PrismaStorage;
// Export singleton instance
exports.storage = new PrismaStorage();
exports.default = exports.storage;
