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
var express_1 = require("express");
var cors_1 = require("cors");
var chatContext_1 = require("./chatContext");
var ollamaClient_1 = require("./ollamaClient");
var agentOpenAIClient_1 = require("./agentOpenAIClient");
var fs_1 = require("fs");
var path_1 = require("path");
var uuid_1 = require("uuid");
var zedLiteRouter = (0, express_1.Router)();
// CORS for CodeSandbox and zed-ai.online only for this route
var codesandboxCors = (0, cors_1.default)({
    origin: [/\.codesandbox\.io$/, "https://codesandbox.io", "https://zed-ai.online"],
    methods: ["GET", "POST", "OPTIONS"],
});
zedLiteRouter.options("/zed-lite", codesandboxCors);
// Persistent log file path
var logDir = path_1.default.join(__dirname, "..", "logs");
var logFile = path_1.default.join(logDir, "zed-lite-interactions.json");
function ensureLogDir() {
    if (!fs_1.default.existsSync(logDir))
        fs_1.default.mkdirSync(logDir, { recursive: true });
}
function appendLogEntry(entry) {
    ensureLogDir();
    var logs = [];
    if (fs_1.default.existsSync(logFile)) {
        try {
            logs = JSON.parse(fs_1.default.readFileSync(logFile, "utf8"));
            if (!Array.isArray(logs))
                logs = [];
        }
        catch (_a) {
            logs = [];
        }
    }
    logs.push(entry);
    fs_1.default.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}
function updateLogFeedback(logId, feedback) {
    ensureLogDir();
    if (!fs_1.default.existsSync(logFile))
        return false;
    var logs = [];
    try {
        logs = JSON.parse(fs_1.default.readFileSync(logFile, "utf8"));
        if (!Array.isArray(logs))
            return false;
    }
    catch (_a) {
        return false;
    }
    var updated = false;
    logs = logs.map(function (entry) {
        if (entry.logId === logId) {
            updated = true;
            return __assign(__assign({}, entry), { feedback: feedback });
        }
        return entry;
    });
    if (updated)
        fs_1.default.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    return updated;
}
zedLiteRouter.post("/zed-lite", codesandboxCors, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, message, mode, logId, feedback, ok, history, text, err_1, entry;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body || {}, message = _a.message, mode = _a.mode, logId = _a.logId, feedback = _a.feedback;
                // Feedback update only
                if (!message && logId && feedback) {
                    ok = updateLogFeedback(logId, feedback);
                    if (ok) {
                        res.json({ ok: true });
                    }
                    else {
                        res.status(404).json({ error: "logId not found" });
                    }
                    return [2 /*return*/];
                }
                // Message-based reply
                if (!message) {
                    res.status(400).json({ error: "message required" });
                    return [2 /*return*/];
                }
                history = (0, chatContext_1.getHistory)(req);
                text = "";
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                if (!(mode === "agent")) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, agentOpenAIClient_1.agentChat)(message, history)];
            case 2:
                text = _b.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, ollamaClient_1.ollamaChat)(message, history)];
            case 4:
                text = _b.sent();
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                text = "[ZED LITE Error] Sorry, I couldn't process your request right now.";
                return [3 /*break*/, 7];
            case 7:
                (0, chatContext_1.appendMessage)(req, "user", message);
                (0, chatContext_1.appendMessage)(req, "assistant", text);
                entry = {
                    logId: logId || (0, uuid_1.v4)(),
                    user_message: message,
                    zed_response: text,
                    timestamp: new Date().toISOString(),
                    mode: mode || "chat"
                };
                appendLogEntry(entry);
                res.json({ text: text, logId: entry.logId });
                return [2 /*return*/];
        }
    });
}); });
exports.default = zedLiteRouter;
