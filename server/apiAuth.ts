// Extend express-session types for user property
declare module 'express-session' {
  interface SessionData {
    user?: { username: string };
  }
}
import { Router } from "express";
import session from "express-session";
import { setZedCoreData, getZedCoreData } from "./zedCoreData";

const router = Router();

// POST /api/login - simple demo login
router.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  // Demo: accept any username/password
  req.session.user = { username };
  setZedCoreData({ userName: username });
  res.status(200).json({ ok: true, username });
});

// GET /api/user - return current user profile/core data
router.get("/api/user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const coreData = getZedCoreData();
  res.status(200).json({ user: req.session.user, coreData });
});

export default router;
