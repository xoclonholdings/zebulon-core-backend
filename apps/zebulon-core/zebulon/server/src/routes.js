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
var chatContext_1 = require("./chatContext");
var coreMemory_1 = require("./coreMemory");
var onboarding_1 = require("./onboarding");
var apiAuth_1 = require("./apiAuth");
var ollamaClient_1 = require("./ollamaClient");
var agentOpenAIClient_1 = require("./agentOpenAIClient");
function registerRoutes(app) {
    var _this = this;
    // Register onboarding route
    app.use(onboarding_1.default);
    // Register authentication routes
    app.use(apiAuth_1.default);
    // Register the /chat endpoint
    app.post("/chat", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, message, mode, userId, history, reply, err_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = req.body, message = _a.message, mode = _a.mode;
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
                    reply = "";
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    if (!(mode === "agent")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, agentOpenAIClient_1.agentChat)(message, history)];
                case 2:
                    // Agent Mode: Try OpenAI, fallback to Ollama agent model
                    reply = _d.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, (0, ollamaClient_1.ollamaChat)(message, history)];
                case 4:
                    // Default: Use Ollama for chat
                    reply = _d.sent();
                    _d.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _d.sent();
                    reply = "[ZED AI Error] Sorry, I couldn't process your request right now.";
                    return [3 /*break*/, 7];
                case 7:
                    if (userId) {
                        (0, coreMemory_1.appendUserMemory)(userId, "assistant", reply);
                    }
                    else {
                        (0, chatContext_1.appendMessage)(req, "assistant", reply);
                    }
                    return [2 /*return*/, res.status(200).json({ reply: reply, history: history })];
            }
        });
    }); });
    return app;
}
