export declare function useZwap(getToken?: any): {
    balances: any;
    supply: any;
    swap: (p: {
        from: string;
        to: string;
        amount: string;
    }) => Promise<unknown>;
    redeem: (itemId: string) => Promise<unknown>;
};
