"use strict";
// Simple Ollama API client for ZED backend
// Use native fetch (Node 18+)
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
exports.ollamaChat = ollamaChat;
exports.listOllamaModels = listOllamaModels;
exports.ollamaHealthCheck = ollamaHealthCheck;
exports.switchOllamaModel = switchOllamaModel;
var OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
// Enhanced Ollama chat: supports streaming, model selection, error handling, and context
function ollamaChat(prompt_1) {
    return __awaiter(this, arguments, void 0, function (prompt, history, model, opts) {
        var messages, body, res, errMsg, errData, _a, reader, full, decoder, _b, done, value, chunk, _i, _c, line, obj, token, data;
        var _d, _e, _f;
        if (history === void 0) { history = []; }
        if (model === void 0) { model = 'llama3'; }
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    messages = history.map(function (m) { return ({ role: m.role, content: m.message }); });
                    messages.push({ role: 'user', content: prompt });
                    body = {
                        model: model,
                        messages: messages,
                        stream: !!opts.stream
                    };
                    return [4 /*yield*/, fetch(OLLAMA_API_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body)
                        })];
                case 1:
                    res = _g.sent();
                    if (!!res.ok) return [3 /*break*/, 6];
                    errMsg = 'Ollama API error: ' + res.statusText;
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    errData = _g.sent();
                    if (errData && errData.error)
                        errMsg += " - ".concat(errData.error);
                    return [3 /*break*/, 5];
                case 4:
                    _a = _g.sent();
                    return [3 /*break*/, 5];
                case 5: throw new Error(errMsg);
                case 6:
                    if (!opts.stream) return [3 /*break*/, 10];
                    reader = (_d = res.body) === null || _d === void 0 ? void 0 : _d.getReader();
                    if (!reader)
                        throw new Error('No stream reader available');
                    full = '';
                    decoder = new TextDecoder();
                    _g.label = 7;
                case 7:
                    if (!true) return [3 /*break*/, 9];
                    return [4 /*yield*/, reader.read()];
                case 8:
                    _b = _g.sent(), done = _b.done, value = _b.value;
                    if (done)
                        return [3 /*break*/, 9];
                    chunk = decoder.decode(value, { stream: true });
                    // Ollama streams NDJSON: { message: { content: "..." } }
                    for (_i = 0, _c = chunk.split('\n'); _i < _c.length; _i++) {
                        line = _c[_i];
                        if (!line.trim())
                            continue;
                        try {
                            obj = JSON.parse(line);
                            token = ((_e = obj === null || obj === void 0 ? void 0 : obj.message) === null || _e === void 0 ? void 0 : _e.content) || '';
                            if (token) {
                                full += token;
                                if (opts.onToken)
                                    opts.onToken(token);
                            }
                        }
                        catch (_h) { }
                    }
                    return [3 /*break*/, 7];
                case 9: return [2 /*return*/, full];
                case 10: return [4 /*yield*/, res.json()];
                case 11:
                    data = _g.sent();
                    return [2 /*return*/, ((_f = data === null || data === void 0 ? void 0 : data.message) === null || _f === void 0 ? void 0 : _f.content) || ''];
            }
        });
    });
}
// List available models (calls /api/tags)
function listOllamaModels() {
    return __awaiter(this, void 0, void 0, function () {
        var url, res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = OLLAMA_API_URL.replace(/\/api\/generate$/, '/api/tags');
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error('Failed to list Ollama models: ' + res.statusText);
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_a.sent());
                    return [2 /*return*/, data.models || []];
            }
        });
    });
}
// Health check endpoint
function ollamaHealthCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var url, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = OLLAMA_API_URL.replace(/\/api\/generate$/, '/api/health');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        return [2 /*return*/, { ok: false, status: res.status }];
                    return [2 /*return*/, { ok: true }];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, { ok: false, error: e_1.message }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Switch model (no-op, placeholder for future logic)
function switchOllamaModel(model) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // No explicit switch endpoint; just use the model in chat calls
            return [2 /*return*/, { ok: true, model: model }];
        });
    });
}
