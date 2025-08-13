"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRelations = exports.messageRelations = exports.conversationRelations = exports.userRelations = exports.analytics = exports.cacheStorage = exports.knowledgeBase = exports.memoryIndex = exports.fileStorage = exports.insertScratchpadMemorySchema = exports.insertProjectMemorySchema = exports.insertCoreMemorySchema = exports.scratchpadMemory = exports.projectMemory = exports.coreMemory = exports.insertSessionSchema = exports.insertFileSchema = exports.insertMessageSchema = exports.modeSchema = exports.insertConversationSchema = exports.insertUserSchema = exports.chatSessions = exports.files = exports.messages = exports.conversations = exports.users = exports.sessions = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_2 = require("drizzle-orm");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
// Session storage table
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, (table) => [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]);
// User storage table
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    email: (0, pg_core_1.varchar)("email").unique(),
    firstName: (0, pg_core_1.varchar)("first_name"),
    lastName: (0, pg_core_1.varchar)("last_name"),
    profileImageUrl: (0, pg_core_1.varchar)("profile_image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.conversations = (0, pg_core_1.pgTable)("conversations", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    title: (0, pg_core_1.text)("title").notNull(),
    preview: (0, pg_core_1.text)("preview"),
    model: (0, pg_core_1.text)("model").notNull().default("gpt-4o"),
    mode: (0, pg_core_1.text)("mode").notNull().default("chat"), // "chat" | "agent"
    isActive: (0, pg_core_1.boolean)("is_active").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    conversationId: (0, pg_core_1.varchar)("conversation_id").notNull().references(() => exports.conversations.id),
    role: (0, pg_core_1.text)("role").notNull(), // "user" | "assistant" | "system"
    content: (0, pg_core_1.text)("content").notNull(),
    metadata: (0, pg_core_1.jsonb)("metadata"), // For storing additional data like file references
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.files = (0, pg_core_1.pgTable)("files", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    conversationId: (0, pg_core_1.varchar)("conversation_id").notNull().references(() => exports.conversations.id),
    fileName: (0, pg_core_1.text)("file_name").notNull(),
    originalName: (0, pg_core_1.text)("original_name").notNull(),
    mimeType: (0, pg_core_1.text)("mime_type").notNull(),
    size: (0, pg_core_1.integer)("size").notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("processing"), // "processing" | "completed" | "error"
    extractedContent: (0, pg_core_1.text)("extracted_content"),
    analysis: (0, pg_core_1.jsonb)("analysis"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.chatSessions = (0, pg_core_1.pgTable)("chat_sessions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    conversationId: (0, pg_core_1.varchar)("conversation_id").notNull().references(() => exports.conversations.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    duration: (0, pg_core_1.integer)("duration").default(0), // in minutes
    messagesUsed: (0, pg_core_1.integer)("messages_used").default(0),
    memoryUsage: (0, pg_core_1.integer)("memory_usage").default(0), // in MB
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Insert schemas
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).omit({
    id: true,
    createdAt: true,
});
exports.insertConversationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.conversations).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Mode validation
exports.modeSchema = zod_1.z.enum(["chat", "agent"]);
exports.insertMessageSchema = (0, drizzle_zod_1.createInsertSchema)(exports.messages).omit({
    id: true,
    createdAt: true,
});
exports.insertFileSchema = (0, drizzle_zod_1.createInsertSchema)(exports.files).omit({
    id: true,
    createdAt: true,
});
exports.insertSessionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.chatSessions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Core Memory table - Persistent system configuration
exports.coreMemory = (0, pg_core_1.pgTable)("core_memory", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    key: (0, pg_core_1.varchar)("key").notNull().unique(),
    value: (0, pg_core_1.text)("value").notNull(),
    description: (0, pg_core_1.text)("description"),
    adminOnly: (0, pg_core_1.boolean)("admin_only").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Project Memory table - Saved context and datasets
exports.projectMemory = (0, pg_core_1.pgTable)("project_memory", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    content: (0, pg_core_1.text)("content").notNull(),
    type: (0, pg_core_1.text)("type").notNull().default("context"), // "context" | "dataset" | "rules"
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Scratchpad Memory table - Temporary working memory (auto-reset daily)
exports.scratchpadMemory = (0, pg_core_1.pgTable)("scratchpad_memory", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    conversationId: (0, pg_core_1.varchar)("conversation_id").references(() => exports.conversations.id),
    content: (0, pg_core_1.text)("content").notNull(),
    tags: (0, pg_core_1.text)("tags").array(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Memory system types
exports.insertCoreMemorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.coreMemory).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertProjectMemorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.projectMemory).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertScratchpadMemorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.scratchpadMemory).omit({
    id: true,
    createdAt: true,
});
// Enhanced storage tables for scalability
exports.fileStorage = (0, pg_core_1.pgTable)("file_storage", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    fileId: (0, pg_core_1.varchar)("file_id").notNull().references(() => exports.files.id),
    chunkIndex: (0, pg_core_1.integer)("chunk_index").notNull(),
    chunkData: (0, pg_core_1.text)("chunk_data").notNull(), // Base64 encoded data
    chunkSize: (0, pg_core_1.bigint)("chunk_size", { mode: "number" }).notNull(),
    checksum: (0, pg_core_1.varchar)("checksum").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_file_storage_file_id").on(table.fileId),
    (0, pg_core_1.index)("idx_file_storage_chunk_index").on(table.chunkIndex),
]);
exports.memoryIndex = (0, pg_core_1.pgTable)("memory_index", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    conversationId: (0, pg_core_1.varchar)("conversation_id").notNull().references(() => exports.conversations.id),
    contentType: (0, pg_core_1.text)("content_type").notNull(), // "message", "file", "analysis"
    contentId: (0, pg_core_1.varchar)("content_id").notNull(),
    embedding: (0, pg_core_1.real)("embedding").array(),
    keywords: (0, pg_core_1.text)("keywords").array(),
    summary: (0, pg_core_1.text)("summary"),
    importance: (0, pg_core_1.real)("importance").default(0.5),
    accessCount: (0, pg_core_1.integer)("access_count").default(0),
    lastAccessed: (0, pg_core_1.timestamp)("last_accessed").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_memory_conv_id").on(table.conversationId),
    (0, pg_core_1.index)("idx_memory_content_type").on(table.contentType),
    (0, pg_core_1.index)("idx_memory_importance").on(table.importance),
    (0, pg_core_1.index)("idx_memory_last_accessed").on(table.lastAccessed),
]);
exports.knowledgeBase = (0, pg_core_1.pgTable)("knowledge_base", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    title: (0, pg_core_1.text)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    tags: (0, pg_core_1.text)("tags").array(),
    category: (0, pg_core_1.text)("category").notNull(),
    isPublic: (0, pg_core_1.boolean)("is_public").default(false),
    version: (0, pg_core_1.integer)("version").default(1),
    parentId: (0, pg_core_1.varchar)("parent_id"),
    usage_count: (0, pg_core_1.integer)("usage_count").default(0),
    rating: (0, pg_core_1.real)("rating").default(0),
    metadata: (0, pg_core_1.jsonb)("metadata"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_kb_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_kb_category").on(table.category),
    (0, pg_core_1.index)("idx_kb_tags").on(table.tags),
    (0, pg_core_1.index)("idx_kb_public").on(table.isPublic),
]);
exports.cacheStorage = (0, pg_core_1.pgTable)("cache_storage", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    cacheKey: (0, pg_core_1.varchar)("cache_key").notNull().unique(),
    cacheValue: (0, pg_core_1.jsonb)("cache_value").notNull(),
    expiration: (0, pg_core_1.timestamp)("expiration"),
    tags: (0, pg_core_1.text)("tags").array(),
    size: (0, pg_core_1.bigint)("size", { mode: "number" }).notNull(),
    hitCount: (0, pg_core_1.integer)("hit_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_cache_key").on(table.cacheKey),
    (0, pg_core_1.index)("idx_cache_expiration").on(table.expiration),
    (0, pg_core_1.index)("idx_cache_tags").on(table.tags),
]);
exports.analytics = (0, pg_core_1.pgTable)("analytics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    eventType: (0, pg_core_1.text)("event_type").notNull(),
    eventData: (0, pg_core_1.jsonb)("event_data"),
    sessionId: (0, pg_core_1.varchar)("session_id"),
    conversationId: (0, pg_core_1.varchar)("conversation_id").references(() => exports.conversations.id),
    duration: (0, pg_core_1.integer)("duration"), // in milliseconds
    metadata: (0, pg_core_1.jsonb)("metadata"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_analytics_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_analytics_event_type").on(table.eventType),
    (0, pg_core_1.index)("idx_analytics_session_id").on(table.sessionId),
    (0, pg_core_1.index)("idx_analytics_created_at").on(table.createdAt),
]);
// Relations for better query performance
exports.userRelations = (0, drizzle_orm_2.relations)(exports.users, ({ many }) => ({
    conversations: many(exports.conversations),
    knowledgeBase: many(exports.knowledgeBase),
    analytics: many(exports.analytics),
}));
exports.conversationRelations = (0, drizzle_orm_2.relations)(exports.conversations, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.conversations.userId],
        references: [exports.users.id],
    }),
    messages: many(exports.messages),
    files: many(exports.files),
    sessions: many(exports.chatSessions),
    memoryIndex: many(exports.memoryIndex),
    analytics: many(exports.analytics),
}));
exports.messageRelations = (0, drizzle_orm_2.relations)(exports.messages, ({ one }) => ({
    conversation: one(exports.conversations, {
        fields: [exports.messages.conversationId],
        references: [exports.conversations.id],
    }),
}));
exports.fileRelations = (0, drizzle_orm_2.relations)(exports.files, ({ one, many }) => ({
    conversation: one(exports.conversations, {
        fields: [exports.files.conversationId],
        references: [exports.conversations.id],
    }),
    storage: many(exports.fileStorage),
}));
