import { Request, Response, NextFunction } from "express";
import session from "express-session";
import { storage } from "./storage";

// Configurable users - can be easily modified
const LOCAL_USERS = [
  {
    id: "user_001",
    username: "admin",
    password: "admin123", // In production, use hashed passwords
    email: "admin@zed.local",
    firstName: "ZED",
    lastName: "Admin",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  },
  {
    id: "user_002", 
    username: "demo",
    password: "demo123",
    email: "demo@zed.local",
    firstName: "Demo",
    lastName: "User",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
  },
  {
    id: "user_003",
    username: "test",
    password: "test123", 
    email: "test@zed.local",
    firstName: "Test",
    lastName: "User",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=test"
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

  // Get available users (for login form)
  app.get("/api/auth/users", (req: Request, res: Response) => {
    const publicUsers = LOCAL_USERS.map(user => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl
    }));
    res.json(publicUsers);
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