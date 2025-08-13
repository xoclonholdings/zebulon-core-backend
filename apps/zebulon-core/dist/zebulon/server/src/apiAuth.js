"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zedCoreData_1 = require("./zedCoreData");
const router = (0, express_1.Router)();
// POST /api/login
router.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: "Username and password required" });
        return;
    }
    // Accept any username/password
    req.session.user = { username };
    (0, zedCoreData_1.setZedCoreData)({ userName: username });
    res.status(200).json({ ok: true, username });
    return;
});
// GET /api/user - return current user profile/core data
router.get("/api/user", (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const coreData = (0, zedCoreData_1.getZedCoreData)();
    res.status(200).json({ user: req.session.user, coreData });
    return;
});
exports.default = router;
