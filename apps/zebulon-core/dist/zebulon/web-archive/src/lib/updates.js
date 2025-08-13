"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUpdate = sendUpdate;
async function sendUpdate(tile, action, payload, opts) {
    const idempotencyKey = crypto.randomUUID();
    const res = await fetch(`/api/${tile}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tile, action, payload, idempotencyKey, dryRun: !!opts?.dryRun })
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(data?.error || "Update failed");
    return data;
}
