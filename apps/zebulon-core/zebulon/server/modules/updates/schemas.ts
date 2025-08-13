import Ajv from "ajv";
import addFormats from "ajv-formats";
export const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

// Base schema for envelope
export const updateEnvelopeSchema = {
  type: "object",
  required: ["tile", "action", "payload", "idempotencyKey"],
  additionalProperties: false,
  properties: {
    tile: { enum: ["zed", "zeta", "zlab", "zwap", "zync", "zulu"] },
    action: { type: "string", minLength: 1 },
    payload: { type: "object" },
    idempotencyKey: { type: "string", minLength: 16, maxLength: 128 },
    dryRun: { type: "boolean" }
  }
} as const;

// Per-tile/action schemas (expandable)
export const actionSchemas: Record<string, any> = {
  "zed.model.params.update": {
    type: "object",
    additionalProperties: false,
    properties: {
      temp: { type: "number", minimum: 0, maximum: 2 },
      maxTokens: { type: "integer", minimum: 128, maximum: 8192 },
      topk: { type: "integer", minimum: 1, maximum: 20 }
    },
    required: ["temp", "maxTokens", "topk"]
  },
  "zed.rag.reindex": {
    type: "object",
    additionalProperties: false,
    properties: { docIds: { type: "array", items: { type: "string" }, minItems: 1 } },
    required: ["docIds"]
  },
  "zeta.rules.update": {
    type: "object",
    additionalProperties: false,
    properties: {
      rateLimit: { type: "integer", minimum: 1 },
      toolAllowlist: { type: "array", items: { type: "string" } }
    },
    required: ["rateLimit", "toolAllowlist"]
  },
  "zlab.docs.sync": {
    type: "object",
    additionalProperties: false,
    properties: { count: { type: "integer", minimum: 0 } },
    required: ["count"]
  },
  "zwap.wallets.refresh": {
    type: "object",
    additionalProperties: false,
    properties: { addresses: { type: "array", items: { type: "string" } } },
    required: ["addresses"]
  },
  "zync.pipeline.test": {
    type: "object",
    additionalProperties: false,
    properties: { suites: { type: "array", items: { type: "string" }, minItems: 1 } },
    required: ["suites"]
  },
  "zulu.health.snapshot": {
    type: "object",
    additionalProperties: false,
    properties: { depth: { type: "string", enum: ["quick", "full"] } },
    required: ["depth"]
  }
};

export function validateAction(tile: string, action: string, payload: any) {
  const key = `${tile}.${action}`;
  const schema = actionSchemas[key];
  if (!schema) return { ok: false, error: `Unknown action schema: ${key}` as const };
  const validate = ajv.compile(schema);
  const valid = validate(payload);
  if (!valid) {
    const msg = validate.errors?.map(e => `${e.instancePath||"/"} ${e.message}`).join("; ");
    return { ok: false, error: `Payload validation failed: ${msg}` as const };
  }
  return { ok: true as const };
}
