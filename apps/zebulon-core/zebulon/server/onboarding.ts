import { Router } from "express";
import { setZedCoreData } from "./zedCoreData";

const router = Router();

// POST /onboarding - set core data for Zed (user onboarding)
router.post("/onboarding", (req, res) => {
  const data = req.body;
  if (!data || typeof data !== "object") {
    res.status(400).json({ error: "Invalid onboarding data" });
    return;
  }
  setZedCoreData(data);
  res.status(200).json({ ok: true });
  return;
});

export default router;
