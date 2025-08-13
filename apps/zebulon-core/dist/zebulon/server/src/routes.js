"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const chatContext_1 = require("./chatContext");
const coreMemory_1 = require("./coreMemory");
const onboarding_1 = __importDefault(require("./onboarding"));
const apiAuth_1 = __importDefault(require("./apiAuth"));
const ollamaClient_1 = require("./ollamaClient");
const agentOpenAIClient_1 = require("./agentOpenAIClient");
function registerRoutes(app) {
    // Register onboarding route
    app.use(onboarding_1.default);
    // Register authentication routes
    app.use(apiAuth_1.default);
    // Register the /chat endpoint
    app.post("/chat", async (req, res) => {
        const { message, mode } = req.body;
        if (!message) {
            return res.status(400).json({ error: "message required" });
        }
        // Determine if user is logged in
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
        let reply = "";
        try {
            if (mode === "agent") {
                // Agent Mode: Try OpenAI, fallback to Ollama agent model
                reply = await (0, agentOpenAIClient_1.agentChat)(message, history);
            }
            else {
                // Default: Use Ollama for chat
                reply = await (0, ollamaClient_1.ollamaChat)(message, history);
            }
        }
        catch (err) {
            reply = "[ZED AI Error] Sorry, I couldn't process your request right now.";
        }
        if (userId) {
            (0, coreMemory_1.appendUserMemory)(userId, "assistant", reply);
        }
        else {
            (0, chatContext_1.appendMessage)(req, "assistant", reply);
        }
        return res.status(200).json({ reply, history });
    });
    return app;
}
