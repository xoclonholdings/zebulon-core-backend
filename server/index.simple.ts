import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import { setupVite, serveStatic, log } from "./vite";
import authRoutes from "./routes/auth";

const app = express();


// CORS configuration for production and dev
const allowedOrigins = [
  "https://zed-ai.online",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];
const netlifyPreviewRegex = /^https:\/\/[a-z0-9-]+\.netlify\.app$/;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || netlifyPreviewRegex.test(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));
app.options("*", cors());

// Force HTTPS in production except for health checks
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] === "http" &&
    !req.path.startsWith("/health") &&
    !req.path.startsWith("/api/health")
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Health and root routes (must be first)
app.get("/health", (req: Request, res: Response) => {
  res.json({ ok: true, service: "zed-backend", time: new Date().toISOString() });
});
app.get("/", (req: Request, res: Response) => {
  res.type("text/plain").send("zed-backend alive");
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


// POST /api/ask endpoint
app.post("/api/ask", (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'message' in request body" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(501).json({ error: "Model API key not set. Cannot process request." });
  }
  // Dummy response for now
  return res.json({ reply: "pong", ok: true });
});


// Health check endpoint (legacy)
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ ok: true, service: "zed-backend", time: new Date().toISOString() });
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

  // Always use 3001 for simple chat in production
  const PORT = process.env.NODE_ENV === "production" ? 3001 : (process.env.PORT ? parseInt(process.env.PORT) : 3001);
    const HOST = "0.0.0.0";
    app.listen(PORT, HOST, () => {
      log(`🚀 ZED AI Assistant server listening on http://${HOST}:${PORT}`);
      log("📝 Login credentials: Admin / Zed2025");
      log("🔒 Authentication endpoint ready at /api/login");
      log("💬 Chat endpoint ready at /api/ask");
    });


    // POST /api/chat endpoint
    app.post("/api/chat", (req: Request, res: Response) => {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'message' in request body" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(501).json({ error: "Model API key not set. Cannot process request." });
      }
      return res.json({ reply: "pong", ok: true });
    });

  } catch (error) {
    log("❌ Failed to start server: " + String(error));
    process.exit(1);
  }
})();
