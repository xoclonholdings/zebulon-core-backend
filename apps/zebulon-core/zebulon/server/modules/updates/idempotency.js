"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndSet = checkAndSet;
var crypto_1 = require("./crypto");
var TTL = Number((_a = process.env.UPDATE_IDEMPOTENCY_TTL_MS) !== null && _a !== void 0 ? _a : 600000);
var store = new Map();
function checkAndSet(key) {
    var now = Date.now();
    // cleanup expired
    for (var _i = 0, store_1 = store; _i < store_1.length; _i++) {
        var _a = store_1[_i], k = _a[0], v = _a[1];
        if (now - v.ts > TTL)
            store.delete(k);
    }
    var hashed = (0, crypto_1.sha256)(key);
    if (store.has(hashed))
        return false;
    store.set(hashed, { ts: now });
    return true;
}
