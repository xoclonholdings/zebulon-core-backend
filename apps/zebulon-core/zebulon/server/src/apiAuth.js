"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var zedCoreData_1 = require("./zedCoreData");
var router = (0, express_1.Router)();
// POST /api/login
router.post("/api/login", function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    if (!username || !password) {
        res.status(400).json({ error: "Username and password required" });
        return;
    }
    // Accept any username/password
    req.session.user = { username: username };
    (0, zedCoreData_1.setZedCoreData)({ userName: username });
    res.status(200).json({ ok: true, username: username });
    return;
});
// GET /api/user - return current user profile/core data
router.get("/api/user", function (req, res) {
    if (!req.session.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    var coreData = (0, zedCoreData_1.getZedCoreData)();
    res.status(200).json({ user: req.session.user, coreData: coreData });
    return;
});
exports.default = router;
