import { Router, Request, Response } from "express";
import { updateEnvelopeSchema, validateAction } from "./schemas";
import { handleUpdate } from "./controller";
import { checkAndSet } from "./idempotency";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateEnvelope = ajv.compile(updateEnvelopeSchema);

export const updatesRouter = Router();

updatesRouter.post("/:tile/update", async (req: Request, res: Response) => {
  try {
    const tile = req.params.tile as string;
    const body = { ...req.body, tile };
    const ok = validateEnvelope(body);
    if (!ok) {
      const msg = validateEnvelope.errors?.map(e => `${e.instancePath||"/"} ${e.message}`).join("; ");
      return res.status(400).json({ error: `Invalid request: ${msg}` });
    }
    const { action, payload, idempotencyKey, dryRun } = body;

    const v = validateAction(tile, action, payload);
    if (!v.ok) return res.status(400).json({ error: v.error });

    if (!dryRun) {
      const fresh = checkAndSet(idempotencyKey);
      if (!fresh) return res.status(409).json({ error: "Duplicate idempotencyKey within TTL window" });
    }

    const userId = (req as any).user?.id ?? undefined; // optional
    const result = await handleUpdate({ tile: tile as any, action, payload, idempotencyKey, dryRun }, userId);

    if (!result.ok) return res.status(400).json(result);
    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

export default updatesRouter;
