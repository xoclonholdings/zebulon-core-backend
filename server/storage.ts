import {
  type User,
  type UpsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type File,
  type InsertFile,
  type Session,
  type InsertSession,
  type CoreMemory,
  type InsertCoreMemory,
  type ProjectMemory,
  type InsertProjectMemory,
  type ScratchpadMemory,
  type InsertScratchpadMemory,
} from "@shared/schema";
import { db } from "./db";
import { 
  users, 
  conversations, 
  messages, 
  files, 
  chatSessions,
  coreMemory,
  projectMemory,
  scratchpadMemory,
  fileStorage,
  memoryIndex,
  knowledgeBase,
  cacheStorage,
  analytics 
} from "@shared/schema";
import { eq, and, or, desc, asc, inArray, sql } from "drizzle-orm";
import { createHash } from "crypto";

// Enhanced cache system
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number; hits: number }>();
  private maxSize = 1000;
  private ttl = 300000; // 5 minutes

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    item.hits++;
    return item.data;
  }

  set(key: string, data: any, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      // Remove least recently used items
      const sorted = Array.from(this.cache.entries())
        .sort((a, b) => a[1].hits - b[1].hits);
      for (let i = 0; i < Math.floor(this.maxSize * 0.1); i++) {
        this.cache.delete(sorted[i][0]);
      }
    }
    
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttl || this.ttl),
      hits: 0
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clearPattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    Array.from(this.cache.keys()).forEach(key => {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    });
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: Array.from(this.cache.values()).reduce((sum, item) => sum + item.hits, 0)
    };
  }
}

const memoryCache = new MemoryCache();

export interface IStorage {
  // User operations for authentication system
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(userData: any): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, userData: Partial<any>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;

  // Conversation operations
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  deleteConversation(id: string): Promise<boolean>;

