"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
class Api {
    constructor(base, getToken) {
        this.base = base;
        this.getToken = getToken;
    }
    async call(path, init = {}) {
        const token = this.getToken ? await this.getToken() : undefined;
        const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
        const res = await fetch(`${this.base}${path}`, { ...init, headers });
        if (!res.ok)
            throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
    }
    get(p) { return this.call(p); }
    post(p, body) { return this.call(p, { method: 'POST', body: JSON.stringify(body) }); }
}
exports.Api = Api;
