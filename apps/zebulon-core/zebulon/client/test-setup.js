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
exports.waitForServers = waitForServers;
var http_1 = require("http");
function waitForServers() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var backendReady, i, viteReady, i;
        var _b = _a === void 0 ? {} : _a, _c = _b.vitePort, vitePort = _c === void 0 ? 5173 : _c, _d = _b.backendPort, backendPort = _d === void 0 ? 3001 : _d, _e = _b.backendHealthPath, backendHealthPath = _e === void 0 ? '/health' : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    backendReady = false;
                    i = 0;
                    _f.label = 1;
                case 1:
                    if (!(i < 30)) return [3 /*break*/, 5];
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var req = http_1.default.get("http://localhost:".concat(backendPort).concat(backendHealthPath), function (res) {
                                if (res.statusCode && res.statusCode < 400) {
                                    backendReady = true;
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            });
                            req.on('error', function () { return resolve(false); });
                            req.end();
                        })];
                case 2:
                    _f.sent();
                    if (backendReady)
                        return [3 /*break*/, 5];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                case 3:
                    _f.sent();
                    _f.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    if (!backendReady)
                        throw new Error("Backend server on port ".concat(backendPort, " did not start"));
                    viteReady = false;
                    i = 0;
                    _f.label = 6;
                case 6:
                    if (!(i < 30)) return [3 /*break*/, 10];
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var req = http_1.default.get("http://localhost:".concat(vitePort), function (res) {
                                if (res.statusCode && res.statusCode < 400) {
                                    viteReady = true;
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            });
                            req.on('error', function () { return resolve(false); });
                            req.end();
                        })];
                case 7:
                    _f.sent();
                    if (viteReady)
                        return [3 /*break*/, 10];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 6];
                case 10:
                    if (!viteReady)
                        throw new Error("Vite dev server on port ".concat(vitePort, " did not start"));
                    return [2 /*return*/];
            }
        });
    });
}
