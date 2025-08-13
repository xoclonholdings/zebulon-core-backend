"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZedClient = void 0;
class ZedClient {
    constructor(opts) {
        this.opts = opts;
    }
    async ask(prompt, context) {
        const token = await this.opts.tokenProvider();
        const res = await fetch(`${this.opts.baseUrl}/api/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ prompt, context }),
        });
        if (!res.ok)
            throw new Error('Zed API unavailable');
        return res.json();
    }
    async summarize(text) {
        const token = await this.opts.tokenProvider();
        const res = await fetch(`${this.opts.baseUrl}/api/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        });
        if (!res.ok)
            throw new Error('Zed API unavailable');
        return res.json();
    }
    async suggestNextStep(ctx) {
        const token = await this.opts.tokenProvider();
        const res = await fetch(`${this.opts.baseUrl}/api/next-step`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ctx }),
        });
        if (!res.ok)
            throw new Error('Zed API unavailable');
        return res.json();
    }
}
exports.ZedClient = ZedClient;
