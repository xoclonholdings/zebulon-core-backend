export declare function getBalance(addr: string): Promise<number>;
export declare function swap(...args: any[]): Promise<any>;
export declare function redeemSupply(itemId: string): Promise<any>;
export declare function useZWAP(): {
    getBalance: typeof getBalance;
    swap: typeof swap;
    redeemSupply: typeof redeemSupply;
};
