export declare function createRoom(): Promise<any>;
export declare function shareDoc(): Promise<any>;
export declare function useZLab(): {
    createRoom: typeof createRoom;
    shareDoc: typeof shareDoc;
};
