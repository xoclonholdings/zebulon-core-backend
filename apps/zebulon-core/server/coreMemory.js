"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserMemory = getUserMemory;
exports.appendUserMemory = appendUserMemory;
exports.clearUserMemory = clearUserMemory;
exports.searchUserMemory = searchUserMemory;
var persistentMemory = {};
function getUserMemory(userId, opts) {
    var mem = persistentMemory[userId] || [];
    if (opts && typeof opts.tag === 'string')
        mem = mem.filter(function (e) { return e.tags && e.tags.includes(opts.tag); });
    if (opts === null || opts === void 0 ? void 0 : opts.limit)
        mem = mem.slice(-opts.limit);
    return mem;
}
function appendUserMemory(userId, role, message, tags) {
    if (!persistentMemory[userId])
        persistentMemory[userId] = [];
    persistentMemory[userId].push({ role: role, message: message, tags: tags, timestamp: new Date().toISOString() });
    if (persistentMemory[userId].length > 100)
        persistentMemory[userId].shift();
}
function clearUserMemory(userId) {
    delete persistentMemory[userId];
}
function searchUserMemory(userId, query) {
    var mem = persistentMemory[userId] || [];
    return mem.filter(function (e) { return e.message.toLowerCase().includes(query.toLowerCase()); });
}
