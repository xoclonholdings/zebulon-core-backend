"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatesRouter = void 0;
var express_1 = require("express");
var schemas_1 = require("./schemas");
var controller_1 = require("./controller");
var idempotency_1 = require("./idempotency");
var ajv_1 = require("ajv");
var ajv_formats_1 = require("ajv-formats");
var ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
var validateEnvelope = ajv.compile(schemas_1.updateEnvelopeSchema);
exports.updatesRouter = (0, express_1.Router)();
exports.updatesRouter.post("/:tile/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tile, body, ok, msg, action, payload, idempotencyKey, dryRun, v, fresh, userId, result, e_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                tile = req.params.tile;
                body = __assign(__assign({}, req.body), { tile: tile });
                ok = validateEnvelope(body);
                if (!ok) {
                    msg = (_a = validateEnvelope.errors) === null || _a === void 0 ? void 0 : _a.map(function (e) { return "".concat(e.instancePath || "/", " ").concat(e.message); }).join("; ");
                    return [2 /*return*/, res.status(400).json({ error: "Invalid request: ".concat(msg) })];
                }
                action = body.action, payload = body.payload, idempotencyKey = body.idempotencyKey, dryRun = body.dryRun;
                v = (0, schemas_1.validateAction)(tile, action, payload);
                if (!v.ok)
                    return [2 /*return*/, res.status(400).json({ error: v.error })];
                if (!dryRun) {
                    fresh = (0, idempotency_1.checkAndSet)(idempotencyKey);
                    if (!fresh)
                        return [2 /*return*/, res.status(409).json({ error: "Duplicate idempotencyKey within TTL window" })];
                }
                userId = (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : undefined;
                return [4 /*yield*/, (0, controller_1.handleUpdate)({ tile: tile, action: action, payload: payload, idempotencyKey: idempotencyKey, dryRun: dryRun }, userId)];
            case 1:
                result = _d.sent();
                if (!result.ok)
                    return [2 /*return*/, res.status(400).json(result)];
                return [2 /*return*/, res.json(result)];
            case 2:
                e_1 = _d.sent();
                return [2 /*return*/, res.status(500).json({ error: (e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || "Server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = exports.updatesRouter;
