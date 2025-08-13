import { ZedClient } from '@zebulon/zed-sdk';
export declare function zedLiteAsk(prompt: string, client: ZedClient, fallback: (prompt: string) => Promise<string>): Promise<any>;
