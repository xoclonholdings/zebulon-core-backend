"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bus = void 0;
class Bus {
    constructor() {
        this.map = new Map();
    }
    on(topic, fn) {
        if (!this.map.has(topic))
            this.map.set(topic, new Set());
        this.map.get(topic).add(fn);
    }
    off(topic, fn) {
        this.map.get(topic)?.delete(fn);
    }
    emit(topic, data) {
        this.map.get(topic)?.forEach(fn => fn(data));
    }
}
exports.bus = new Bus();
// Cross-tile listeners
exports.bus.on("docs:changed", (info) => {
    // trigger ZED RAG reindex
    // zedRagReindex();
});
exports.bus.on("security:policyChanged", () => {
    // e.g., zedRefreshTools(); zuluQuickHealth();
});
exports.bus.on("finance:dataChanged", () => {
    // e.g., zedRefreshFinanceContext();
});
exports.bus.on("dev:e2eDone", (summary) => {
    // zuluAttachSummary(summary);
});
