"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dist_1 = require("zebulon-core-backend/apps/zebulon-core/zebulon/packages/ai/dist");
const router = (0, express_1.Router)();
// POST /chat
router.post('/chat', async (req, res) => {
    try {
        const { messages, options } = req.body;
        const ai = (0, dist_1.getAI)();
        const response = await ai.chat(messages, options);
        res.json({ response });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST /chat/stream (SSE)
router.post('/chat/stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    try {
        const { messages, options } = req.body;
        const ai = (0, dist_1.getAI)();
        await ai.chatStream(messages, { ...options, stream: true }, {
            onToken: (token) => res.write(`data: ${JSON.stringify(token)}\n\n`),
            onEnd: () => res.end(),
            onError: (err) => {
                res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`);
                res.end();
            },
        });
    }
    catch (err) {
        res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`);
        res.end();
    }
});
exports.default = router;
