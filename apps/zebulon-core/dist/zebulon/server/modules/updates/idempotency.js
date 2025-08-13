"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndSet = checkAndSet;
const crypto_1 = require("./crypto");
const TTL = Number(process.env.UPDATE_IDEMPOTENCY_TTL_MS ?? 600000);
const store = new Map();
function checkAndSet(key) {
    const now = Date.now();
    // cleanup expired
    for (const [k, v] of store) {
        if (now - v.ts > TTL)
            store.delete(k);
    }
    const hashed = (0, crypto_1.sha256)(key);
    if (store.has(hashed))
        return false;
    store.set(hashed, { ts: now });
    return true;
}
