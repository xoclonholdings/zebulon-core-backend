"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var jsonwebtoken_1 = require("jsonwebtoken");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
var body_parser_1 = require("body-parser");
app.use((0, body_parser_1.json)());
// JWT Auth middleware
app.use(function (req, res, next) {
    var auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
        return res.status(401).json({ error: 'Missing token' });
    try {
        var token = auth.replace('Bearer ', '');
        req.user = jsonwebtoken_1.default.verify(token, process.env.MEMORY_JWT_SECRET || 'change_me');
        next();
    }
    catch (_a) {
        res.status(401).json({ error: 'Invalid token' });
    }
});
// In-memory persistent core partition (for demo; replace with DB in prod)
var coreMemory = {};
// Get persistent core memory for current user
app.get('/api/memory/core', function (req, res) {
    var _a, _b, _c;
    var userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.username) || 'unknown';
    res.json({ items: coreMemory[userId] || [] });
});
// Add to persistent core memory for current user
app.post('/api/memory/core', function (req, res) {
    var _a, _b, _c;
    var userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.username) || 'unknown';
    var content = req.body.content;
    if (!content)
        return res.status(400).json({ error: 'Missing content' });
    if (!coreMemory[userId])
        coreMemory[userId] = [];
    coreMemory[userId].push({ content: content, created: Date.now() });
    res.json({ ok: true });
});
var port = process.env.PORT || 4001;
app.listen(port, function () { return console.log("Memory API running on port ".concat(port)); });
