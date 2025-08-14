"use strict";
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
exports.adaptiveChat = adaptiveChat;
var openai_1 = require("openai");
var web_llm_1 = require("@mlc-ai/web-llm");
var CLOUD = "https://api.zebulonhub.xyz/v1";
var webllmInit = null;
function tryCloud(messages) {
    return __awaiter(this, void 0, void 0, function () {
        var client, r;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    client = new openai_1.default({ baseURL: CLOUD, apiKey: "sk-local" });
                    return [4 /*yield*/, client.chat.completions.create({ model: "gpt-4", messages: messages })];
                case 1:
                    r = _d.sent();
                    return [2 /*return*/, (_c = (_b = (_a = r.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : ""];
            }
        });
    });
}
function tryWebLLM(messages) {
    return __awaiter(this, void 0, void 0, function () {
        var engine, r;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!('gpu' in navigator))
                        throw new Error("WebGPU unavailable");
                    if (!webllmInit)
                        webllmInit = (0, web_llm_1.CreateMLCEngine)("Llama-3.1-8B-Instruct-q4f16_1", { gpuInference: true });
                    return [4 /*yield*/, webllmInit];
                case 1:
                    engine = _e.sent();
                    return [4 /*yield*/, engine.chat.completions.create({ messages: messages, stream: false })];
                case 2:
                    r = _e.sent();
                    return [2 /*return*/, (_d = (_c = (_b = (_a = r.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : ""];
            }
        });
    });
}
function adaptiveChat(messages) {
    return __awaiter(this, void 0, void 0, function () {
        var ac, t, _1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ac = new AbortController();
                    t = setTimeout(function () { return ac.abort(); }, 3000);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 9]);
                    return [4 /*yield*/, fetch(CLOUD.replace("/v1", "/readyz"), { signal: ac.signal })];
                case 2:
                    _a.sent();
                    clearTimeout(t);
                    return [4 /*yield*/, tryCloud(messages)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    _1 = _a.sent();
                    clearTimeout(t);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, tryWebLLM(messages)];
                case 6: return [2 /*return*/, _a.sent()];
                case 7:
                    e_1 = _a.sent();
                    throw new Error("No cloud and no WebGPU fallback available.");
                case 8: return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
