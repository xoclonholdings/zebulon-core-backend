"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bus = void 0;
var Bus = /** @class */ (function () {
    function Bus() {
        this.map = new Map();
    }
    Bus.prototype.on = function (topic, fn) {
        if (!this.map.has(topic))
            this.map.set(topic, new Set());
        this.map.get(topic).add(fn);
    };
    Bus.prototype.off = function (topic, fn) {
        var _a;
        (_a = this.map.get(topic)) === null || _a === void 0 ? void 0 : _a.delete(fn);
    };
    Bus.prototype.emit = function (topic, data) {
        var _a;
        (_a = this.map.get(topic)) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) { return fn(data); });
    };
    return Bus;
}());
exports.bus = new Bus();
// Cross-tile listeners
exports.bus.on("docs:changed", function (info) {
    // trigger ZED RAG reindex
    // zedRagReindex();
});
exports.bus.on("security:policyChanged", function () {
    // e.g., zedRefreshTools(); zuluQuickHealth();
});
exports.bus.on("finance:dataChanged", function () {
    // e.g., zedRefreshFinanceContext();
});
exports.bus.on("dev:e2eDone", function (summary) {
    // zuluAttachSummary(summary);
});
