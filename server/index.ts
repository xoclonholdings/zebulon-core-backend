import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { checkDatabaseConnection } from "./db";
import { runMigrations } from "./migrations";
import authRoutes from "./routes/auth";
import authMiddleware from "./middleware/auth";

const app = express();

// CORS FIRST!
const allowedOrigins = [
  "https://zed-ai.online",
  "http://localhost:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5000"
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server, test scripts)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret_key_for_development",
  resave: false,
  saveUninitialized: false,
  name: "zed_session",
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Request timing + response capture
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    log(`[${req.method}] ${path} - ${res.statusCode} (${duration}ms)`);
    if (capturedJsonResponse) {
      log(`Response: ${JSON.stringify(capturedJsonResponse)}`);
    }
  });

  next();
});

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  log("Global error handler:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Use authentication routes and middleware
// app.use(authRoutes); // Disabled - using localAuth instead

// Example protected route
app.post("/api/conversations/:id/messages", authMiddleware, (req, res) => {
  // If authMiddleware passes, user is authenticated
  res.json({ message: "Message received." });
});

(async () => {
  try {
    // Try database connection, but don't fail if it's not available
    try {
      await checkDatabaseConnection();
      await runMigrations();
      log("✅ Database connected and migrations completed");
    } catch (dbError) {
      log("⚠️ Database connection failed - running in offline mode:", String(dbError));
      // Continue server startup without database
    }

    // Register all API routes FIRST before Vite setup
    const httpServer = await registerRoutes(app);

    // Setup Vite/static serving AFTER API routes
    if (process.env.NODE_ENV === "development") {
      await setupVite(app);
    } else {
      serveStatic(app);
    }

    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;
    const HOST = "0.0.0.0";
    httpServer.listen(PORT, HOST, () => {
      log(`🚀 Server listening on http://${HOST}:${PORT}`);
    });

    // Ensure /api/chat returns JSON
    app.post("/api/chat", (req: Request, res: Response) => {
      res.json({ message: "Chat endpoint working" });
    });

  } catch (error) {
    log("❌ Failed to start server: " + String(error));
    process.exit(1);
  }
})();
