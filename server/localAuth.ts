import { Request, Response, NextFunction } from "express";
import session from "express-session";
import { storage } from "./storage";

// Default credentials - changeable through settings
let LOCAL_USERS = [
  {
    id: "user_001",
    username: "admin",
    password: "zed2025", // Changed to zed2025 as requested
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
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
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

export async function setupLocalAuth(app: any) {
  app.use(getLocalSession());

  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      // Find user in local users
      const user = LOCAL_USERS.find(u => u.username === username && u.password === password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create/update user in database
      await storage.upsertUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });

      // Set session
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
          profileImageUrl: user.profileImageUrl,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout endpoint  
  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
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

  // Attach user to request
  (req as any).user = {
    claims: {
      sub: session.userId
    }
  };

  next();
};