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
exports.MemoryClient = void 0;
exports.useMemory = useMemory;
var MemoryClient = /** @class */ (function () {
    function MemoryClient(opts) {
        this.opts = opts;
    }
    MemoryClient.prototype.upsert = function (args) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve()];
        }); });
    };
    MemoryClient.prototype.query = function (args) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve([])];
        }); });
    };
    MemoryClient.prototype.list = function (args) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve([])];
        }); });
    };
    MemoryClient.prototype.pin = function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve()];
        }); });
    };
    MemoryClient.prototype.unpin = function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve()];
        }); });
    };
    MemoryClient.prototype.event = function (args) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve()];
        }); });
    };
    MemoryClient.prototype.subscribe = function (entity, onMsg) { /* SSE */ return function () { }; };
    return MemoryClient;
}());
exports.MemoryClient = MemoryClient;
var react_1 = require("react");
function useMemory(entity, opts) {
    var client = (0, react_1.useMemo)(function () { return new MemoryClient(opts); }, [opts.baseUrl]);
    var _a = (0, react_1.useState)([]), items = _a[0], setItems = _a[1];
    var stopRef = (0, react_1.useRef)(function () { });
    (0, react_1.useEffect)(function () {
        stopRef.current = client.subscribe(entity, function (msg) {
            // merge updates
        });
        return function () { var _a; return (_a = stopRef.current) === null || _a === void 0 ? void 0 : _a.call(stopRef); };
    }, [entity]);
    return {
        client: client,
        items: items,
        remember: function (p) { return client.upsert(__assign({ entity: entity }, p)); },
        recall: function (p) { return client.query(__assign({ entity: entity }, p)); },
        pin: function (id) { return client.pin(id); }, unpin: function (id) { return client.unpin(id); }
    };
}
