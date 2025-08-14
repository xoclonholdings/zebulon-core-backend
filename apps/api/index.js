"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Zebulon Core API entrypoint
var express_1 = require("express");
var app = (0, express_1.default)();
app.get('/health', function (req, res) {
    res.json({ status: 'ok', uptime: process.uptime() });
});
app.get('/version', function (req, res) {
    // TODO: Read from package.json and git sha
    res.json({ version: '0.1.0', git: null });
});
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log("Zebulon Core API running on port ".concat(PORT));
});
