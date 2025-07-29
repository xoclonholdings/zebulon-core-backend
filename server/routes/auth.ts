import { Router, Request, Response } from "express";

const router = Router();

// Get current user endpoint for React app
router.get("/api/auth/user", (req: Request, res: Response) => {
  const session = req.session as any;
  
  // Check if user is authenticated using localAuth session structure
  if (session && session.user) {
    return res.json({ 
      user: {
        id: session.user.id || session.userId,
        username: session.user.username,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        isAdmin: session.user.username === 'Admin'
      },
      verified: session.verified || true // localAuth handles verification
    });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
});

router.post("/api/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  // Replace with your real user validation
  if (username === "Admin" && password === "Zed2025") {
    req.session.user = { username };
    req.session.verified = false; // Ensure verified is reset on login
    return res.json({ success: true, message: "Login successful" });
  }
  return res.status(401).json({ success: false, reason: "Invalid credentials" });
});

router.post("/api/verify", (req: Request, res: Response) => {
  const { username, method, phrase } = req.body;
  if (
    req.session.user &&
    username === "Admin" &&
    method === "secure_phrase" &&
    phrase === "XOCLON_SECURE_2025"
  ) {
    req.session.verified = true;
    return res.json({ success: true, message: "Secondary authentication passed" });
  }
  return res.status(401).json({ success: false, reason: "Secondary authentication failed" });
});

export default router;