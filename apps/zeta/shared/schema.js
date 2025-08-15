"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHowToGuideSchema = exports.insertFaqItemSchema = exports.insertFaqCategorySchema = exports.insertQuantumProtocolSchema = exports.insertDataDeprecationSchema = exports.insertBadActorSchema = exports.insertNetworkNodeSchema = exports.insertEncryptionLayerSchema = exports.insertZwapProtectionSchema = exports.insertSystemMetricSchema = exports.insertThreatPatternSchema = exports.insertSecurityEventSchema = exports.insertUserSchema = exports.howToGuides = exports.faqItems = exports.faqCategories = exports.quantumProtocols = exports.dataDeprecation = exports.badActors = exports.networkNodes = exports.encryptionLayers = exports.zwapProtection = exports.systemMetrics = exports.threatPatterns = exports.securityEvents = exports.users = exports.sessions = void 0;
// var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, function (table) { return [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]; });
// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    walletAddress: (0, pg_core_1.varchar)("wallet_address").unique(),
    username: (0, pg_core_1.varchar)("username"),
    email: (0, pg_core_1.varchar)("email"),
    firstName: (0, pg_core_1.varchar)("first_name"),
    lastName: (0, pg_core_1.varchar)("last_name"),
    lastLoginAt: (0, pg_core_1.timestamp)("last_login_at"),
    // Social media IDs for OAuth
    twitterId: (0, pg_core_1.varchar)("twitter_id").unique(),
    instagramId: (0, pg_core_1.varchar)("instagram_id").unique(),
    snapchatId: (0, pg_core_1.varchar)("snapchat_id").unique(),
    // Social media profiles
    twitterUsername: (0, pg_core_1.varchar)("twitter_username"),
    instagramUsername: (0, pg_core_1.varchar)("instagram_username"),
    snapchatUsername: (0, pg_core_1.varchar)("snapchat_username"),
    profileImageUrl: (0, pg_core_1.varchar)("profile_image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.securityEvents = (0, pg_core_1.pgTable)("security_events", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    eventType: (0, pg_core_1.text)("event_type").notNull(),
    severity: (0, pg_core_1.text)("severity").notNull(), // LOW, MEDIUM, HIGH, CRITICAL
    source: (0, pg_core_1.text)("source").notNull(),
    target: (0, pg_core_1.text)("target"),
    description: (0, pg_core_1.text)("description").notNull(),
    metadata: (0, pg_core_1.jsonb)("metadata"),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow().notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("ACTIVE"), // ACTIVE, RESOLVED, INVESTIGATING
});
exports.threatPatterns = (0, pg_core_1.pgTable)("threat_patterns", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    patternName: (0, pg_core_1.text)("pattern_name").notNull(),
    patternType: (0, pg_core_1.text)("pattern_type").notNull(), // CORPORATE_SABOTAGE, AI_INJECTION, MARKET_MANIPULATION
    signature: (0, pg_core_1.text)("signature").notNull(),
    confidence: (0, pg_core_1.integer)("confidence").notNull(), // 0-100
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.systemMetrics = (0, pg_core_1.pgTable)("system_metrics", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    metricType: (0, pg_core_1.text)("metric_type").notNull(), // CPU, MEMORY, NETWORK, ENCRYPTION_STATUS
    value: (0, pg_core_1.integer)("value").notNull(),
    unit: (0, pg_core_1.text)("unit").notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow().notNull(),
});
exports.zwapProtection = (0, pg_core_1.pgTable)("zwap_protection", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    componentType: (0, pg_core_1.text)("component_type").notNull(), // SMART_CONTRACT, TRADING_ENGINE, CREDIT_SYSTEM
    componentName: (0, pg_core_1.text)("component_name").notNull(),
    status: (0, pg_core_1.text)("status").notNull(), // SECURE, VULNERABLE, UNDER_ATTACK
    integrityScore: (0, pg_core_1.integer)("integrity_score").notNull(), // 0-100
    lastVerified: (0, pg_core_1.timestamp)("last_verified").defaultNow().notNull(),
});
exports.encryptionLayers = (0, pg_core_1.pgTable)("encryption_layers", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    layerName: (0, pg_core_1.text)("layer_name").notNull(), // PHYSICAL, NETWORK, TRANSPORT, APPLICATION
    layerNumber: (0, pg_core_1.integer)("layer_number").notNull(),
    status: (0, pg_core_1.text)("status").notNull(), // SECURE, COMPROMISED, UPDATING
    encryptionStrength: (0, pg_core_1.integer)("encryption_strength").notNull(), // bits
    lastKeyRotation: (0, pg_core_1.timestamp)("last_key_rotation").defaultNow().notNull(),
});
exports.networkNodes = (0, pg_core_1.pgTable)("network_nodes", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    nodeName: (0, pg_core_1.text)("node_name").notNull(),
    nodeType: (0, pg_core_1.text)("node_type").notNull(), // FIREWALL, ZWAP, QUANTUM, ZEBULON, ZETA_CORE
    ipAddress: (0, pg_core_1.text)("ip_address"),
    status: (0, pg_core_1.text)("status").notNull(), // ONLINE, OFFLINE, DEGRADED
    lastHeartbeat: (0, pg_core_1.timestamp)("last_heartbeat").defaultNow().notNull(),
});
exports.badActors = (0, pg_core_1.pgTable)("bad_actors", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    identifier: (0, pg_core_1.text)("identifier").notNull(), // IP, wallet address, device fingerprint
    identifierType: (0, pg_core_1.text)("identifier_type").notNull(), // IP_ADDRESS, WALLET, DEVICE_ID, EMAIL
    threatLevel: (0, pg_core_1.integer)("threat_level").notNull(), // 1-10
    firstDetected: (0, pg_core_1.timestamp)("first_detected").defaultNow().notNull(),
    lastActivity: (0, pg_core_1.timestamp)("last_activity").defaultNow().notNull(),
    attempts: (0, pg_core_1.integer)("attempts").notNull().default(1),
    status: (0, pg_core_1.text)("status").notNull().default("ACTIVE"), // ACTIVE, QUARANTINED, BANNED, DEPRECATED
    countermeasures: (0, pg_core_1.text)("countermeasures").array().notNull().default([]),
    metadata: (0, pg_core_1.jsonb)("metadata"),
});
exports.dataDeprecation = (0, pg_core_1.pgTable)("data_deprecation", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    dataType: (0, pg_core_1.text)("data_type").notNull(), // API_KEY, TOKEN, CONTRACT, WALLET_SEED
    deprecationReason: (0, pg_core_1.text)("deprecation_reason").notNull(), // COMPROMISED, SUSPICIOUS_ACCESS, ROTATION_POLICY
    originalValue: (0, pg_core_1.text)("original_value"), // Encrypted reference
    newValue: (0, pg_core_1.text)("new_value"), // New replacement reference
    deprecatedAt: (0, pg_core_1.timestamp)("deprecated_at").defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("ACTIVE"), // ACTIVE, EXPIRED, REPLACED
});
exports.quantumProtocols = (0, pg_core_1.pgTable)("quantum_protocols", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    protocolName: (0, pg_core_1.text)("protocol_name").notNull(),
    protocolType: (0, pg_core_1.text)("protocol_type").notNull(), // HONEYPOT, DECOY, MIRROR_TRAP, DATA_POISON
    targetType: (0, pg_core_1.text)("target_type").notNull(), // BAD_ACTOR, UNKNOWN_ACCESS, PERSISTENT_THREAT
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
    triggerConditions: (0, pg_core_1.jsonb)("trigger_conditions").notNull(),
    response: (0, pg_core_1.jsonb)("response").notNull(),
    effectiveness: (0, pg_core_1.integer)("effectiveness").notNull().default(0), // 0-100
    deployedAt: (0, pg_core_1.timestamp)("deployed_at").defaultNow().notNull(),
});
// FAQ Categories table
exports.faqCategories = (0, pg_core_1.pgTable)("faq_categories", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// FAQ Items table
exports.faqItems = (0, pg_core_1.pgTable)("faq_items", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    categoryId: (0, pg_core_1.integer)("category_id").references(function () { return exports.faqCategories.id; }),
    question: (0, pg_core_1.text)("question").notNull(),
    answer: (0, pg_core_1.text)("answer").notNull(),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// How-To Guides table
exports.howToGuides = (0, pg_core_1.pgTable)("how_to_guides", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    content: (0, pg_core_1.text)("content").notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }),
    difficulty: (0, pg_core_1.varchar)("difficulty", { length: 20 }).default("beginner"), // beginner, intermediate, advanced
    estimatedTime: (0, pg_core_1.varchar)("estimated_time", { length: 50 }), // e.g., "5 minutes", "30 minutes"
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Insert schemas without problematic omits
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users);
exports.insertSecurityEventSchema = (0, drizzle_zod_1.createInsertSchema)(exports.securityEvents);
exports.insertThreatPatternSchema = (0, drizzle_zod_1.createInsertSchema)(exports.threatPatterns);
exports.insertSystemMetricSchema = (0, drizzle_zod_1.createInsertSchema)(exports.systemMetrics);
exports.insertZwapProtectionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.zwapProtection);
exports.insertEncryptionLayerSchema = (0, drizzle_zod_1.createInsertSchema)(exports.encryptionLayers);
exports.insertNetworkNodeSchema = (0, drizzle_zod_1.createInsertSchema)(exports.networkNodes);
exports.insertBadActorSchema = (0, drizzle_zod_1.createInsertSchema)(exports.badActors);
exports.insertDataDeprecationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.dataDeprecation);
exports.insertQuantumProtocolSchema = (0, drizzle_zod_1.createInsertSchema)(exports.quantumProtocols);
exports.insertFaqCategorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.faqCategories);
exports.insertFaqItemSchema = (0, drizzle_zod_1.createInsertSchema)(exports.faqItems);
exports.insertHowToGuideSchema = (0, drizzle_zod_1.createInsertSchema)(exports.howToGuides);
