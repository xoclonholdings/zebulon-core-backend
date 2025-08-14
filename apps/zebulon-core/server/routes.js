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
exports.registerRoutes = registerRoutes;
var zedLiteApi_1 = require("./zedLiteApi");
var chatContext_1 = require("./chatContext");
var coreMemory_1 = require("./coreMemory");
var onboarding_1 = require("./onboarding");
var apiAuth_1 = require("./apiAuth");
var ollamaClient_1 = require("./ollamaClient");
var agentOpenAIClient_1 = require("./agentOpenAIClient");
function registerRoutes(app) {
    var _this = this;
    // Advanced memory management endpoints
    app.get('/memory', function (req, res) {
        var _a, _b;
        var userId = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.username;
        if (!userId)
            return res.status(401).json({ error: 'Not authenticated' });
        var _c = req.query, tag = _c.tag, limit = _c.limit;
        var mem = (0, coreMemory_1.getUserMemory)(userId, { tag: tag, limit: limit ? Number(limit) : undefined });
        res.json({ memory: mem });
    });
    app.get('/memory/search', function (req, res) {
        var _a, _b;
        var userId = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.username;
        if (!userId)
            return res.status(401).json({ error: 'Not authenticated' });
        var q = req.query.q;
        if (!q)
            return res.status(400).json({ error: 'query required' });
        var results = (0, coreMemory_1.searchUserMemory)(userId, q);
        res.json({ results: results });
    });
    app.post('/memory/clear', function (req, res) {
        var _a, _b;
        var userId = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.username;
        if (!userId)
            return res.status(401).json({ error: 'Not authenticated' });
        (0, coreMemory_1.clearUserMemory)(userId);
        res.json({ ok: true });
    });
    // Register onboarding route
    app.use(onboarding_1.default);
    // Register authentication routes
    app.use(apiAuth_1.default);
    // Register Zed Lite API route (isolated, CORS for CodeSandbox)
    app.use(zedLiteApi_1.default);
    // Register the /chat endpoint
    // Enhanced /chat endpoint: supports streaming, model selection, and advanced error handling
    app.post("/chat", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, message, mode, model, stream, userId, history, full_1, reply, err_1, errorMsg;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = req.body, message = _a.message, mode = _a.mode, model = _a.model, stream = _a.stream;
                    if (!message) {
                        return [2 /*return*/, res.status(400).json({ error: "message required" })];
                    }
                    userId = (_c = (_b = req.session) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.username;
                    if (userId) {
                        (0, coreMemory_1.appendUserMemory)(userId, "user", message);
                        history = (0, coreMemory_1.getUserMemory)(userId);
                    }
                    else {
                        (0, chatContext_1.appendMessage)(req, "user", message);
                        history = (0, chatContext_1.getHistory)(req);
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 9, , 10]);
                    if (!stream) return [3 /*break*/, 3];
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');
                    full_1 = '';
                    return [4 /*yield*/, (0, ollamaClient_1.ollamaChat)(message, history, model, {
                            stream: true,
                            onToken: function (token) {
                                full_1 += token;
                                res.write("data: ".concat(JSON.stringify({ token: token }), "\n\n"));
                            }
                        })];
                case 2:
                    _d.sent();
                    if (userId)
                        (0, coreMemory_1.appendUserMemory)(userId, "assistant", full_1);
                    else
                        (0, chatContext_1.appendMessage)(req, "assistant", full_1);
                    res.write("data: ".concat(JSON.stringify({ done: true, reply: full_1 }), "\n\n"));
                    res.end();
                    return [3 /*break*/, 8];
                case 3:
                    reply = "";
                    if (!(mode === "agent")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, agentOpenAIClient_1.agentChat)(message, history, model)];
                case 4:
                    reply = _d.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, (0, ollamaClient_1.ollamaChat)(message, history, model)];
                case 6:
                    reply = _d.sent();
                    _d.label = 7;
                case 7:
                    if (userId)
                        (0, coreMemory_1.appendUserMemory)(userId, "assistant", reply);
                    else
                        (0, chatContext_1.appendMessage)(req, "assistant", reply);
                    return [2 /*return*/, res.status(200).json({ reply: reply, history: history })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_1 = _d.sent();
                    errorMsg = (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || '[ZED AI Error] Sorry, I couldn\'t process your request right now.';
                    if (stream) {
                        res.write("data: ".concat(JSON.stringify({ error: errorMsg }), "\n\n"));
                        res.end();
                    }
                    else {
                        return [2 /*return*/, res.status(500).json({ error: errorMsg })];
                    }
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    // List Ollama models
    app.get('/ollama/models', function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var models, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, ollamaClient_1.listOllamaModels)()];
                case 1:
                    models = _a.sent();
                    res.json({ models: models });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    res.status(500).json({ error: e_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Ollama health check
    app.get('/ollama/health', function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var health;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ollamaClient_1.ollamaHealthCheck)()];
                case 1:
                    health = _a.sent();
                    res.json(health);
                    return [2 /*return*/];
            }
        });
    }); });
    // Switch Ollama model (no-op, placeholder)
    app.post('/ollama/switch-model', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var model, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = req.body.model;
                    if (!model)
                        return [2 /*return*/, res.status(400).json({ error: 'model required' })];
                    return [4 /*yield*/, (0, ollamaClient_1.switchOllamaModel)(model)];
                case 1:
                    result = _a.sent();
                    res.json(result);
                    return [2 /*return*/];
            }
        });
    }); });
    return app;
}
