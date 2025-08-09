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
app.use(cors({
  origin: ["https://zed-ai.online", "http://localhost:5173"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));
app.options('*', cors());
// Health and status routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: 'zed-backend' });
});
app.get("/healthz", (req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: 'zed-backend' });
});
app.get("/status", (req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: 'zed-backend' });
});
app.get("/", (req: Request, res: Response) => {
  res.type('text/plain').send('zed-backend online');
});

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
      // Print all registered routes
      const routes: { method: string, path: string }[] = [];
      app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
          // routes registered directly on the app
          const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase());
          methods.forEach(method => routes.push({ method, path: middleware.route.path }));
        } else if (middleware.name === 'router' && middleware.handle.stack) {
          // router middleware
          middleware.handle.stack.forEach((handler: any) => {
            if (handler.route) {
              const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase());
              methods.forEach(method => routes.push({ method, path: handler.route.path }));
            }
          });
        }
      });
      log('Registered routes:');
      routes.forEach(r => log(`${r.method} ${r.path}`));
    });

    // --- Start simple chat server on port 3001 in production ---
    if (process.env.NODE_ENV === "production") {
      const express = await import("express");
      const simpleApp = express.default();
      simpleApp.use(express.json());
      simpleApp.get("/health", (req, res) => {
        res.json({ ok: true, service: "zed-backend", time: new Date().toISOString() });
      });
      simpleApp.get("/", (req, res) => {
        res.type("text/plain").send("zed-backend alive");
      });
      simpleApp.post("/api/chat", (req, res) => {
        const { message } = req.body;
        if (!message || typeof message !== "string") {
          return res.status(400).json({ error: "Missing or invalid 'message' in request body" });
        }
        if (!process.env.OPENAI_API_KEY) {
          return res.status(501).json({ error: "Model API key not set. Cannot process request." });
        }
        return res.json({ reply: "pong", ok: true });
      });
      simpleApp.listen(3001, HOST, () => {
        log(`🚀 Simple chat server listening on http://${HOST}:3001`);
      });
    }
    app.post("/api/ask", (req: Request, res: Response) => {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(200).json({ ok: true, error: 'No messages provided', service: 'zed-backend' });
      } else {
        return res.status(200).json({ ok: true, service: 'zed-backend', echo: messages });
      }
    });
    app.post("/api/chat", (req: Request, res: Response) => {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(200).json({ ok: true, error: 'No messages provided', service: 'zed-backend' });
      } else {
        return res.status(200).json({ ok: true, service: 'zed-backend', echo: messages });
      }
    });

  } catch (error) {
    log("❌ Failed to start server: " + String(error));
    process.exit(1);
  }
})();
