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
exports.handleUpdate = handleUpdate;
var client_1 = require("@prisma/client");
var crypto_1 = require("./crypto");
var bus_1 = require("./bus");
var prisma = new client_1.PrismaClient();
function handleUpdate(req, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var t0, tile, action, payload, _a, dryRun, summary, events, _b, latencyMs, payloadHash, e_1, latencyMs, _c;
        var _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    t0 = Date.now();
                    tile = req.tile, action = req.action, payload = req.payload, _a = req.dryRun, dryRun = _a === void 0 ? false : _a;
                    summary = "";
                    events = [];
                    _m.label = 1;
                case 1:
                    _m.trys.push([1, 15, , 20]);
                    _b = "".concat(tile, ".").concat(action);
                    switch (_b) {
                        case "zed.model.params.update": return [3 /*break*/, 2];
                        case "zed.rag.reindex": return [3 /*break*/, 5];
                        case "zeta.rules.update": return [3 /*break*/, 6];
                        case "zlab.docs.sync": return [3 /*break*/, 7];
                        case "zwap.wallets.refresh": return [3 /*break*/, 8];
                        case "zync.pipeline.test": return [3 /*break*/, 9];
                        case "zulu.health.snapshot": return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 11];
                case 2:
                    summary = "Model params updated (temp=".concat(payload.temp, ", maxTokens=").concat(payload.maxTokens, ", topk=").concat(payload.topk, ")");
                    if (!!dryRun) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.memoryNote.upsert({
                            where: { id: "zed.params.global" },
                            update: { value: JSON.stringify(payload) },
                            create: { id: "zed.params.global", scope: "global", key: "zed.params", value: JSON.stringify(payload) }
                        })];
                case 3:
                    _m.sent();
                    _m.label = 4;
                case 4: return [3 /*break*/, 12];
                case 5:
                    summary = "RAG reindexed ".concat(Array.isArray(payload.docIds) ? payload.docIds.length : 0, " docs");
                    if (!dryRun)
                        bus_1.bus.emit("docs:changed", { count: (_e = (_d = payload.docIds) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0 });
                    events.push({ topic: "docs:changed", message: "Docs updated; reindex in progress" });
                    return [3 /*break*/, 12];
                case 6:
                    summary = "Security rules updated (rateLimit=".concat(payload.rateLimit, ", allowlist=").concat((_g = (_f = payload.toolAllowlist) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0, ")");
                    if (!dryRun)
                        bus_1.bus.emit("security:policyChanged", {});
                    events.push({ topic: "security:policyChanged", message: "Security policy changed" });
                    return [3 /*break*/, 12];
                case 7:
                    summary = "ZLab docs synced (".concat(payload.count, ")");
                    if (!dryRun)
                        bus_1.bus.emit("docs:changed", { count: payload.count });
                    events.push({ topic: "docs:changed", message: "ZLab synced docs" });
                    return [3 /*break*/, 12];
                case 8:
                    summary = "ZWAP wallets refreshed (".concat((_j = (_h = payload.addresses) === null || _h === void 0 ? void 0 : _h.length) !== null && _j !== void 0 ? _j : 0, ")");
                    if (!dryRun)
                        bus_1.bus.emit("finance:dataChanged", {});
                    events.push({ topic: "finance:dataChanged", message: "Wallet balances updated" });
                    return [3 /*break*/, 12];
                case 9:
                    summary = "ZYNC pipeline tests triggered (".concat((_l = (_k = payload.suites) === null || _k === void 0 ? void 0 : _k.length) !== null && _l !== void 0 ? _l : 0, ")");
                    if (!dryRun)
                        bus_1.bus.emit("dev:e2eDone", { pass: 12, fail: 1 });
                    events.push({ topic: "dev:e2eDone", message: "E2E tests finished" });
                    return [3 /*break*/, 12];
                case 10:
                    summary = "ZULU health snapshot (".concat(payload.depth, ")");
                    if (!dryRun)
                        bus_1.bus.emit("system:healthUpdated", { depth: payload.depth });
                    events.push({ topic: "system:healthUpdated", message: "System health updated" });
                    return [3 /*break*/, 12];
                case 11: return [2 /*return*/, { ok: false, error: "Unknown tile.action: ".concat(tile, ".").concat(action) }];
                case 12:
                    latencyMs = Date.now() - t0;
                    payloadHash = (0, crypto_1.sha256)(JSON.stringify(payload));
                    if (!!dryRun) return [3 /*break*/, 14];
                    return [4 /*yield*/, prisma.auditLog.create({
                            data: {
                                userId: userId,
                                tile: tile,
                                action: action,
                                idempotency: req.idempotencyKey,
                                payloadHash: payloadHash,
                                dryRun: false,
                                success: true,
                                latencyMs: latencyMs,
                                diffSummary: summary,
                                message: summary
                            }
                        })];
                case 13:
                    _m.sent();
                    _m.label = 14;
                case 14: return [2 /*return*/, {
                        ok: true,
                        summary: summary,
                        badge: { status: "ok", label: summary, at: new Date().toISOString() },
                        events: events
                    }];
                case 15:
                    e_1 = _m.sent();
                    latencyMs = Date.now() - t0;
                    _m.label = 16;
                case 16:
                    _m.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, prisma.auditLog.create({
                            data: {
                                userId: userId,
                                tile: tile,
                                action: action,
                                idempotency: req.idempotencyKey,
                                payloadHash: (0, crypto_1.sha256)(JSON.stringify(payload)),
                                dryRun: !!dryRun,
                                success: false,
                                latencyMs: latencyMs,
                                message: (e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || "Update failed"
                            }
                        })];
                case 17:
                    _m.sent();
                    return [3 /*break*/, 19];
                case 18:
                    _c = _m.sent();
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/, { ok: false, error: (e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || "Update failed" }];
                case 20: return [2 /*return*/];
            }
        });
    });
}
