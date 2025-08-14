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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZedTest;
// Removed: Non-Zebulon page
var react_1 = require("react");
var zed_1 = require("../services/zed");
function ZedTest() {
    var _a = (0, react_1.useState)(''), msg = _a[0], setMsg = _a[1];
    var _b = (0, react_1.useState)([]), log = _b[0], setLog = _b[1];
    var _c = (0, react_1.useState)(false), busy = _c[0], setBusy = _c[1];
    var _d = (0, react_1.useState)(null), err = _d[0], setErr = _d[1];
    function call(fn) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, reply_1, provider_1, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setBusy(true);
                        setErr(null);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, fn(msg)];
                    case 2:
                        _a = _b.sent(), reply_1 = _a.reply, provider_1 = _a.provider;
                        setLog(function (l) { return __spreadArray(["You: ".concat(msg), "Zed (".concat(provider_1 !== null && provider_1 !== void 0 ? provider_1 : 'unknown', "): ").concat(reply_1)], l, true); });
                        setMsg('');
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _b.sent();
                        setErr((e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || 'Request failed');
                        return [3 /*break*/, 5];
                    case 4:
                        setBusy(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return (<div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Zed Test</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={msg} onChange={function (e) { return setMsg(e.target.value); }} placeholder="Type a message…" style={{ flex: 1, padding: 10 }}/>
        <button onClick={function () { return call(zed_1.zedChat); }} disabled={!msg || busy}>{busy ? '…' : 'Chat'}</button>
        <button onClick={function () { return call(zed_1.zedAgent); }} disabled={!msg || busy}>{busy ? '…' : 'Agent'}</button>
      </div>
      {err && <div style={{ color: 'crimson', marginTop: 8 }}>{err}</div>}
      <ul style={{ marginTop: 16 }}>{log.map(function (x, i) { return <li key={i}>{x}</li>; })}</ul>
    </div>);
}
