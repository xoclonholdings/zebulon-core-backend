"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('[server] src/index.ts starting');
console.log('[server] NODE_ENV:', process.env.NODE_ENV);
console.log('[server] PORT:', process.env.PORT);
console.log('[server] CWD:', process.cwd());
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = require("./cors");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3001); // Railway injects PORT at runtime
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cors_1.buildCors)());
app.get('/health', (_req, res) => res.status(200).send('OK'));
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body || {};
        if (!message)
            return res.status(400).json({ error: 'message required' });
        // Replace with real handler later; echo proves transport works:
        return res.status(200).json({ reply: `Zed says: ${message}` });
    }
    catch (err) {
        console.error('Chat error:', err?.message || err);
        return res.status(500).json({ error: 'Internal error' });
    }
});
// (Optional) Explicit preflight; cors() already handles OPTIONS
app.options('*', (0, cors_1.buildCors)());
app.listen(PORT, () => {
    console.log(`[server] listening on :${PORT}`);
    if (process.env.PORT) {
        console.log(`[server] PORT from process.env.PORT: ${process.env.PORT}`);
    }
    else {
        console.log(`[server] PORT defaulted to 3001`);
    }
});
