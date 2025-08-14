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
exports.firewallService = exports.FirewallService = void 0;
var storage_1 = require("../storage");
var FirewallService = /** @class */ (function () {
    function FirewallService() {
        this.threatCounters = {
            aiInjection: 0,
            corporateSabotage: 0,
            marketManipulation: 0,
            totalBlocked: 0,
        };
    }
    FirewallService.prototype.detectThreat = function (source, target, threatType) {
        return __awaiter(this, void 0, void 0, function () {
            var patterns, matchingPattern;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.storage.getThreatPatterns()];
                    case 1:
                        patterns = _a.sent();
                        matchingPattern = patterns.find(function (p) { return p.patternType === threatType; });
                        if (!(matchingPattern && matchingPattern.confidence > 80)) return [3 /*break*/, 3];
                        // Log security event
                        return [4 /*yield*/, storage_1.storage.createSecurityEvent({
                                eventType: threatType,
                                severity: this.getSeverityForThreatType(threatType),
                                source: source,
                                target: target,
                                description: "".concat(threatType, " detected from ").concat(source, " targeting ").concat(target),
                                metadata: { patternId: matchingPattern.id, confidence: matchingPattern.confidence },
                                status: "ACTIVE",
                            })];
                    case 2:
                        // Log security event
                        _a.sent();
                        // Update counters
                        this.updateThreatCounters(threatType);
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    FirewallService.prototype.getSeverityForThreatType = function (threatType) {
        switch (threatType) {
            case "AI_INJECTION":
            case "CORPORATE_SABOTAGE":
                return "CRITICAL";
            case "MARKET_MANIPULATION":
                return "HIGH";
            default:
                return "MEDIUM";
        }
    };
    FirewallService.prototype.updateThreatCounters = function (threatType) {
        this.threatCounters.totalBlocked++;
        switch (threatType) {
            case "AI_INJECTION":
                this.threatCounters.aiInjection++;
                break;
            case "CORPORATE_SABOTAGE":
                this.threatCounters.corporateSabotage++;
                break;
            case "MARKET_MANIPULATION":
                this.threatCounters.marketManipulation++;
                break;
        }
    };
    FirewallService.prototype.getThreatCounters = function () {
        return this.threatCounters;
    };
    FirewallService.prototype.updateSystemMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metrics, _i, metrics_1, metric;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metrics = [
                            { metricType: "CPU", value: Math.floor(Math.random() * 30) + 15, unit: "%" },
                            { metricType: "MEMORY", value: Math.floor(Math.random() * 40) + 50, unit: "%" },
                            { metricType: "NETWORK", value: Math.floor(Math.random() * 30) + 30, unit: "%" },
                            { metricType: "ENCRYPTION_STATUS", value: 100, unit: "%" },
                        ];
                        _i = 0, metrics_1 = metrics;
                        _a.label = 1;
                    case 1:
                        if (!(_i < metrics_1.length)) return [3 /*break*/, 4];
                        metric = metrics_1[_i];
                        return [4 /*yield*/, storage_1.storage.createSystemMetric(metric)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FirewallService.prototype.verifyZwapSecurity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var protectionStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.storage.getZwapProtectionStatus()];
                    case 1:
                        protectionStatus = _a.sent();
                        return [2 /*return*/, protectionStatus.every(function (component) { return component.status === "SECURE" && component.integrityScore >= 90; })];
                }
            });
        });
    };
    FirewallService.prototype.simulateThreatDetection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var threats, randomThreat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        threats = [
                            { source: "192.168.1.47", target: "ZWAP_API", type: "AI_INJECTION" },
                            { source: "10.0.0.23", target: "XHI_CONTRACT", type: "CORPORATE_SABOTAGE" },
                            { source: "172.16.0.15", target: "TRADING_ENGINE", type: "MARKET_MANIPULATION" },
                        ];
                        randomThreat = threats[Math.floor(Math.random() * threats.length)];
                        return [4 /*yield*/, this.detectThreat(randomThreat.source, randomThreat.target, randomThreat.type)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FirewallService;
}());
exports.FirewallService = FirewallService;
exports.firewallService = new FirewallService();
