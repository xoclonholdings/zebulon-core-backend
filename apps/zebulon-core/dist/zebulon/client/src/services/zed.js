"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zedChat = zedChat;
exports.zedAgent = zedAgent;
const api_1 = require("../lib/api");
async function zedChat(message) {
    const res = await (0, api_1.api)('/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
    });
    return res.json();
}
async function zedAgent(message) {
    const res = await (0, api_1.api)('/agent', {
        method: 'POST',
        body: JSON.stringify({ message }),
    });
    return res.json();
}
