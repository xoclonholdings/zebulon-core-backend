"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebSocket = useWebSocket;
const react_1 = require("react");
function useWebSocket() {
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [lastMessage, setLastMessage] = (0, react_1.useState)(null);
    const ws = (0, react_1.useRef)(null);
    const messageHandlers = (0, react_1.useRef)(new Map());
    const reconnectTimeout = (0, react_1.useRef)(null);
    const reconnectAttempts = (0, react_1.useRef)(0);
    const maxReconnectAttempts = 5;
    const connect = (0, react_1.useCallback)(() => {
        try {
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${protocol}//${window.location.host}/ws`;
            ws.current = new WebSocket(wsUrl);
            ws.current.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
            };
            ws.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    setLastMessage(message);
                    // Call specific handler if registered
                    const handler = messageHandlers.current.get(message.type);
                    if (handler) {
                        handler(message);
                    }
                }
                catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };
            ws.current.onclose = (event) => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
                // Attempt to reconnect unless manually closed
                if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
                    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
                    reconnectTimeout.current = setTimeout(() => {
                        connect();
                    }, delay);
                }
            };
            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }
        catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        connect();
        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (ws.current) {
                ws.current.close(1000); // Normal closure
            }
        };
    }, [connect]);
    const sendMessage = (0, react_1.useCallback)((message) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
        else {
            console.warn('WebSocket not connected');
        }
    }, []);
    const addMessageHandler = (0, react_1.useCallback)((type, handler) => {
        messageHandlers.current.set(type, handler);
    }, []);
    const removeMessageHandler = (0, react_1.useCallback)((type) => {
        messageHandlers.current.delete(type);
    }, []);
    return {
        isConnected,
        lastMessage,
        sendMessage,
        addMessageHandler,
        removeMessageHandler
    };
}
