"use strict";
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
exports.EventBusProvider = EventBusProvider;
exports.useEventBus = useEventBus;
var react_1 = require("react");
var Ctx = (0, react_1.createContext)(null);
function EventBusProvider(_a) {
    var children = _a.children;
    var feedRef = (0, react_1.useRef)([]);
    var subs = (0, react_1.useRef)(new Set());
    var api = (0, react_1.useMemo)(function () { return ({
        emit: function (e) {
            feedRef.current = __spreadArray([e], feedRef.current, true).slice(0, 20);
            subs.current.forEach(function (fn) { return fn(e); });
        },
        useFeed: function () {
            return feedRef.current;
        },
        subscribe: function (fn) {
            subs.current.add(fn);
            return function () { return subs.current.delete(fn); };
        }
    }); }, []);
    return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
function useEventBus() {
    var ctx = (0, react_1.useContext)(Ctx);
    if (!ctx)
        throw new Error("EventBus not found");
    return ctx;
}
