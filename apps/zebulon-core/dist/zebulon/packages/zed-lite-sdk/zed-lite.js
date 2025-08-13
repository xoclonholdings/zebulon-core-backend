"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zedLiteAsk = zedLiteAsk;
async function zedLiteAsk(prompt, client, fallback) {
    try {
        const res = await client.ask(prompt);
        return res.reply;
    }
    catch {
        // Fallback: direct OpenAI call or other local AI
        return fallback(prompt);
    }
}
