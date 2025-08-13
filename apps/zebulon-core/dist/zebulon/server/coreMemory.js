"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserMemory = getUserMemory;
exports.appendUserMemory = appendUserMemory;
// Persistent memory for logged-in users
const persistentMemory = {};
function getUserMemory(userId) {
    return persistentMemory[userId] || [];
}
function appendUserMemory(userId, role, message) {
    if (!persistentMemory[userId])
        persistentMemory[userId] = [];
    persistentMemory[userId].push({ role, message });
    if (persistentMemory[userId].length > 100)
        persistentMemory[userId].shift();
}
