import { ZedClient } from './zed-client';
export declare function useZed(client: ZedClient): {
    messages: any;
    sendMessage: (content: string, context?: any) => Promise<void>;
    loading: any;
};
