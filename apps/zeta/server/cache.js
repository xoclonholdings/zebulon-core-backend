"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.PerformanceCache = void 0;
var lru_cache_1 = require("lru-cache");
// In-memory cache for frequently accessed data
var PerformanceCache = /** @class */ (function () {
    function PerformanceCache() {
        // Dashboard data cache - short TTL for real-time data
        this.dashboardCache = new lru_cache_1.LRUCache({
            max: 100,
            ttl: 1000 * 30, // 30 seconds
        });
        // User data cache - longer TTL for relatively static data
        this.userCache = new lru_cache_1.LRUCache({
            max: 1000,
            ttl: 1000 * 60 * 15, // 15 minutes
        });
        // Metrics cache - medium TTL for performance data
        this.metricsCache = new lru_cache_1.LRUCache({
            max: 500,
            ttl: 1000 * 60 * 5, // 5 minutes
        });
    }
    PerformanceCache.getInstance = function () {
        if (!PerformanceCache.instance) {
            PerformanceCache.instance = new PerformanceCache();
        }
        return PerformanceCache.instance;
    };
    // Dashboard caching
    PerformanceCache.prototype.getDashboardData = function (key) {
        return this.dashboardCache.get(key);
    };
    PerformanceCache.prototype.setDashboardData = function (key, data) {
        this.dashboardCache.set(key, data);
    };
    // User caching
    PerformanceCache.prototype.getUser = function (key) {
        return this.userCache.get(key);
    };
    PerformanceCache.prototype.setUser = function (key, user) {
        this.userCache.set(key, user);
    };
    // Metrics caching
    PerformanceCache.prototype.getMetrics = function (key) {
        return this.metricsCache.get(key);
    };
    PerformanceCache.prototype.setMetrics = function (key, metrics) {
        this.metricsCache.set(key, metrics);
    };
    // Cache invalidation
    PerformanceCache.prototype.invalidateDashboard = function () {
        this.dashboardCache.clear();
    };
    PerformanceCache.prototype.invalidateUser = function (userId) {
        if (userId) {
            this.userCache.delete("user:".concat(userId));
        }
        else {
            this.userCache.clear();
        }
    };
    PerformanceCache.prototype.invalidateMetrics = function () {
        this.metricsCache.clear();
    };
    // Cache statistics
    PerformanceCache.prototype.getStats = function () {
        return {
            dashboard: {
                size: this.dashboardCache.size,
                max: this.dashboardCache.max,
            },
            users: {
                size: this.userCache.size,
                max: this.userCache.max,
            },
            metrics: {
                size: this.metricsCache.size,
                max: this.metricsCache.max,
            }
        };
    };
    return PerformanceCache;
}());
exports.PerformanceCache = PerformanceCache;
exports.cache = PerformanceCache.getInstance();
