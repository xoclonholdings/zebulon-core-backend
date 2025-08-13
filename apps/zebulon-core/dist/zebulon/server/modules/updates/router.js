"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatesRouter = void 0;
const express_1 = require("express");
const schemas_1 = require("./schemas");
const controller_1 = require("./controller");
const idempotency_1 = require("./idempotency");
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
const validateEnvelope = ajv.compile(schemas_1.updateEnvelopeSchema);
exports.updatesRouter = (0, express_1.Router)();
exports.updatesRouter.post("/:tile/update", async (req, res) => {
    try {
        const tile = req.params.tile;
        const body = { ...req.body, tile };
        const ok = validateEnvelope(body);
        if (!ok) {
            const msg = validateEnvelope.errors?.map(e => `${e.instancePath || "/"} ${e.message}`).join("; ");
            return res.status(400).json({ error: `Invalid request: ${msg}` });
        }
        const { action, payload, idempotencyKey, dryRun } = body;
        const v = (0, schemas_1.validateAction)(tile, action, payload);
        if (!v.ok)
            return res.status(400).json({ error: v.error });
        if (!dryRun) {
            const fresh = (0, idempotency_1.checkAndSet)(idempotencyKey);
            if (!fresh)
                return res.status(409).json({ error: "Duplicate idempotencyKey within TTL window" });
        }
        const userId = req.user?.id ?? undefined; // optional
        const result = await (0, controller_1.handleUpdate)({ tile: tile, action, payload, idempotencyKey, dryRun }, userId);
        if (!result.ok)
            return res.status(400).json(result);
        return res.json(result);
    }
    catch (e) {
        return res.status(500).json({ error: e?.message || "Server error" });
    }
});
exports.default = exports.updatesRouter;
