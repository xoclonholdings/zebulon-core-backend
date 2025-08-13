"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zedCoreData_1 = require("./zedCoreData");
const router = (0, express_1.Router)();
// POST /onboarding - set core data for Zed (user onboarding)
router.post("/onboarding", (req, res) => {
    const data = req.body;
    if (!data || typeof data !== "object") {
        res.status(400).json({ error: "Invalid onboarding data" });
        return;
    }
    (0, zedCoreData_1.setZedCoreData)(data);
    res.status(200).json({ ok: true });
    return;
});
exports.default = router;
