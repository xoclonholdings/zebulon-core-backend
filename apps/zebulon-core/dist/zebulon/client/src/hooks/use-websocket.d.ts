import { WebSocketMessage } from '@/lib/types';
export declare function useWebSocket(): {
    isConnected: boolean;
    lastMessage: any;
    sendMessage: (message: WebSocketMessage) => void;
    addMessageHandler: (type: string, handler: (message: any) => void) => void;
    removeMessageHandler: (type: string) => void;
};
