import { Request, Response, NextFunction } from "express";
import { prisma, testDatabaseConnection } from './prisma';
import bcrypt from 'bcrypt';

// Types for authentication
interface LoginRequest {
  username: string;
  password: string;
}

interface AuthenticatedUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

// Authentication middleware using Prisma
export const prismaAuth = async (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any;
  if (!session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }
    (req as any).user = { claims: { sub: user.id, email: user.email } };
    next();
    return;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

// Login endpoint using Prisma
export const prismaLogin = async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginRequest = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
    const user = await prisma.user.findUnique({ where: { email: username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const validPassword = (username === 'admin@zed.local' && password === 'Zed2025') ||
                         (username === 'demo@zed.local' && password === 'demo123');
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (req.session) {
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }
    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return res.json({
      success: true,
      user: authenticatedUser
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

// Get current user endpoint
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const session = req.session as any;
    if (!session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        createdAt: true
      }
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Failed to get user" });
  }
};

// Setup function to initialize database connection and create default users
export async function setupPrismaAuth(app: any) {
  // Test database connection
  const connected = await testDatabaseConnection();
  if (!connected) {
    console.error("[PRISMA] Failed to connect to database");
    return false;
  }
  try {
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@zed.local' } });
    if (!adminUser) {
      await prisma.user.create({
        data: {
          id: 'admin_user_001',
          email: 'admin@zed.local',
          firstName: 'Admin',
          lastName: 'User',
        }
      });
      console.log('[PRISMA] Default admin user created');
    }
    const demoUser = await prisma.user.findUnique({ where: { email: 'demo@zed.local' } });
    if (!demoUser) {
      await prisma.user.create({
        data: {
          id: 'demo_user_001',
          email: 'demo@zed.local',
          firstName: 'Demo',
          lastName: 'User',
        }
      });
      console.log('[PRISMA] Demo user created');
    }
  } catch (error) {
    console.error('[PRISMA] Error creating default users:', error);
    // Still return true, as this is not fatal for boot
    return true;
  }
  // Setup auth routes
  app.post("/api/prisma/login", prismaLogin);
  app.get("/api/prisma/user", prismaAuth, getCurrentUser);
  return true;
}

export { prisma };