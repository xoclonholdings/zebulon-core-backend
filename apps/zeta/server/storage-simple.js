"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = void 0;
var schema_1 = require("@shared/schema");
var db_1 = require("./db");
var drizzle_orm_1 = require("drizzle-orm");
var cache_1 = require("./cache");
// Simple Database Storage Implementation
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
        this.sessionStore = null; // Session management handled by application layer
        // Session store disabled to prevent database errors
        // this.sessionStore = new PostgresSessionStore({ 
        //   conString: process.env.DATABASE_URL,
        //   createTableIfMissing: true 
        // });
    }
    // User operations
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "user:".concat(id);
                        cached = cache_1.cache.getUser(cacheKey);
                        if (cached)
                            return [2 /*return*/, cached];
                        return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        if (user) {
                            cache_1.cache.setUser(cacheKey, user);
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByWallet = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.walletAddress, walletAddress))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUserWithWallet = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.users).values({
                            walletAddress: userData.walletAddress,
                            lastLoginAt: userData.lastLoginAt || new Date(),
                        }).returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateUserLastLogin = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.users).set({ lastLoginAt: new Date() }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserBySocialId = function (provider, socialId) {
        return __awaiter(this, void 0, void 0, function () {
            var column, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        column = provider === 'twitter' ? schema_1.users.twitterId :
                            provider === 'instagram' ? schema_1.users.instagramId :
                                provider === 'snapchat' ? schema_1.users.snapchatId : null;
                        if (!column)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(column, socialId))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.createSocialUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.users).values(__assign(__assign({}, userData), { lastLoginAt: new Date() })).returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.users).values(userData).returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.upsertUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, updated, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userData.id) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getUser(userData.id)];
                    case 1:
                        existingUser = _a.sent();
                        if (!existingUser) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.db.update(schema_1.users)
                                .set({
                                email: userData.email,
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                profileImageUrl: userData.profileImageUrl,
                                lastLoginAt: new Date(),
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.users.id, userData.id))
                                .returning()];
                    case 2:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                    case 3: return [4 /*yield*/, db_1.db.insert(schema_1.users).values(__assign(__assign({}, userData), { lastLoginAt: new Date() })).returning()];
                    case 4:
                        newUser = (_a.sent())[0];
                        return [2 /*return*/, newUser];
                }
            });
        });
    };
    // Security events
    DatabaseStorage.prototype.getSecurityEvents = function () {
        return __awaiter(this, arguments, void 0, function (limit, offset) {
            var effectiveLimit, events;
            if (limit === void 0) { limit = 50; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        effectiveLimit = limit > 10000 ? 10000 : limit;
                        return [4 /*yield*/, db_1.db.select().from(schema_1.securityEvents)
                                .orderBy((0, drizzle_orm_1.desc)(schema_1.securityEvents.timestamp))
                                .limit(effectiveLimit)
                                .offset(offset)];
                    case 1:
                        events = _a.sent();
                        return [2 /*return*/, events];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSecurityEventsByTimeRange = function (startTime, endTime) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.securityEvents)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.securityEvents.timestamp, startTime), (0, drizzle_orm_1.lt)(schema_1.securityEvents.timestamp, endTime)))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.securityEvents.timestamp))];
                    case 1:
                        events = _a.sent();
                        return [2 /*return*/, events];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSecurityEventsByType = function (eventType_1) {
        return __awaiter(this, arguments, void 0, function (eventType, limit) {
            var events;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.securityEvents)
                            .where((0, drizzle_orm_1.eq)(schema_1.securityEvents.eventType, eventType))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.securityEvents.timestamp))
                            .limit(limit)];
                    case 1:
                        events = _a.sent();
                        return [2 /*return*/, events];
                }
            });
        });
    };
    DatabaseStorage.prototype.bulkCreateSecurityEvents = function (events) {
        return __awaiter(this, void 0, void 0, function () {
            var batchSize, results, i, batch, created;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (events.length === 0)
                            return [2 /*return*/, []];
                        batchSize = 1000;
                        results = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < events.length)) return [3 /*break*/, 4];
                        batch = events.slice(i, i + batchSize);
                        return [4 /*yield*/, db_1.db.insert(schema_1.securityEvents).values(batch).returning()];
                    case 2:
                        created = _a.sent();
                        results.push.apply(results, created);
                        _a.label = 3;
                    case 3:
                        i += batchSize;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        });
    };
    DatabaseStorage.prototype.createSecurityEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var securityEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.securityEvents).values(event).returning()];
                    case 1:
                        securityEvent = (_a.sent())[0];
                        // Invalidate cache when new events are created
                        cache_1.cache.invalidateDashboard();
                        cache_1.cache.invalidateMetrics();
                        return [2 /*return*/, securityEvent];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateSecurityEventStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.securityEvents).set({ status: status }).where((0, drizzle_orm_1.eq)(schema_1.securityEvents.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated || undefined];
                }
            });
        });
    };
    // Threat patterns
    DatabaseStorage.prototype.getThreatPatterns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patterns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.threatPatterns)];
                    case 1:
                        patterns = _a.sent();
                        return [2 /*return*/, patterns];
                }
            });
        });
    };
    DatabaseStorage.prototype.getActiveThreatPatterns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patterns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.threatPatterns).where((0, drizzle_orm_1.eq)(schema_1.threatPatterns.isActive, true))];
                    case 1:
                        patterns = _a.sent();
                        return [2 /*return*/, patterns];
                }
            });
        });
    };
    DatabaseStorage.prototype.createThreatPattern = function (pattern) {
        return __awaiter(this, void 0, void 0, function () {
            var threatPattern;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.threatPatterns).values(pattern).returning()];
                    case 1:
                        threatPattern = (_a.sent())[0];
                        return [2 /*return*/, threatPattern];
                }
            });
        });
    };
    // System metrics
    DatabaseStorage.prototype.getLatestSystemMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, metrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = 'latest_metrics';
                        cached = cache_1.cache.getMetrics(cacheKey);
                        if (cached)
                            return [2 /*return*/, cached];
                        return [4 /*yield*/, db_1.db.select().from(schema_1.systemMetrics)
                                .orderBy((0, drizzle_orm_1.desc)(schema_1.systemMetrics.timestamp))
                                .limit(50)];
                    case 1:
                        metrics = _a.sent();
                        cache_1.cache.setMetrics(cacheKey, metrics);
                        return [2 /*return*/, metrics];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSystemMetricsByType = function (metricType_1) {
        return __awaiter(this, arguments, void 0, function (metricType, limit) {
            var metrics;
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.systemMetrics)
                            .where((0, drizzle_orm_1.eq)(schema_1.systemMetrics.metricType, metricType))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.systemMetrics.timestamp))
                            .limit(limit)];
                    case 1:
                        metrics = _a.sent();
                        return [2 /*return*/, metrics];
                }
            });
        });
    };
    DatabaseStorage.prototype.bulkCreateSystemMetrics = function (metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var batchSize, results, i, batch, created;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (metrics.length === 0)
                            return [2 /*return*/, []];
                        batchSize = 1000;
                        results = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < metrics.length)) return [3 /*break*/, 4];
                        batch = metrics.slice(i, i + batchSize);
                        return [4 /*yield*/, db_1.db.insert(schema_1.systemMetrics).values(batch).returning()];
                    case 2:
                        created = _a.sent();
                        results.push.apply(results, created);
                        _a.label = 3;
                    case 3:
                        i += batchSize;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        });
    };
    DatabaseStorage.prototype.createSystemMetric = function (metric) {
        return __awaiter(this, void 0, void 0, function () {
            var systemMetric;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.systemMetrics).values(metric).returning()];
                    case 1:
                        systemMetric = (_a.sent())[0];
                        // Invalidate metrics cache when new data is added
                        cache_1.cache.invalidateMetrics();
                        return [2 /*return*/, systemMetric];
                }
            });
        });
    };
    // ZWAP protection
    DatabaseStorage.prototype.getZwapProtectionStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var protection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.zwapProtection)];
                    case 1:
                        protection = _a.sent();
                        return [2 /*return*/, protection];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateZwapProtection = function (id, status, integrityScore) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.zwapProtection).set({ status: status, integrityScore: integrityScore }).where((0, drizzle_orm_1.eq)(schema_1.zwapProtection.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated || undefined];
                }
            });
        });
    };
    // Encryption layers
    DatabaseStorage.prototype.getEncryptionLayers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var layers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.encryptionLayers).orderBy(schema_1.encryptionLayers.layerNumber)];
                    case 1:
                        layers = _a.sent();
                        return [2 /*return*/, layers];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateEncryptionLayer = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.encryptionLayers).set({ status: status }).where((0, drizzle_orm_1.eq)(schema_1.encryptionLayers.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated || undefined];
                }
            });
        });
    };
    // Network nodes
    DatabaseStorage.prototype.getNetworkNodes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.networkNodes)];
                    case 1:
                        nodes = _a.sent();
                        return [2 /*return*/, nodes];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateNetworkNode = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.networkNodes).set({ status: status }).where((0, drizzle_orm_1.eq)(schema_1.networkNodes.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated || undefined];
                }
            });
        });
    };
    // Bad actors
    DatabaseStorage.prototype.getBadActors = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var actors;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.badActors).limit(limit)];
                    case 1:
                        actors = _a.sent();
                        return [2 /*return*/, actors];
                }
            });
        });
    };
    DatabaseStorage.prototype.getBadActorsByThreatLevel = function (minLevel) {
        return __awaiter(this, void 0, void 0, function () {
            var actors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.badActors)
                            .where((0, drizzle_orm_1.gte)(schema_1.badActors.threatLevel, minLevel))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.badActors.threatLevel))];
                    case 1:
                        actors = _a.sent();
                        return [2 /*return*/, actors];
                }
            });
        });
    };
    DatabaseStorage.prototype.createBadActor = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            var badActor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.badActors).values(actor).returning()];
                    case 1:
                        badActor = (_a.sent())[0];
                        return [2 /*return*/, badActor];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateBadActor = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.badActors).set(updates).where((0, drizzle_orm_1.eq)(schema_1.badActors.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.escalateBadActor = function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            var actor, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.badActors).where((0, drizzle_orm_1.eq)(schema_1.badActors.identifier, identifier))];
                    case 1:
                        actor = (_a.sent())[0];
                        if (!actor) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updateBadActor(actor.id, {
                                threatLevel: Math.min(10, actor.threatLevel + 1),
                                attempts: actor.attempts + 1,
                                lastActivity: new Date(),
                            })];
                    case 2:
                        updated = _a.sent();
                        return [2 /*return*/, updated];
                    case 3: return [2 /*return*/, undefined];
                }
            });
        });
    };
    // Data deprecation
    DatabaseStorage.prototype.getActiveDeprecations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deprecations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.dataDeprecation)
                            .where((0, drizzle_orm_1.eq)(schema_1.dataDeprecation.status, 'ACTIVE'))];
                    case 1:
                        deprecations = _a.sent();
                        return [2 /*return*/, deprecations];
                }
            });
        });
    };
    DatabaseStorage.prototype.createDataDeprecation = function (deprecation) {
        return __awaiter(this, void 0, void 0, function () {
            var dataDeprecationItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.dataDeprecation).values(deprecation).returning()];
                    case 1:
                        dataDeprecationItem = (_a.sent())[0];
                        return [2 /*return*/, dataDeprecationItem];
                }
            });
        });
    };
    DatabaseStorage.prototype.expireDeprecation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.dataDeprecation).set({ status: "EXPIRED" }).where((0, drizzle_orm_1.eq)(schema_1.dataDeprecation.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated || undefined];
                }
            });
        });
    };
    // Quantum protocols
    DatabaseStorage.prototype.getQuantumProtocols = function () {
        return __awaiter(this, void 0, void 0, function () {
            var protocols;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.quantumProtocols)
                            .where((0, drizzle_orm_1.eq)(schema_1.quantumProtocols.isActive, true))];
                    case 1:
                        protocols = _a.sent();
                        return [2 /*return*/, protocols];
                }
            });
        });
    };
    DatabaseStorage.prototype.createQuantumProtocol = function (protocol) {
        return __awaiter(this, void 0, void 0, function () {
            var quantumProtocol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.quantumProtocols).values(protocol).returning()];
                    case 1:
                        quantumProtocol = (_a.sent())[0];
                        return [2 /*return*/, quantumProtocol];
                }
            });
        });
    };
    DatabaseStorage.prototype.activateProtocol = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.quantumProtocols)
                            .set({ isActive: true })
                            .where((0, drizzle_orm_1.eq)(schema_1.quantumProtocols.id, id))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated || undefined];
                }
            });
        });
    };
    // FAQ management methods
    DatabaseStorage.prototype.getFaqCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var categories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.faqCategories)
                            .where((0, drizzle_orm_1.eq)(schema_1.faqCategories.isActive, true))
                            .orderBy(schema_1.faqCategories.displayOrder)];
                    case 1:
                        categories = _a.sent();
                        return [2 /*return*/, categories];
                }
            });
        });
    };
    DatabaseStorage.prototype.getFaqItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.faqItems)
                            .where((0, drizzle_orm_1.eq)(schema_1.faqItems.isActive, true))
                            .orderBy(schema_1.faqItems.displayOrder)];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    DatabaseStorage.prototype.createFaqItem = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var created;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.faqItems).values(item).returning()];
                    case 1:
                        created = (_a.sent())[0];
                        return [2 /*return*/, created];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateFaqItem = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.faqItems)
                            .set(__assign(__assign({}, updates), { updatedAt: new Date() }))
                            .where((0, drizzle_orm_1.eq)(schema_1.faqItems.id, id))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteFaqItem = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.faqItems)
                            .set({ isActive: false })
                            .where((0, drizzle_orm_1.eq)(schema_1.faqItems.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // How-To guides management methods
    DatabaseStorage.prototype.getHowToGuides = function () {
        return __awaiter(this, void 0, void 0, function () {
            var guides;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.howToGuides)
                            .where((0, drizzle_orm_1.eq)(schema_1.howToGuides.isActive, true))
                            .orderBy(schema_1.howToGuides.displayOrder)];
                    case 1:
                        guides = _a.sent();
                        return [2 /*return*/, guides];
                }
            });
        });
    };
    DatabaseStorage.prototype.getHowToGuideById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var guide;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.howToGuides)
                            .where((0, drizzle_orm_1.eq)(schema_1.howToGuides.id, id))];
                    case 1:
                        guide = (_a.sent())[0];
                        return [2 /*return*/, guide];
                }
            });
        });
    };
    DatabaseStorage.prototype.createHowToGuide = function (guide) {
        return __awaiter(this, void 0, void 0, function () {
            var created;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.howToGuides).values(guide).returning()];
                    case 1:
                        created = (_a.sent())[0];
                        return [2 /*return*/, created];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateHowToGuide = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.howToGuides)
                            .set(__assign(__assign({}, updates), { updatedAt: new Date() }))
                            .where((0, drizzle_orm_1.eq)(schema_1.howToGuides.id, id))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteHowToGuide = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.howToGuides)
                            .set({ isActive: false })
                            .where((0, drizzle_orm_1.eq)(schema_1.howToGuides.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DatabaseStorage;
}());
exports.DatabaseStorage = DatabaseStorage;
// Use the simple database storage
exports.storage = new DatabaseStorage();
