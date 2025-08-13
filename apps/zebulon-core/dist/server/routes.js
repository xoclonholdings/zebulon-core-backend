"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const zedLiteApi_1 = __importDefault(require("./zedLiteApi"));
const chatContext_1 = require("./chatContext");
const coreMemory_1 = require("./coreMemory");
const onboarding_1 = __importDefault(require("./onboarding"));
const apiAuth_1 = __importDefault(require("./apiAuth"));
const ollamaClient_1 = require("./ollamaClient");
const agentOpenAIClient_1 = require("./agentOpenAIClient");
function registerRoutes(app) {
    // Advanced memory management endpoints
    app.get('/memory', (req, res) => {
        const userId = req.session?.user?.username;
        if (!userId)
            return res.status(401).json({ error: 'Not authenticated' });
        const { tag, limit } = req.query;
        const mem = (0, coreMemory_1.getUserMemory)(userId, { tag: tag, limit: limit ? Number(limit) : undefined });
        res.json({ memory: mem });
    });
    app.get('/memory/search', (req, res) => {
        const userId = req.session?.user?.username;
        if (!userId)
            return res.status(401).json({ error: 'Not authenticated' });
        const { q } = req.query;
        if (!q)
            return res.status(400).json({ error: 'query required' });
        const results = (0, coreMemory_1.searchUserMemory)(userId, q);
        res.json({ results });
    });
    app.post('/memory/clear', (req, res) => {
        const userId = req.session?.user?.username;
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
    app.post("/chat", async (req, res) => {
        const { message, mode, model, stream } = req.body;
        if (!message) {
            return res.status(400).json({ error: "message required" });
        }
        const userId = req.session?.user?.username;
        let history;
        if (userId) {
            (0, coreMemory_1.appendUserMemory)(userId, "user", message);
            history = (0, coreMemory_1.getUserMemory)(userId);
        }
        else {
            (0, chatContext_1.appendMessage)(req, "user", message);
            history = (0, chatContext_1.getHistory)(req);
        }
        try {
            if (stream) {
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                let full = '';
                await (0, ollamaClient_1.ollamaChat)(message, history, model, {
                    stream: true,
                    onToken: (token) => {
                        full += token;
                        res.write(`data: ${JSON.stringify({ token })}\n\n`);
                    }
                });
                if (userId)
                    (0, coreMemory_1.appendUserMemory)(userId, "assistant", full);
                else
                    (0, chatContext_1.appendMessage)(req, "assistant", full);
                res.write(`data: ${JSON.stringify({ done: true, reply: full })}\n\n`);
                res.end();
            }
            else {
                let reply = "";
                if (mode === "agent") {
                    reply = await (0, agentOpenAIClient_1.agentChat)(message, history, model);
                }
                else {
                    reply = await (0, ollamaClient_1.ollamaChat)(message, history, model);
                }
                if (userId)
                    (0, coreMemory_1.appendUserMemory)(userId, "assistant", reply);
                else
                    (0, chatContext_1.appendMessage)(req, "assistant", reply);
                return res.status(200).json({ reply, history });
            }
        }
        catch (err) {
            const errorMsg = err?.message || '[ZED AI Error] Sorry, I couldn\'t process your request right now.';
            if (stream) {
                res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
                res.end();
            }
            else {
                return res.status(500).json({ error: errorMsg });
            }
        }
    });
    // List Ollama models
    app.get('/ollama/models', async (_req, res) => {
        try {
            const models = await (0, ollamaClient_1.listOllamaModels)();
            res.json({ models });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
    // Ollama health check
    app.get('/ollama/health', async (_req, res) => {
        const health = await (0, ollamaClient_1.ollamaHealthCheck)();
        res.json(health);
    });
    // Switch Ollama model (no-op, placeholder)
    app.post('/ollama/switch-model', async (req, res) => {
        const { model } = req.body;
        if (!model)
            return res.status(400).json({ error: 'model required' });
        const result = await (0, ollamaClient_1.switchOllamaModel)(model);
        res.json(result);
    });
    return app;
}
