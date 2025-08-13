"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const chatContext_1 = require("./chatContext");
const ollamaClient_1 = require("./ollamaClient");
const agentOpenAIClient_1 = require("./agentOpenAIClient");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const zedLiteRouter = (0, express_1.Router)();
// CORS for CodeSandbox and zed-ai.online only for this route
const codesandboxCors = (0, cors_1.default)({
    origin: [/\.codesandbox\.io$/, "https://codesandbox.io", "https://zed-ai.online"],
    methods: ["GET", "POST", "OPTIONS"],
});
zedLiteRouter.options("/zed-lite", codesandboxCors);
// Persistent log file path
const logDir = path_1.default.join(__dirname, "..", "logs");
const logFile = path_1.default.join(logDir, "zed-lite-interactions.json");
function ensureLogDir() {
    if (!fs_1.default.existsSync(logDir))
        fs_1.default.mkdirSync(logDir, { recursive: true });
}
function appendLogEntry(entry) {
    ensureLogDir();
    let logs = [];
    if (fs_1.default.existsSync(logFile)) {
        try {
            logs = JSON.parse(fs_1.default.readFileSync(logFile, "utf8"));
            if (!Array.isArray(logs))
                logs = [];
        }
        catch {
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
    let logs = [];
    try {
        logs = JSON.parse(fs_1.default.readFileSync(logFile, "utf8"));
        if (!Array.isArray(logs))
            return false;
    }
    catch {
        return false;
    }
    let updated = false;
    logs = logs.map((entry) => {
        if (entry.logId === logId) {
            updated = true;
            return { ...entry, feedback };
        }
        return entry;
    });
    if (updated)
        fs_1.default.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    return updated;
}
zedLiteRouter.post("/zed-lite", codesandboxCors, async (req, res) => {
    const { message, mode, logId, feedback } = req.body || {};
    // Feedback update only
    if (!message && logId && feedback) {
        const ok = updateLogFeedback(logId, feedback);
        if (ok) {
            res.json({ ok: true });
        }
        else {
            res.status(404).json({ error: "logId not found" });
        }
        return;
    }
    // Message-based reply
    if (!message) {
        res.status(400).json({ error: "message required" });
        return;
    }
    let history = (0, chatContext_1.getHistory)(req);
    let text = "";
    try {
        if (mode === "agent") {
            text = await (0, agentOpenAIClient_1.agentChat)(message, history);
        }
        else {
            text = await (0, ollamaClient_1.ollamaChat)(message, history);
        }
    }
    catch (err) {
        text = "[ZED LITE Error] Sorry, I couldn't process your request right now.";
    }
    (0, chatContext_1.appendMessage)(req, "user", message);
    (0, chatContext_1.appendMessage)(req, "assistant", text);
    // Log interaction
    const entry = {
        logId: logId || (0, uuid_1.v4)(),
        user_message: message,
        zed_response: text,
        timestamp: new Date().toISOString(),
        mode: mode || "chat"
    };
    appendLogEntry(entry);
    res.json({ text, logId: entry.logId });
});
exports.default = zedLiteRouter;
