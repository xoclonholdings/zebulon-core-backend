"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryClient = void 0;
exports.useMemory = useMemory;
class MemoryClient {
    constructor(opts) {
        this.opts = opts;
    }
    async upsert(args) { return Promise.resolve(); }
    async query(args) { return Promise.resolve([]); }
    async list(args) { return Promise.resolve([]); }
    async pin(id) { return Promise.resolve(); }
    async unpin(id) { return Promise.resolve(); }
    async event(args) { return Promise.resolve(); }
    subscribe(entity, onMsg) { /* SSE */ return () => { }; }
}
exports.MemoryClient = MemoryClient;
const react_1 = require("react");
function useMemory(entity, opts) {
    const client = (0, react_1.useMemo)(() => new MemoryClient(opts), [opts.baseUrl]);
    const [items, setItems] = (0, react_1.useState)([]);
    const stopRef = (0, react_1.useRef)(() => { });
    (0, react_1.useEffect)(() => {
        stopRef.current = client.subscribe(entity, (msg) => {
            // merge updates
        });
        return () => stopRef.current?.();
    }, [entity]);
    return {
        client,
        items,
        remember: (p) => client.upsert({ entity, ...p }),
        recall: (p) => client.query({ entity, ...p }),
        pin: (id) => client.pin(id), unpin: (id) => client.unpin(id)
    };
}
