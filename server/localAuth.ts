import { Request, Response, NextFunction } from "express";
import session from "express-session";
import { storage } from "./storage";

// Default credentials - changeable through settings
let LOCAL_USERS = [
  {
    id: "user_001",
    username: "Admin",
    password: "Zed2025",
    email: "admin@zed.local",
    firstName: "ZED",
    lastName: "Admin",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  }
];

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export function getLocalSession() {
  const sessionTtl = 45 * 60 * 1000; // 45 minutes for Admin security
  
  return session({
    secret: process.env.SESSION_SECRET || "zed-local-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

// Enhanced verification tracking
const VERIFICATION_ATTEMPTS = new Map<string, { count: number; lastAttempt: number; deviceFingerprint?: string }>();
const TRUSTED_DEVICES = new Map<string, { userId: string; verified: boolean; lastSeen: number }>();

function getDeviceFingerprint(req: Request): string {
  const userAgent = req.headers['user-agent'] || '';
  const acceptLanguage = req.headers['accept-language'] || '';
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const ip = req.ip || req.connection.remoteAddress || '';
  
  return Buffer.from(`${userAgent}:${acceptLanguage}:${acceptEncoding}:${ip}`).toString('base64').slice(0, 32);
}

function isDeviceTrusted(deviceFingerprint: string, userId: string): boolean {
  const device = TRUSTED_DEVICES.get(deviceFingerprint);
  return device?.userId === userId && device?.verified === true;
}

export async function setupLocalAuth(app: any) {
  app.use(getLocalSession());

  // Enhanced login endpoint with multi-factor verification
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password, securePhrase, requiresVerification } = req.body;
      const deviceFingerprint = getDeviceFingerprint(req);

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      // Track verification attempts
      const attemptKey = `${username}:${req.ip}`;
      const attempts = VERIFICATION_ATTEMPTS.get(attemptKey) || { count: 0, lastAttempt: 0 };
      
      // Check for repeated failed attempts
      if (attempts.count >= 3 && Date.now() - attempts.lastAttempt < 15 * 60 * 1000) {
        return res.status(429).json({ 
          error: "Too many failed attempts", 
          requiresChallenge: true,
          message: "Please wait 15 minutes or provide your secure phrase to bypass"
        });
      }

      // Find user in local users
      const user = LOCAL_USERS.find(u => u.username === username && u.password === password);
      
      if (!user) {
        // Increment failed attempts
        VERIFICATION_ATTEMPTS.set(attemptKey, {
          count: attempts.count + 1,
          lastAttempt: Date.now(),
          deviceFingerprint
        });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // For Admin user, check additional verification requirements
      if (user.username === 'Admin') {
        const deviceTrusted = isDeviceTrusted(deviceFingerprint, user.id);
        
        // Check if secondary verification is needed
        if (!deviceTrusted && !securePhrase && !requiresVerification) {
          return res.status(200).json({
            requiresSecondaryAuth: true,
            methods: ['secure_phrase', 'device_verification'],
            message: "Admin login from new device requires additional verification"
          });
        }
        
        // Verify secure phrase if provided
        if (securePhrase && securePhrase !== "XOCLON_SECURE_2025") {
          VERIFICATION_ATTEMPTS.set(attemptKey, {
            count: attempts.count + 1,
            lastAttempt: Date.now(),
            deviceFingerprint
          });
          return res.status(401).json({ error: "Invalid secure phrase" });
        }
        
        // If verification passed, mark device as trusted
        if (securePhrase === "XOCLON_SECURE_2025" || deviceTrusted) {
          TRUSTED_DEVICES.set(deviceFingerprint, {
            userId: user.id,
            verified: true,
            lastSeen: Date.now()
          });
        }
      }

      // Create/update user in database
      await storage.upsertUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });

      // Clear failed attempts on successful login
      VERIFICATION_ATTEMPTS.delete(attemptKey);

      // Set enhanced session with device tracking
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      };

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.username === 'Admin',
          sessionExpiry: 45 // minutes
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Enhanced logout with device cleanup
  app.post("/api/logout", (req: Request, res: Response) => {
    const session = req.session as any;
    if (session?.user?.deviceFingerprint) {
      // Optionally remove device from trusted list on explicit logout
      // TRUSTED_DEVICES.delete(session.user.deviceFingerprint);
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Admin verification challenge endpoint
  app.post("/api/admin/verify-challenge", async (req: Request, res: Response) => {
    try {
      const { challengeAnswer, securePhrase } = req.body;
      const deviceFingerprint = getDeviceFingerprint(req);
      
      // Simple logic challenge for demo (in production, use more sophisticated challenges)
      const validAnswers = ['42', 'xoclon', 'diagnostic'];
      const isValidChallenge = challengeAnswer && validAnswers.includes(challengeAnswer.toLowerCase());
      const isValidPhrase = securePhrase === "XOCLON_SECURE_2025";
      
      if (isValidChallenge || isValidPhrase) {
        // Clear all failed attempts for this IP
        const keys = Array.from(VERIFICATION_ATTEMPTS.keys()).filter(key => key.includes(req.ip || ''));
        keys.forEach(key => VERIFICATION_ATTEMPTS.delete(key));
        
        res.json({ success: true, message: "Challenge verified, please try logging in again" });
      } else {
        res.status(401).json({ error: "Invalid challenge response" });
      }
    } catch (error) {
      res.status(500).json({ error: "Challenge verification failed" });
    }
  });

  // Update credentials endpoint (protected)
  app.post("/api/auth/update-credentials", isAuthenticated, (req: Request, res: Response) => {
    try {
      const { newUsername, newPassword } = req.body;
      const session = req.session as any;
      
      if (!newUsername || !newPassword) {
        return res.status(400).json({ error: "Username and password required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Find and update the user
      const userIndex = LOCAL_USERS.findIndex(u => u.id === session.userId);
      if (userIndex !== -1) {
        LOCAL_USERS[userIndex].username = newUsername;
        LOCAL_USERS[userIndex].password = newPassword;
        
        // Update session
        session.user.username = newUsername;
        
        res.json({ 
          success: true, 
          message: "Credentials updated successfully",
          user: {
            username: newUsername,
            firstName: LOCAL_USERS[userIndex].firstName,
            lastName: LOCAL_USERS[userIndex].lastName
          }
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Update credentials error:", error);
      res.status(500).json({ error: "Failed to update credentials" });
    }
  });
  
  // Get current credentials (protected)
  app.get("/api/auth/current-credentials", isAuthenticated, (req: Request, res: Response) => {
    const session = req.session as any;
    const user = LOCAL_USERS.find(u => u.id === session.userId);
    
    if (user) {
      res.json({
        username: user.username,
        // Don't send password for security
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any;
  
  if (!session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check session expiry (45 minutes for Admin)
  if (session.lastActivity && Date.now() - session.lastActivity > 45 * 60 * 1000) {
    req.session.destroy(() => {});
    return res.status(401).json({ message: "Session expired" });
  }

  // Update last activity
  if (session.lastActivity) {
    session.lastActivity = Date.now();
  }

  // Enhanced device verification for Admin
  if (session.user?.isAdmin) {
    const currentFingerprint = getDeviceFingerprint(req);
    if (session.user.deviceFingerprint !== currentFingerprint) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Device verification failed" });
    }
  }

  // Attach user to request
  (req as any).user = {
    claims: {
      sub: session.userId,
      username: session.user?.username
    }
  };

  next();
};