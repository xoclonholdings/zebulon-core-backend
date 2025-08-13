"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionId = getSessionId;
exports.appendMessage = appendMessage;
exports.getHistory = getHistory;
exports.clearHistory = clearHistory;
const chatHistory = {};
function getSessionId(req) {
    // Use session ID if available, else fallback to IP (not secure, demo only)
    // @ts-ignore
    return req.sessionID || req.ip;
}
function appendMessage(req, role, message) {
    const sessionId = getSessionId(req);
    if (!chatHistory[sessionId])
        chatHistory[sessionId] = [];
    chatHistory[sessionId].push({ role, message });
    // Limit history to last 20 messages
    if (chatHistory[sessionId].length > 20)
        chatHistory[sessionId].shift();
}
function getHistory(req) {
    const sessionId = getSessionId(req);
    return chatHistory[sessionId] || [];
}
function clearHistory(req) {
    const sessionId = getSessionId(req);
    delete chatHistory[sessionId];
}
