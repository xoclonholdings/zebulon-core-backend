export type EntityRef = {
    kind: 'user' | 'org' | 'device' | 'app';
    id: string;
};
export type MemoryItem = {
    id: string;
    scope: string;
    key: string;
    value: any;
    tags?: string[];
    pinned?: boolean;
    createdAt: string;
    updatedAt: string;
};
export type MemoryClientOpts = {
    baseUrl: string;
    tokenProvider: () => Promise<string>;
};
export declare class MemoryClient {
    private opts;
    constructor(opts: MemoryClientOpts);
    upsert(args: {
        entity: EntityRef;
        scope: string;
        key: string;
        value: any;
        tags?: string[];
        ttl?: number;
    }): Promise<void>;
    query(args: {
        entity: EntityRef;
        scope?: string;
        key?: string;
        tags?: string[];
        text?: string;
        topK?: number;
    }): Promise<MemoryItem[]>;
    list(args: {
        entity: EntityRef;
        scope?: string;
        limit?: number;
    }): Promise<MemoryItem[]>;
    pin(id: string): Promise<void>;
    unpin(id: string): Promise<void>;
    event(args: {
        entity: EntityRef;
        app: string;
        type: string;
        payload: any;
    }): Promise<void>;
    subscribe(entity: EntityRef, onMsg: (m: MemoryItem | {
        event: string;
    }) => void): () => void;
}
export declare function useMemory(entity: EntityRef, opts: MemoryClientOpts): {
    client: any;
    items: any;
    remember: (p: {
        scope: string;
        key: string;
        value: any;
        tags?: string[];
        ttl?: number;
    }) => any;
    recall: (p: {
        scope?: string;
        key?: string;
        tags?: string[];
        text?: string;
        topK?: number;
    }) => any;
    pin: (id: string) => any;
    unpin: (id: string) => any;
};
