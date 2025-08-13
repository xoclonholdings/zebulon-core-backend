import { Router } from "express";

const router = Router();

router.post("/api/verify", async (req, res) => {
  const { username, method, phrase } = req.body;

  // Example: Only allow secure_phrase for Admin
  if (
    username === "Admin" &&
    method === "secure_phrase" &&
    phrase === "XOCLON_SECURE_2025"
  ) {
    return res.json({ success: true, message: "Secondary authentication passed" });
  } else {
    return res.status(401).json({ error: "Secondary authentication failed" });
  }
});

export default router;