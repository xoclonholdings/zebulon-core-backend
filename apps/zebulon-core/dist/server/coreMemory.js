"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserMemory = getUserMemory;
exports.appendUserMemory = appendUserMemory;
exports.clearUserMemory = clearUserMemory;
exports.searchUserMemory = searchUserMemory;
const persistentMemory = {};
function getUserMemory(userId, opts) {
    let mem = persistentMemory[userId] || [];
    if (opts && typeof opts.tag === 'string')
        mem = mem.filter(e => e.tags && e.tags.includes(opts.tag));
    if (opts?.limit)
        mem = mem.slice(-opts.limit);
    return mem;
}
function appendUserMemory(userId, role, message, tags) {
    if (!persistentMemory[userId])
        persistentMemory[userId] = [];
    persistentMemory[userId].push({ role, message, tags, timestamp: new Date().toISOString() });
    if (persistentMemory[userId].length > 100)
        persistentMemory[userId].shift();
}
function clearUserMemory(userId) {
    delete persistentMemory[userId];
}
function searchUserMemory(userId, query) {
    const mem = persistentMemory[userId] || [];
    return mem.filter(e => e.message.toLowerCase().includes(query.toLowerCase()));
}
