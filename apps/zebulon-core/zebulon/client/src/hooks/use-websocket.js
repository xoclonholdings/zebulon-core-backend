"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebSocket = useWebSocket;
var react_1 = require("react");
function useWebSocket() {
    var _a = (0, react_1.useState)(false), isConnected = _a[0], setIsConnected = _a[1];
    var _b = (0, react_1.useState)(null), lastMessage = _b[0], setLastMessage = _b[1];
    var ws = (0, react_1.useRef)(null);
    var messageHandlers = (0, react_1.useRef)(new Map());
    var reconnectTimeout = (0, react_1.useRef)(null);
    var reconnectAttempts = (0, react_1.useRef)(0);
    var maxReconnectAttempts = 5;
    var connect = (0, react_1.useCallback)(function () {
        try {
            var protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            var wsUrl = "".concat(protocol, "//").concat(window.location.host, "/ws");
            ws.current = new WebSocket(wsUrl);
            ws.current.onopen = function () {
                console.log('WebSocket connected');
                setIsConnected(true);
                reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
            };
            ws.current.onmessage = function (event) {
                try {
                    var message = JSON.parse(event.data);
                    setLastMessage(message);
                    // Call specific handler if registered
                    var handler = messageHandlers.current.get(message.type);
                    if (handler) {
                        handler(message);
                    }
                }
                catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };
            ws.current.onclose = function (event) {
                console.log('WebSocket disconnected');
                setIsConnected(false);
                // Attempt to reconnect unless manually closed
                if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    var delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
                    console.log("Attempting to reconnect in ".concat(delay, "ms (attempt ").concat(reconnectAttempts.current, "/").concat(maxReconnectAttempts, ")"));
                    reconnectTimeout.current = setTimeout(function () {
                        connect();
                    }, delay);
                }
            };
            ws.current.onerror = function (error) {
                console.error('WebSocket error:', error);
            };
        }
        catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
    }, []);
    (0, react_1.useEffect)(function () {
        connect();
        return function () {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (ws.current) {
                ws.current.close(1000); // Normal closure
            }
        };
    }, [connect]);
    var sendMessage = (0, react_1.useCallback)(function (message) {
        var _a;
        if (((_a = ws.current) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
        else {
            console.warn('WebSocket not connected');
        }
    }, []);
    var addMessageHandler = (0, react_1.useCallback)(function (type, handler) {
        messageHandlers.current.set(type, handler);
    }, []);
    var removeMessageHandler = (0, react_1.useCallback)(function (type) {
        messageHandlers.current.delete(type);
    }, []);
    return {
        isConnected: isConnected,
        lastMessage: lastMessage,
        sendMessage: sendMessage,
        addMessageHandler: addMessageHandler,
        removeMessageHandler: removeMessageHandler
    };
}
