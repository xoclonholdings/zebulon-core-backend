"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatWithFallback = useChatWithFallback;
const use_chat_1 = require("./use-chat");
const use_chat_mock_1 = require("./use-chat-mock");
const use_chat_minimal_1 = require("./use-chat-minimal");
function useChatWithFallback(conversationId) {
    const USE_MOCK_MODE = true; // Temporarily enable mock mode while fixing server
    const USE_MINIMAL_SERVER = false; // Use minimal server instead of full server
    const realChat = (0, use_chat_1.useChat)(conversationId);
    const mockChat = (0, use_chat_mock_1.useChatMock)();
    const minimalChat = (0, use_chat_minimal_1.useChatMinimal)();
    if (USE_MOCK_MODE) {
        return {
            sendMessage: mockChat.sendMessage,
            messages: mockChat.messages,
            isStreaming: mockChat.isLoading,
            streamingMessage: '',
            stopStreaming: () => { },
            clearMessages: mockChat.clearMessages,
            isMockMode: true,
        };
    }
    if (USE_MINIMAL_SERVER) {
        return {
            ...minimalChat,
            isMockMode: false,
            isMinimalMode: true,
        };
    }
    return {
        ...realChat,
        messages: [], // This would come from a query in real mode
        clearMessages: () => { },
        isMockMode: false,
    };
}
