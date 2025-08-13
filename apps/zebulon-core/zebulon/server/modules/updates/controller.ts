import { PrismaClient } from "@prisma/client";
import { UpdateRequest, UpdateResult } from "./types";
import { sha256 } from "./crypto";
import { bus } from "./bus";

const prisma = new PrismaClient();

export async function handleUpdate(req: UpdateRequest, userId?: string): Promise<UpdateResult> {
  const t0 = Date.now();
  const { tile, action, payload, dryRun = false } = req;

  // Simulate some tile-specific work and bus emits
  let summary = "";
  const events: Array<{topic: string; message: string}> = [];

  try {
    switch (`${tile}.${action}`) {
      case "zed.model.params.update":
        summary = `Model params updated (temp=${(payload as any).temp}, maxTokens=${(payload as any).maxTokens}, topk=${(payload as any).topk})`;
        if (!dryRun) {
          await prisma.memoryNote.upsert({
            where: { id: `zed.params.global` },
            update: { value: JSON.stringify(payload) },
            create: { id: `zed.params.global`, scope: "global", key: "zed.params", value: JSON.stringify(payload) }
          });
        }
        break;

      case "zed.rag.reindex":
        summary = `RAG reindexed ${Array.isArray((payload as any).docIds) ? (payload as any).docIds.length : 0} docs`;
        if (!dryRun) bus.emit("docs:changed", { count: (payload as any).docIds?.length ?? 0 });
        events.push({ topic: "docs:changed", message: "Docs updated; reindex in progress" });
        break;

      case "zeta.rules.update":
        summary = `Security rules updated (rateLimit=${(payload as any).rateLimit}, allowlist=${(payload as any).toolAllowlist?.length ?? 0})`;
        if (!dryRun) bus.emit("security:policyChanged", {});
        events.push({ topic: "security:policyChanged", message: "Security policy changed" });
        break;

      case "zlab.docs.sync":
        summary = `ZLab docs synced (${(payload as any).count})`;
        if (!dryRun) bus.emit("docs:changed", { count: (payload as any).count });
        events.push({ topic: "docs:changed", message: "ZLab synced docs" });
        break;

      case "zwap.wallets.refresh":
        summary = `ZWAP wallets refreshed (${(payload as any).addresses?.length ?? 0})`;
        if (!dryRun) bus.emit("finance:dataChanged", {});
        events.push({ topic: "finance:dataChanged", message: "Wallet balances updated" });
        break;

      case "zync.pipeline.test":
        summary = `ZYNC pipeline tests triggered (${(payload as any).suites?.length ?? 0})`;
        if (!dryRun) bus.emit("dev:e2eDone", { pass: 12, fail: 1 });
        events.push({ topic: "dev:e2eDone", message: "E2E tests finished" });
        break;

      case "zulu.health.snapshot":
        summary = `ZULU health snapshot (${(payload as any).depth})`;
        if (!dryRun) bus.emit("system:healthUpdated", { depth: (payload as any).depth });
        events.push({ topic: "system:healthUpdated", message: "System health updated" });
        break;

      default:
        return { ok: false, error: `Unknown tile.action: ${tile}.${action}` };
    }

    const latencyMs = Date.now() - t0;
    const payloadHash = sha256(JSON.stringify(payload));

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
  } catch (e: any) {
    const latencyMs = Date.now() - t0;
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          tile,
          action,
          idempotency: req.idempotencyKey,
          payloadHash: sha256(JSON.stringify(payload)),
          dryRun: !!dryRun,
          success: false,
          latencyMs,
          message: e?.message || "Update failed"
        }
      });
    } catch {}
    return { ok: false, error: e?.message || "Update failed" };
  }
}
