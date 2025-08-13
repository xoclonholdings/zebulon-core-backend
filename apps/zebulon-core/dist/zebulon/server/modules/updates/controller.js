"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdate = handleUpdate;
const client_1 = require("@prisma/client");
const crypto_1 = require("./crypto");
const bus_1 = require("./bus");
const prisma = new client_1.PrismaClient();
async function handleUpdate(req, userId) {
    const t0 = Date.now();
    const { tile, action, payload, dryRun = false } = req;
    // Simulate some tile-specific work and bus emits
    let summary = "";
    const events = [];
    try {
        switch (`${tile}.${action}`) {
            case "zed.model.params.update":
                summary = `Model params updated (temp=${payload.temp}, maxTokens=${payload.maxTokens}, topk=${payload.topk})`;
                if (!dryRun) {
                    await prisma.memoryNote.upsert({
                        where: { id: `zed.params.global` },
                        update: { value: JSON.stringify(payload) },
                        create: { id: `zed.params.global`, scope: "global", key: "zed.params", value: JSON.stringify(payload) }
                    });
                }
                break;
            case "zed.rag.reindex":
                summary = `RAG reindexed ${Array.isArray(payload.docIds) ? payload.docIds.length : 0} docs`;
                if (!dryRun)
                    bus_1.bus.emit("docs:changed", { count: payload.docIds?.length ?? 0 });
                events.push({ topic: "docs:changed", message: "Docs updated; reindex in progress" });
                break;
            case "zeta.rules.update":
                summary = `Security rules updated (rateLimit=${payload.rateLimit}, allowlist=${payload.toolAllowlist?.length ?? 0})`;
                if (!dryRun)
                    bus_1.bus.emit("security:policyChanged", {});
                events.push({ topic: "security:policyChanged", message: "Security policy changed" });
                break;
            case "zlab.docs.sync":
                summary = `ZLab docs synced (${payload.count})`;
                if (!dryRun)
                    bus_1.bus.emit("docs:changed", { count: payload.count });
                events.push({ topic: "docs:changed", message: "ZLab synced docs" });
                break;
            case "zwap.wallets.refresh":
                summary = `ZWAP wallets refreshed (${payload.addresses?.length ?? 0})`;
                if (!dryRun)
                    bus_1.bus.emit("finance:dataChanged", {});
                events.push({ topic: "finance:dataChanged", message: "Wallet balances updated" });
                break;
            case "zync.pipeline.test":
                summary = `ZYNC pipeline tests triggered (${payload.suites?.length ?? 0})`;
                if (!dryRun)
                    bus_1.bus.emit("dev:e2eDone", { pass: 12, fail: 1 });
                events.push({ topic: "dev:e2eDone", message: "E2E tests finished" });
                break;
            case "zulu.health.snapshot":
                summary = `ZULU health snapshot (${payload.depth})`;
                if (!dryRun)
                    bus_1.bus.emit("system:healthUpdated", { depth: payload.depth });
                events.push({ topic: "system:healthUpdated", message: "System health updated" });
                break;
            default:
                return { ok: false, error: `Unknown tile.action: ${tile}.${action}` };
        }
        const latencyMs = Date.now() - t0;
        const payloadHash = (0, crypto_1.sha256)(JSON.stringify(payload));
        if (!dryRun) {
            await prisma.auditLog.create({
                data: {
                    userId,
                    tile,
                    action,
                    idempotency: req.idempotencyKey,
                    payloadHash,
                    dryRun: false,
                    success: true,
                    latencyMs,
                    diffSummary: summary,
                    message: summary
                }
            });
        }
        return {
            ok: true,
            summary,
            badge: { status: "ok", label: summary, at: new Date().toISOString() },
            events
        };
    }
    catch (e) {
        const latencyMs = Date.now() - t0;
        try {
            await prisma.auditLog.create({
                data: {
                    userId,
                    tile,
                    action,
                    idempotency: req.idempotencyKey,
                    payloadHash: (0, crypto_1.sha256)(JSON.stringify(payload)),
                    dryRun: !!dryRun,
                    success: false,
                    latencyMs,
                    message: e?.message || "Update failed"
                }
            });
        }
        catch { }
        return { ok: false, error: e?.message || "Update failed" };
    }
}
