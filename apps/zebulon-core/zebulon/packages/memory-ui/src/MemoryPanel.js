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
exports.ZebulonCorePanel = ZebulonCorePanel;
/// <reference lib="dom" />
var react_1 = require("react");
var react_2 = require("react");
function ZebulonCorePanel(props) {
    var _this = this;
    var _a = (0, react_2.useState)([]), memories = _a[0], setMemories = _a[1];
    var _b = (0, react_2.useState)(''), input = _b[0], setInput = _b[1];
    var _c = (0, react_2.useState)('Checking connection...'), status = _c[0], setStatus = _c[1];
    var _d = (0, react_2.useState)(null), user = _d[0], setUser = _d[1];
    var _e = (0, react_2.useState)(false), loading = _e[0], setLoading = _e[1];
    (0, react_2.useEffect)(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var jwt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, props.clientOpts.tokenProvider()];
                    case 1:
                        jwt = _a.sent();
                        if (!jwt) {
                            setStatus('Not authenticated. Please log in.');
                            setUser(null);
                            setMemories([]);
                            return [2 /*return*/];
                        }
                        try {
                            setUser(JSON.parse(atob(jwt.split('.')[1])));
                        }
                        catch (_b) {
                            setUser(null);
                        }
                        setStatus('Connecting...');
                        fetch(props.clientOpts.baseUrl + '/core', {
                            headers: { 'Authorization': 'Bearer ' + jwt }
                        })
                            .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
                            .then(function (data) {
                            setStatus('Connected');
                            var d = data;
                            setMemories(Array.isArray(d.items) ? d.items : []);
                        })
                            .catch(function () {
                            setStatus('Unable to connect to Zebulon Core memory.');
                            setMemories([]);
                        });
                        return [2 /*return*/];
                }
            });
        }); })();
    }, [props.clientOpts.baseUrl]);
    var addMemory = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var jwt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!input.trim())
                        return [2 /*return*/];
                    setLoading(true);
                    return [4 /*yield*/, props.clientOpts.tokenProvider()];
                case 1:
                    jwt = _a.sent();
                    fetch(props.clientOpts.baseUrl + '/core', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + jwt, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: input.trim() })
                    })
                        .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
                        .then(function () {
                        setInput('');
                        setStatus('Memory added!');
                        // Refresh
                        fetch(props.clientOpts.baseUrl + '/core', {
                            headers: { 'Authorization': 'Bearer ' + jwt }
                        })
                            .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
                            .then(function (data) { return setMemories(Array.isArray(data.items) ? data.items : []); });
                    })
                        .catch(function () { return setStatus('Failed to add memory.'); })
                        .finally(function () { return setLoading(false); });
                    return [2 /*return*/];
            }
        });
    }); };
    var logout = function () {
        localStorage.removeItem('jwt');
        setUser(null);
        setMemories([]);
        setStatus('Logged out.');
    };
    return (<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#222', padding: 32, borderRadius: 12, minWidth: 400, color: '#fff', maxWidth: 480 }}>
        <h2 style={{ marginBottom: 16 }}>Zebulon Core — {props.appName}</h2>
        <div style={{ fontSize: 13, marginBottom: 8 }}>
          {user ? (<span style={{ color: '#3fdfff' }}>User: <b>{user.name || user.username || user.email || user.sub || 'Unknown'}</b></span>) : null}
        </div>
        <div style={{ marginBottom: 8, opacity: 0.8 }}>{status}</div>
        <div style={{ maxHeight: 120, overflow: 'auto', marginBottom: 8 }}>
          {memories.length ? memories.map(function (m, i) { return (<div key={i} style={{ padding: '4px 0', borderBottom: '1px solid #2323ff' }}>{m.content}</div>); }) : <span style={{ opacity: 0.6 }}>No persistent memory.</span>}
        </div>
        <form onSubmit={addMemory} style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          <input value={input} onChange={function (e) { return setInput(e.target.value); }} type="text" placeholder="Add memory..." style={{ flex: 1, padding: '4px 8px', borderRadius: 4, border: '1px solid #2323ff', background: '#23234a', color: '#fff' }}/>
          <button type="submit" style={{ background: '#3fdfff', color: '#181a2a', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 'bold' }} disabled={loading}>Add</button>
        </form>
        <button onClick={logout} style={{ width: '100%', background: '#2323ff', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 0', fontSize: 13 }}>Logout</button>
  <button style={{ marginTop: 16, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 0', width: '100%' }} onClick={function () { return typeof globalThis.window !== 'undefined' && globalThis.window.dispatchEvent(new CustomEvent('close-memory-panel')); }}>Close</button>
      </div>
    </div>);
}