  // Message operations
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: string): Promise<boolean>;
  batchCreateMessages(messages: InsertMessage[]): Promise<Message[]>;

  // File operations
  getFile(id: string): Promise<File | undefined>;
  getFilesByConversation(conversationId: string): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: string, updates: Partial<File>): Promise<File | undefined>;
  deleteFile(id: string): Promise<boolean>;
  storeFileChunk(fileId: string, chunkIndex: number, chunkData: string, chunkSize: number): Promise<boolean>;
  getFileChunks(fileId: string): Promise<{ chunkIndex: number; chunkData: string; chunkSize: number }[]>;

  // Session operations
  getSession(conversationId: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;

  // Memory system operations
  getCoreMemoryByKey(key: string): Promise<CoreMemory | null>;
  upsertCoreMemory(data: InsertCoreMemory): Promise<CoreMemory>;
  getAllCoreMemory(): Promise<CoreMemory[]>;
  
  getProjectMemoryByUser(userId: string): Promise<ProjectMemory[]>;
  createProjectMemory(data: InsertProjectMemory): Promise<ProjectMemory>;
  updateProjectMemory(id: string, updates: Partial<InsertProjectMemory>): Promise<ProjectMemory>;
  deleteProjectMemory(id: string): Promise<boolean>;
  
  getScratchpadMemoryByUser(userId: string): Promise<ScratchpadMemory[]>;
  createScratchpadMemory(data: InsertScratchpadMemory): Promise<ScratchpadMemory>;
  cleanupExpiredScratchpadMemory(): Promise<void>;

  // Enhanced operations
  searchConversations(userId: string, query: string): Promise<Conversation[]>;
  getRecentActivity(userId: string, limit?: number): Promise<any[]>;
  cleanupExpiredData(): Promise<void>;
  getCacheStats(): any;
  optimizeStorage(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private generateCacheKey(operation: string, ...params: any[]): string {
    return createHash('md5').update(`${operation}:${JSON.stringify(params)}`).digest('hex');
  }

  private async trackAnalytics(userId: string, eventType: string, eventData?: any, duration?: number): Promise<void> {
    try {
      await db.insert(analytics).values({
        userId,
        eventType,
        eventData,
        duration,
        sessionId: `session_${Date.now()}`,
        metadata: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.warn('[ANALYTICS] Failed to track event:', error);
    }
  }

  // User operations for authentication system  
  async getUser(id: string): Promise<User | undefined> {
    const cacheKey = this.generateCacheKey('user', id);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (user) {
      memoryCache.set(cacheKey, user, 600000); // Cache for 10 minutes
    }
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Clear user cache
    const cacheKey = this.generateCacheKey('user', userData.id);
    memoryCache.delete(cacheKey);
    
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const cacheKey = this.generateCacheKey('user_by_username', username);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (user) {
      memoryCache.set(cacheKey, user, 600000); // Cache for 10 minutes
    }
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    
    // Clear relevant caches
    const usernameCacheKey = this.generateCacheKey('user_by_username', userData.username);
    const allUsersCacheKey = this.generateCacheKey('all_users');
    memoryCache.delete(usernameCacheKey);
    memoryCache.delete(allUsersCacheKey);
    
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const cacheKey = this.generateCacheKey('all_users');
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const allUsers = await db.select().from(users).orderBy(asc(users.username));
    memoryCache.set(cacheKey, allUsers, 300000); // Cache for 5 minutes
    return allUsers;
  }

  async updateUser(id: string, userData: Partial<any>): Promise<User> {
    const [user] = await db.update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    // Clear relevant caches
    const userCacheKey = this.generateCacheKey('user', id);
    const allUsersCacheKey = this.generateCacheKey('all_users');
    memoryCache.delete(userCacheKey);
    memoryCache.delete(allUsersCacheKey);
    
    if (userData.username) {
      const usernameCacheKey = this.generateCacheKey('user_by_username', userData.username);
      memoryCache.delete(usernameCacheKey);
    }
    
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUser(id);
    const result = await db.delete(users).where(eq(users.id, id));
    const success = (result.rowCount ?? 0) > 0;
    
    if (success && user) {
      // Clear all related caches
      const userCacheKey = this.generateCacheKey('user', id);
      const usernameCacheKey = this.generateCacheKey('user_by_username', user.username);
      const allUsersCacheKey = this.generateCacheKey('all_users');
      memoryCache.delete(userCacheKey);
      memoryCache.delete(usernameCacheKey);
      memoryCache.delete(allUsersCacheKey);
    }
    
    return success;
  }

  // Conversation operations with caching
  async getConversation(id: string): Promise<Conversation | undefined> {
    const cacheKey = this.generateCacheKey('conversation', id);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (conversation) {
      memoryCache.set(cacheKey, conversation, 300000); // Cache for 5 minutes
    }
    return conversation;
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    const cacheKey = this.generateCacheKey('user_conversations', userId);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const userConversations = await db.select().from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt))
      .limit(100); // Limit for performance
    
    memoryCache.set(cacheKey, userConversations, 120000); // Cache for 2 minutes
    return userConversations;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db.insert(conversations).values(conversation).returning();
    
    // Clear user conversations cache
    const userCacheKey = this.generateCacheKey('user_conversations', conversation.userId);
    memoryCache.delete(userCacheKey);
    
    // Track analytics
    await this.trackAnalytics(conversation.userId, 'conversation_created', { conversationId: newConversation.id });
    
    return newConversation;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const [updated] = await db.update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    
    if (updated) {
      // Clear related caches
      const cacheKey = this.generateCacheKey('conversation', id);
      const userCacheKey = this.generateCacheKey('user_conversations', updated.userId);
      memoryCache.delete(cacheKey);
      memoryCache.delete(userCacheKey);
    }
    
    return updated;
  }

  async deleteConversation(id: string): Promise<boolean> {
    // Get conversation first to clear user cache
    const conversation = await this.getConversation(id);
    
    const result = await db.delete(conversations).where(eq(conversations.id, id));
    const success = (result.rowCount ?? 0) > 0;
    
    if (success && conversation) {
      // Clear related caches
      const cacheKey = this.generateCacheKey('conversation', id);
      const userCacheKey = this.generateCacheKey('user_conversations', conversation.userId);
      memoryCache.delete(cacheKey);
      memoryCache.delete(userCacheKey);
      
      // Track analytics
      await this.trackAnalytics(conversation.userId, 'conversation_deleted', { conversationId: id });
    }
    
    return success;
  }

  // Message operations with optimization
  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    const cacheKey = this.generateCacheKey('messages', conversationId);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const conversationMessages = await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt))
      .limit(1000); // Prevent excessive memory usage
    
    memoryCache.set(cacheKey, conversationMessages, 60000); // Cache for 1 minute
    return conversationMessages;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    
    // Clear messages cache for this conversation
    const cacheKey = this.generateCacheKey('messages', message.conversationId);
    memoryCache.delete(cacheKey);
    
    return newMessage;
  }

  async batchCreateMessages(messagesList: InsertMessage[]): Promise<Message[]> {
    if (messagesList.length === 0) return [];
    
    const newMessages = await db.insert(messages).values(messagesList).returning();
    
    // Clear all affected conversation caches
    const conversationIds = Array.from(new Set(messagesList.map(m => m.conversationId)));
    conversationIds.forEach(conversationId => {
      const cacheKey = this.generateCacheKey('messages', conversationId);
      memoryCache.delete(cacheKey);
    });
    
    return newMessages;
  }

  async deleteMessage(id: string): Promise<boolean> {
    // Get message first to clear conversation cache
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    
    const result = await db.delete(messages).where(eq(messages.id, id));
    const success = (result.rowCount ?? 0) > 0;
    
    if (success && message) {
      const cacheKey = this.generateCacheKey('messages', message.conversationId);
      memoryCache.delete(cacheKey);
    }
    
    return success;
  }

  // File operations with chunked storage
  async getFile(id: string): Promise<File | undefined> {
    const cacheKey = this.generateCacheKey('file', id);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const [file] = await db.select().from(files).where(eq(files.id, id));
    if (file) {
      memoryCache.set(cacheKey, file, 300000); // Cache for 5 minutes
    }
    return file;
  }

  async getFilesByConversation(conversationId: string): Promise<File[]> {
    const cacheKey = this.generateCacheKey('conversation_files', conversationId);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const conversationFiles = await db.select().from(files)
      .where(eq(files.conversationId, conversationId))
      .orderBy(desc(files.createdAt))
      .limit(50); // Reasonable limit
    
    memoryCache.set(cacheKey, conversationFiles, 180000); // Cache for 3 minutes
    return conversationFiles;
  }

  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(file).returning();
    
    // Clear conversation files cache
    const cacheKey = this.generateCacheKey('conversation_files', file.conversationId);
    memoryCache.delete(cacheKey);
    
    return newFile;
  }

  async updateFile(id: string, updates: Partial<File>): Promise<File | undefined> {
    const [updated] = await db.update(files)
      .set(updates)
      .where(eq(files.id, id))
      .returning();
    
    if (updated) {
      // Clear related caches
      const fileCacheKey = this.generateCacheKey('file', id);
      const conversationCacheKey = this.generateCacheKey('conversation_files', updated.conversationId);
      memoryCache.delete(fileCacheKey);
      memoryCache.delete(conversationCacheKey);
    }
    
    return updated;
  }

  async deleteFile(id: string): Promise<boolean> {
    // Get file first to clear conversation cache
    const file = await this.getFile(id);
    
    // Delete file chunks first
    if (file) {
      await db.delete(fileStorage).where(eq(fileStorage.fileId, id));
    }
    
    const result = await db.delete(files).where(eq(files.id, id));
    const success = (result.rowCount ?? 0) > 0;
    
    if (success && file) {
      const fileCacheKey = this.generateCacheKey('file', id);
      const conversationCacheKey = this.generateCacheKey('conversation_files', file.conversationId);
      memoryCache.delete(fileCacheKey);
      memoryCache.delete(conversationCacheKey);
    }
    
    return success;
  }

  async storeFileChunk(fileId: string, chunkIndex: number, chunkData: string, chunkSize: number): Promise<boolean> {
    try {
      const checksum = createHash('md5').update(chunkData).digest('hex');
      
      await db.insert(fileStorage).values({
        fileId,
        chunkIndex,
        chunkData,
        chunkSize,
        checksum
      });
      
      return true;
    } catch (error) {
      console.error('[STORAGE] Failed to store file chunk:', error);
      return false;
    }
  }

  async getFileChunks(fileId: string): Promise<{ chunkIndex: number; chunkData: string; chunkSize: number }[]> {
    const chunks = await db.select({
      chunkIndex: fileStorage.chunkIndex,
      chunkData: fileStorage.chunkData,
      chunkSize: fileStorage.chunkSize
    })
    .from(fileStorage)
    .where(eq(fileStorage.fileId, fileId))
    .orderBy(asc(fileStorage.chunkIndex));
    
    return chunks;
  }

  // Session operations
  async getSession(conversationId: string): Promise<Session | undefined> {
    const cacheKey = this.generateCacheKey('session', conversationId);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.conversationId, conversationId));
    if (session) {
      memoryCache.set(cacheKey, session, 120000); // Cache for 2 minutes
    }
    return session;
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db.insert(chatSessions).values(session).returning();
    return newSession;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const [updated] = await db.update(chatSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();
    
    if (updated) {
      const cacheKey = this.generateCacheKey('session', updated.conversationId);
      memoryCache.delete(cacheKey);
    }
    
    return updated;
  }

  // Memory system operations
  async getCoreMemoryByKey(key: string): Promise<CoreMemory | null> {
    const cacheKey = this.generateCacheKey('core_memory', key);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const [memory] = await db.select().from(coreMemory).where(eq(coreMemory.key, key));
    if (memory) {
      memoryCache.set(cacheKey, memory, 1800000); // Cache for 30 minutes
    }
    return memory || null;
  }

  async upsertCoreMemory(data: InsertCoreMemory): Promise<CoreMemory> {
    const [memory] = await db
      .insert(coreMemory)
      .values(data)
      .onConflictDoUpdate({
        target: coreMemory.key,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Clear cache
    const cacheKey = this.generateCacheKey('core_memory', data.key);
    memoryCache.delete(cacheKey);
    
    return memory;
  }

  async getAllCoreMemory(): Promise<CoreMemory[]> {
    const cacheKey = this.generateCacheKey('all_core_memory');
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const memories = await db.select().from(coreMemory).orderBy(asc(coreMemory.key));
    memoryCache.set(cacheKey, memories, 600000); // Cache for 10 minutes
    return memories;
  }

  async getProjectMemoryByUser(userId: string): Promise<ProjectMemory[]> {
    const cacheKey = this.generateCacheKey('project_memory', userId);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const memories = await db.select().from(projectMemory)
      .where(and(eq(projectMemory.userId, userId), eq(projectMemory.isActive, true)))
      .orderBy(desc(projectMemory.updatedAt));
    
    memoryCache.set(cacheKey, memories, 300000); // Cache for 5 minutes
    return memories;
  }

  async createProjectMemory(data: InsertProjectMemory): Promise<ProjectMemory> {
    const [memory] = await db.insert(projectMemory).values(data).returning();
    
    // Clear user cache
    const cacheKey = this.generateCacheKey('project_memory', data.userId);
    memoryCache.delete(cacheKey);
    
    return memory;
  }

  async updateProjectMemory(id: string, updates: Partial<InsertProjectMemory>): Promise<ProjectMemory> {
    const [updated] = await db.update(projectMemory)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projectMemory.id, id))
      .returning();
    
    if (updated) {
      const cacheKey = this.generateCacheKey('project_memory', updated.userId);
      memoryCache.delete(cacheKey);
    }
    
    return updated;
  }

  async deleteProjectMemory(id: string): Promise<boolean> {
    const memory = await db.select().from(projectMemory).where(eq(projectMemory.id, id));
    const result = await db.delete(projectMemory).where(eq(projectMemory.id, id));
    const success = (result.rowCount ?? 0) > 0;
    
    if (success && memory.length > 0) {
      const cacheKey = this.generateCacheKey('project_memory', memory[0].userId);
      memoryCache.delete(cacheKey);
    }
    
    return success;
  }

  async getScratchpadMemoryByUser(userId: string): Promise<ScratchpadMemory[]> {
    const cacheKey = this.generateCacheKey('scratchpad_memory', userId);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const memories = await db.select().from(scratchpadMemory)
      .where(and(
        eq(scratchpadMemory.userId, userId),
        sql`${scratchpadMemory.expiresAt} > ${now}`
      ))
      .orderBy(desc(scratchpadMemory.createdAt));
    
    memoryCache.set(cacheKey, memories, 60000); // Cache for 1 minute (short cache for scratchpad)
    return memories;
  }

  async createScratchpadMemory(data: InsertScratchpadMemory): Promise<ScratchpadMemory> {
    const [memory] = await db.insert(scratchpadMemory).values(data).returning();
    
    // Clear user cache
    const cacheKey = this.generateCacheKey('scratchpad_memory', data.userId);
    memoryCache.delete(cacheKey);
    
    return memory;
  }

  async cleanupExpiredScratchpadMemory(): Promise<void> {
    const now = new Date();
    await db.delete(scratchpadMemory).where(sql`${scratchpadMemory.expiresAt} <= ${now}`);
    
    // Clear all scratchpad caches since we can't know which users were affected
    memoryCache.clearPattern('scratchpad_memory:*');
  }

  // Enhanced operations
  async searchConversations(userId: string, query: string): Promise<Conversation[]> {
    const searchQuery = `%${query.toLowerCase()}%`;
    
    return await db.select().from(conversations)
      .where(
        and(
          eq(conversations.userId, userId),
          or(
            sql`LOWER(${conversations.title}) LIKE ${searchQuery}`,
            sql`LOWER(${conversations.preview}) LIKE ${searchQuery}`
          )
        )
      )
      .orderBy(desc(conversations.updatedAt))
      .limit(20);
  }

  async getRecentActivity(userId: string, limit: number = 10): Promise<any[]> {
    const cacheKey = this.generateCacheKey('recent_activity', userId, limit);
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    const activities = await db.select({
      id: analytics.id,
      eventType: analytics.eventType,
      eventData: analytics.eventData,
      createdAt: analytics.createdAt,
      conversationId: analytics.conversationId
    })
    .from(analytics)
    .where(eq(analytics.userId, userId))
    .orderBy(desc(analytics.createdAt))
    .limit(limit);
    
    memoryCache.set(cacheKey, activities, 60000); // Cache for 1 minute
    return activities;
  }

  async cleanupExpiredData(): Promise<void> {
    try {
      // Clean expired scratchpad memory first
      await this.cleanupExpiredScratchpadMemory();
      
      // Clean expired cache entries
      await db.delete(cacheStorage)
        .where(sql`expiration IS NOT NULL AND expiration < NOW()`);
      
      // Clean old analytics (older than 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      await db.delete(analytics)
        .where(sql`created_at < ${thirtyDaysAgo}`);
      
      console.log('[STORAGE] Cleanup completed');
    } catch (error) {
      console.error('[STORAGE] Cleanup failed:', error);
    }
  }

  getCacheStats(): any {
    return {
      memoryCache: memoryCache.getStats(),
      timestamp: new Date().toISOString()
    };
  }

  async optimizeStorage(): Promise<void> {
    try {
      // Vacuum analyze for PostgreSQL optimization
      await db.execute(sql`VACUUM ANALYZE conversations`);
      await db.execute(sql`VACUUM ANALYZE messages`);
      await db.execute(sql`VACUUM ANALYZE files`);
      
      // Clear old memory cache entries
      memoryCache.clear();
      
      console.log('[STORAGE] Optimization completed');
    } catch (error) {
      console.error('[STORAGE] Optimization failed:', error);
    }
  }
}

export const storage = new DatabaseStorage();