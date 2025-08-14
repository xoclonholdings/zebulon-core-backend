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
exports.setupSocketHandlers = setupSocketHandlers;
var socket_io_1 = require("socket.io");
var storage_1 = require("../storage");
var zeta_core_1 = require("./zeta-core");
var firewall_service_1 = require("./firewall-service");
function setupSocketHandlers(httpServer) {
    var _this = this;
    var io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on("connection", function (socket) { return __awaiter(_this, void 0, void 0, function () {
        var zetaCoreStatus, updateInterval;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("SOC Dashboard client connected");
                    return [4 /*yield*/, zeta_core_1.zetaCore.getStatus()];
                case 1:
                    zetaCoreStatus = _a.sent();
                    socket.emit("initialData", {
                        zetaCore: zetaCoreStatus,
                        threatCounters: firewall_service_1.firewallService.getThreatCounters(),
                    });
                    updateInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, securityEvents, systemMetrics, zwapProtection, encryptionLayers, networkNodes, zetaCoreStatus_1, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, Promise.all([
                                            storage_1.storage.getSecurityEvents(10),
                                            storage_1.storage.getLatestSystemMetrics(),
                                            storage_1.storage.getZwapProtectionStatus(),
                                            storage_1.storage.getEncryptionLayers(),
                                            storage_1.storage.getNetworkNodes(),
                                            zeta_core_1.zetaCore.getStatus(),
                                        ])];
                                case 1:
                                    _a = _b.sent(), securityEvents = _a[0], systemMetrics = _a[1], zwapProtection = _a[2], encryptionLayers = _a[3], networkNodes = _a[4], zetaCoreStatus_1 = _a[5];
                                    socket.emit("securityUpdate", {
                                        zetaCore: zetaCoreStatus_1,
                                        threatCounters: firewall_service_1.firewallService.getThreatCounters(),
                                        securityEvents: securityEvents,
                                        systemMetrics: systemMetrics,
                                        zwapProtection: zwapProtection,
                                        encryptionLayers: encryptionLayers,
                                        networkNodes: networkNodes,
                                        timestamp: new Date().toISOString(),
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _b.sent();
                                    console.error("Error sending security update:", error_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, 5000);
                    socket.on("disconnect", function () {
                        console.log("SOC Dashboard client disconnected");
                        clearInterval(updateInterval);
                    });
                    // Handle manual refresh requests
                    socket.on("refreshData", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, securityEvents, systemMetrics, zwapProtection, encryptionLayers, networkNodes, zetaCoreStatus_2, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, Promise.all([
                                            storage_1.storage.getSecurityEvents(10),
                                            storage_1.storage.getLatestSystemMetrics(),
                                            storage_1.storage.getZwapProtectionStatus(),
                                            storage_1.storage.getEncryptionLayers(),
                                            storage_1.storage.getNetworkNodes(),
                                            zeta_core_1.zetaCore.getStatus(),
                                        ])];
                                case 1:
                                    _a = _b.sent(), securityEvents = _a[0], systemMetrics = _a[1], zwapProtection = _a[2], encryptionLayers = _a[3], networkNodes = _a[4], zetaCoreStatus_2 = _a[5];
                                    socket.emit("securityUpdate", {
                                        zetaCore: zetaCoreStatus_2,
                                        threatCounters: firewall_service_1.firewallService.getThreatCounters(),
                                        securityEvents: securityEvents,
                                        systemMetrics: systemMetrics,
                                        zwapProtection: zwapProtection,
                                        encryptionLayers: encryptionLayers,
                                        networkNodes: networkNodes,
                                        timestamp: new Date().toISOString(),
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _b.sent();
                                    console.error("Error refreshing data:", error_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Handle threat investigation
                    socket.on("investigateThreat", function (eventId) { return __awaiter(_this, void 0, void 0, function () {
                        var error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.updateSecurityEventStatus(eventId, "INVESTIGATING")];
                                case 1:
                                    _a.sent();
                                    socket.emit("threatUpdated", { eventId: eventId, status: "INVESTIGATING" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_3 = _a.sent();
                                    console.error("Error investigating threat:", error_3);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Handle threat resolution
                    socket.on("resolveThreat", function (eventId) { return __awaiter(_this, void 0, void 0, function () {
                        var error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.updateSecurityEventStatus(eventId, "RESOLVED")];
                                case 1:
                                    _a.sent();
                                    socket.emit("threatUpdated", { eventId: eventId, status: "RESOLVED" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_4 = _a.sent();
                                    console.error("Error resolving threat:", error_4);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); });
    return io;
}
