type Listener = (data: any) => void;

class Bus {
  private map = new Map<string, Set<Listener>>();
  on(topic: string, fn: Listener) {
    if (!this.map.has(topic)) this.map.set(topic, new Set());
    this.map.get(topic)!.add(fn);
  }
  off(topic: string, fn: Listener) {
    this.map.get(topic)?.delete(fn);
  }
  emit(topic: string, data: any) {
    this.map.get(topic)?.forEach(fn => fn(data));
  }
}

export const bus = new Bus();

// Cross-tile listeners
bus.on("docs:changed", (info) => {
  // trigger ZED RAG reindex
  // zedRagReindex();
});

bus.on("security:policyChanged", () => {
  // e.g., zedRefreshTools(); zuluQuickHealth();
});

bus.on("finance:dataChanged", () => {
  // e.g., zedRefreshFinanceContext();
});

bus.on("dev:e2eDone", (summary) => {
  // zuluAttachSummary(summary);
});
