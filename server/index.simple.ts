import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import { setupVite, serveStatic, log } from "./vite";
import authRoutes from "./routes/auth";

const app = express();

// CORS configuration
app.use(cors({
  origin: ["https://zed-ai.online", "http://localhost:5173"],
  methods: "GET,POST,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
}));
// Explicit health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use(express.json());
app.use(cookieParser());

// Session configuration
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

// Request logging middleware
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

// Authentication routes
app.use(authRoutes);

// Simple AI chat endpoint for testing
app.post("/api/ask", (req: Request, res: Response) => {
  const { message } = req.body;
  log(`Received message: ${message}`);
  
  // Simple mock response
  res.json({
    message: `ZED: I received your message "${message}". The server is working correctly!`,
    timestamp: new Date().toISOString(),
    source: "ZED_MOCK"
  });
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    server: "ZED AI Assistant"
  });
});

// Start server
(async () => {
  try {
    log("🔧 Starting simplified ZED server...");

    // Setup Vite for development or static serving for production
    if (process.env.NODE_ENV === "development") {
      await setupVite(app);
    } else {
      serveStatic(app);
    }

    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    const HOST = "0.0.0.0";
    app.listen(PORT, HOST, () => {
      log(`🚀 ZED AI Assistant server listening on http://${HOST}:${PORT}`);
      log("📝 Login credentials: Admin / Zed2025");
      log("🔒 Authentication endpoint ready at /api/login");
      log("💬 Chat endpoint ready at /api/ask");
    });

    // Ensure /api/chat returns JSON and does not crash if messages is missing
    app.post("/api/chat", (req: Request, res: Response) => {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.json({ message: "No messages provided", ok: true });
      }
      res.json({ message: "Chat endpoint working", ok: true });
    });

  } catch (error) {
    log("❌ Failed to start server: " + String(error));
    process.exit(1);
  }
})();
