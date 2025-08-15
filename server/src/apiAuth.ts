// Extend express-session types for user property
declare module 'express-session' {
	interface SessionData {
	}
}
import { Router } from "express";
import * as session from "express-session";
// import { setZedCoreData, getZedCoreData } from "../../apps/zebulon-core/zebulon/server/src/zedCoreData.js";

const router = Router();

// POST /api/login
router.post("/api/login", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({ error: "Username and password required" });
		return;
	}
	// Accept any username/password
	req.session.user = { username };
	// setZedCoreData({ userName: username });
	res.status(200).json({ ok: true, username });
	return;
});

// GET /api/user - return current user profile/core data
router.get("/api/user", (req, res) => {
	if (!req.session.user) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	const coreData = {}; // getZedCoreData stubbed
	res.status(200).json({ user: req.session.user, coreData });
	return;
});

export default router;
