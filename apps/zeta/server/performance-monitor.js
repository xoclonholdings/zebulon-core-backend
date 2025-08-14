"use strict";
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
exports.performanceMonitor = exports.PerformanceMonitor = void 0;
var db_1 = require("./db");
var cache_1 = require("./cache");
var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor() {
        this.cleanupInterval = null;
        this.analyticsInterval = null;
    }
    PerformanceMonitor.getInstance = function () {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    };
    PerformanceMonitor.prototype.start = function () {
        var _this = this;
        // Run database cleanup every 24 hours
        this.cleanupInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.performCleanup()];
                    case 1:
                        _a.sent();
                        console.log('[Performance] Database cleanup completed');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('[Performance] Cleanup failed:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, 24 * 60 * 60 * 1000); // 24 hours
        // Run analytics every 6 hours
        this.analyticsInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.analyzePerformance()];
                    case 1:
                        _a.sent();
                        console.log('[Performance] Analytics completed');
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('[Performance] Analytics failed:', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, 6 * 60 * 60 * 1000); // 6 hours
        console.log('[Performance] Monitor started');
    };
    PerformanceMonitor.prototype.stop = function () {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        if (this.analyticsInterval) {
            clearInterval(this.analyticsInterval);
            this.analyticsInterval = null;
        }
        console.log('[Performance] Monitor stopped');
    };
    PerformanceMonitor.prototype.performCleanup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Call database cleanup function
                    return [4 /*yield*/, db_1.db.execute("SELECT cleanup_old_security_events();")];
                    case 1:
                        // Call database cleanup function
                        _a.sent();
                        // Clear all caches to ensure fresh data
                        cache_1.cache.invalidateDashboard();
                        cache_1.cache.invalidateMetrics();
                        cache_1.cache.invalidateUser();
                        return [2 /*return*/];
                }
            });
        });
    };
    PerformanceMonitor.prototype.analyzePerformance = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Update table statistics for query optimization
                    return [4 /*yield*/, db_1.db.execute("SELECT analyze_performance_tables();")];
                    case 1:
                        // Update table statistics for query optimization
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PerformanceMonitor.prototype.getPerformanceStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheStats, dbStats, tableSizes, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        cacheStats = cache_1.cache.getStats();
                        return [4 /*yield*/, db_1.db.execute("\n        SELECT \n          count(*) as active_connections,\n          (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_queries\n        FROM pg_stat_activity \n        WHERE datname = current_database();\n      ")];
                    case 1:
                        dbStats = _a.sent();
                        return [4 /*yield*/, db_1.db.execute("\n        SELECT \n          schemaname,\n          tablename,\n          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,\n          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes\n        FROM pg_tables \n        WHERE schemaname = 'public'\n        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;\n      ")];
                    case 2:
                        tableSizes = _a.sent();
                        return [2 /*return*/, {
                                cache: cacheStats,
                                database: dbStats,
                                tables: tableSizes,
                                timestamp: new Date().toISOString()
                            }];
                    case 3:
                        error_3 = _a.sent();
                        console.error('[Performance] Failed to get stats:', error_3);
                        return [2 /*return*/, {
                                error: 'Failed to retrieve performance statistics',
                                timestamp: new Date().toISOString()
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PerformanceMonitor;
}());
exports.PerformanceMonitor = PerformanceMonitor;
exports.performanceMonitor = PerformanceMonitor.getInstance();
