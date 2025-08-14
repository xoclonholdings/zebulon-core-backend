"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.activeConnection = exports.db = void 0;
exports.executeWithFailover = executeWithFailover;
exports.getActiveConnection = getActiveConnection;
var client_1 = require("@prisma/client");
// Extend console.log to handle unknown error types
function logError(message, error) {
    var errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log("".concat(message, ": ").concat(errorMessage));
}
// Dual Database Configuration
var NEON_URL = process.env.DATABASE_URL_NEON || process.env.DATABASE_URL;
var LOCAL_URL = process.env.DATABASE_URL_LOCAL || "postgresql://".concat(process.env.PGUSER, ":").concat(process.env.PGPASSWORD, "@").concat(process.env.PGHOST, ":").concat(process.env.PGPORT, "/").concat(process.env.PGDATABASE);
var activeConnection = 'neon';
exports.activeConnection = activeConnection;
var db;
function testConnection(url) {
    return __awaiter(this, void 0, void 0, function () {
        var testClient, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    testClient = new client_1.PrismaClient({
                        datasources: { db: { url: url } }
                    });
                    return [4 /*yield*/, testClient.$connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testClient.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, testClient.$disconnect()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    error_1 = _a.sent();
                    logError("Database connection test failed for ".concat(url), error_1);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🔄 Initializing dual database system...');
                    _a = NEON_URL;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, testConnection(NEON_URL)];
                case 1:
                    _a = (_c.sent());
                    _c.label = 2;
                case 2:
                    if (!_a) return [3 /*break*/, 4];
                    console.log('✅ Connected to Neon database (online mode)');
                    exports.db = db = new client_1.PrismaClient({
                        datasources: { db: { url: NEON_URL } }
                    });
                    return [4 /*yield*/, db.$connect()];
                case 3:
                    _c.sent();
                    exports.activeConnection = activeConnection = 'neon';
                    return [2 /*return*/, db];
                case 4:
                    // Fallback to local database
                    console.log('⚠️  Neon database unavailable, switching to local database...');
                    _b = LOCAL_URL;
                    if (!_b) return [3 /*break*/, 6];
                    return [4 /*yield*/, testConnection(LOCAL_URL)];
                case 5:
                    _b = (_c.sent());
                    _c.label = 6;
                case 6:
                    if (!_b) return [3 /*break*/, 8];
                    console.log('✅ Connected to local database (offline mode)');
                    exports.db = db = new client_1.PrismaClient({
                        datasources: { db: { url: LOCAL_URL } }
                    });
                    return [4 /*yield*/, db.$connect()];
                case 7:
                    _c.sent();
                    exports.activeConnection = activeConnection = 'local';
                    return [2 /*return*/, db];
                case 8: throw new Error('❌ Both Neon and local databases are unavailable');
            }
        });
    });
}
// Auto-switch database connection with retry logic
function switchToBackup() {
    return __awaiter(this, void 0, void 0, function () {
        var backupUrl, backupMode, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    backupUrl = activeConnection === 'neon' ? LOCAL_URL : NEON_URL;
                    backupMode = activeConnection === 'neon' ? 'local' : 'neon';
                    _a = backupUrl;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, testConnection(backupUrl)];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    if (!_a) return [3 /*break*/, 5];
                    console.log("\uD83D\uDD04 Switching from ".concat(activeConnection, " to ").concat(backupMode, " database"));
                    // Disconnect current database
                    return [4 /*yield*/, db.$disconnect()];
                case 3:
                    // Disconnect current database
                    _b.sent();
                    // Connect to backup database
                    exports.db = db = new client_1.PrismaClient({
                        datasources: { db: { url: backupUrl } }
                    });
                    return [4 /*yield*/, db.$connect()];
                case 4:
                    _b.sent();
                    exports.activeConnection = activeConnection = backupMode;
                    return [2 /*return*/, true];
                case 5: return [2 /*return*/, false];
            }
        });
    });
}
// Enhanced database wrapper with automatic failover
function executeWithFailover(operation) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2, fallbackError_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 10]);
                    return [4 /*yield*/, operation()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_2 = _a.sent();
                    console.log("Database operation failed on ".concat(activeConnection, ", attempting failover..."));
                    return [4 /*yield*/, switchToBackup()];
                case 3:
                    if (!_a.sent()) return [3 /*break*/, 8];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, operation()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    fallbackError_1 = _a.sent();
                    console.error('Operation failed on both databases:', fallbackError_1);
                    throw fallbackError_1;
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.error('Failover unsuccessful, both databases unavailable');
                    throw error_2;
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Initialize the database connection
initializeDatabase().catch(console.error);
function getActiveConnection() {
    return { connection: activeConnection, database: activeConnection === 'neon' ? 'Neon (Online)' : 'Local (Offline)' };
}
var templateObject_1;
