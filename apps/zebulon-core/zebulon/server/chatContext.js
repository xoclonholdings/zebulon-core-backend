"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionId = getSessionId;
exports.appendMessage = appendMessage;
exports.getHistory = getHistory;
exports.clearHistory = clearHistory;
var chatHistory = {};
function getSessionId(req) {
    // Use session ID if available, else fallback to IP
    // @ts-ignore
    return req.sessionID || req.ip;
}
function appendMessage(req, role, message) {
    var sessionId = getSessionId(req);
    if (!chatHistory[sessionId])
        chatHistory[sessionId] = [];
    chatHistory[sessionId].push({ role: role, message: message });
    // Limit history to last 20 messages
    if (chatHistory[sessionId].length > 20)
        chatHistory[sessionId].shift();
}
function getHistory(req) {
    var sessionId = getSessionId(req);
    return chatHistory[sessionId] || [];
}
function clearHistory(req) {
    var sessionId = getSessionId(req);
    delete chatHistory[sessionId];
}
