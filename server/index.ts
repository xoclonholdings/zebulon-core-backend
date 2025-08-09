/**
 * ZED BACKEND ENTRYPOINT
 *
 * API BASE URL: /
 *
 * Guaranteed endpoints for frontend integration:
 *   - GET  /health   (returns 200 OK JSON or text)
 *   - POST /chat     (expects { message: string }, returns { reply: string })
 *
 * All environments (dev/prod) will always expose these endpoints at the root path.
 *
 * If you change the API base path, update this block and notify frontend developers.
 */
import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors, { type CorsOptions } from "cors";
import { corsAllowlist } from "./corsAllowlist";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { checkDatabaseConnection } from "./db";
import { runMigrations } from "./migrations";
import authRoutes from "./routes/auth";
import authMiddleware from "./middleware/auth";


const app = express();

// --- GUARANTEED ENDPOINTS FOR FRONTEND ---
app.get("/health", (_req: Request, res: Response) => {
  // Always return 200 for health checks
  res.status(200).json({ ok: true, service: "zed-backend", time: new Date().toISOString() });
});
app.post("/chat", (req: Request, res: Response) => {
  // Always echo the message for transport verification
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message required" });
  return res.status(200).json({ reply: `Zed says: ${message}` });
});



// CORS + CSP FIRST!
app.use(corsAllowlist);
app.get("/", (req: Request, res: Response) => {
  res.type("text/plain").send("zed-backend online");
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

// CORS configuration
const allowed = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow server-to-server and curl
    if (allowed.length === 0) return cb(null, true); // wide open if not configured
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(morgan('dev'));
app.use(cors(corsOptions));



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

    // Always use process.env.PORT || 3001 for HTTP
    let PORT: number;
    if (process.env.NODE_ENV === "production") {
      PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    } else {
      PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    }
    const HOST = "0.0.0.0";
    httpServer.listen(PORT, HOST, () => {
      log(`🚀 HTTP server listening on http://${HOST}:${PORT}`);
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

    // Only start HTTPS on 5001 if in production and certs are present
    if (process.env.NODE_ENV === "production" && process.env.SSL_KEY && process.env.SSL_CERT) {
      const https = await import("https");
      const fs = await import("fs");
      let key: string | Buffer = process.env.SSL_KEY;
      let cert: string | Buffer = process.env.SSL_CERT;
      // If values look like file paths, read them
      if (key.length < 100 && fs.existsSync(key)) key = fs.readFileSync(key);
      if (cert.length < 100 && fs.existsSync(cert)) cert = fs.readFileSync(cert);
      const httpsServer = https.createServer({ key, cert }, app);
      httpsServer.listen(5001, HOST, () => {
        log(`🚀 HTTPS server listening on https://${HOST}:5001`);
      });
    }




  } catch (error) {
    log("❌ Failed to start server: " + String(error));
    process.exit(1);
  }
})();
