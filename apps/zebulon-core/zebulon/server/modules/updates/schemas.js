"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionSchemas = exports.updateEnvelopeSchema = exports.ajv = void 0;
exports.validateAction = validateAction;
var ajv_1 = require("ajv");
var ajv_formats_1 = require("ajv-formats");
exports.ajv = new ajv_1.default({ allErrors: true, removeAdditional: true });
(0, ajv_formats_1.default)(exports.ajv);
// Base schema for envelope
exports.updateEnvelopeSchema = {
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
};
// Per-tile/action schemas (expandable)
exports.actionSchemas = {
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
function validateAction(tile, action, payload) {
    var _a;
    var key = "".concat(tile, ".").concat(action);
    var schema = exports.actionSchemas[key];
    if (!schema)
        return { ok: false, error: "Unknown action schema: ".concat(key) };
    var validate = exports.ajv.compile(schema);
    var valid = validate(payload);
    if (!valid) {
        var msg = (_a = validate.errors) === null || _a === void 0 ? void 0 : _a.map(function (e) { return "".concat(e.instancePath || "/", " ").concat(e.message); }).join("; ");
        return { ok: false, error: "Payload validation failed: ".concat(msg) };
    }
    return { ok: true };
}
