import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { checkDatabaseConnection } from "./db";
import { runMigrations } from "./migrations";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Vite dev server or static build
import http from "http";

let server: http.Server;

if (process.env.NODE_ENV === "development") {
  server = http.createServer(app);
  setupVite(app, server);
} else {
  serveStatic(app);
}

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  log("Global error handler:", err);
  res.status(500).json({ error: "Internal server error" });
});

(async () => {
  try {
    await checkDatabaseConnection();
    await runMigrations();

    // Register all API routes
    const server = await registerRoutes(app);

    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    server.listen(PORT, () => {
      log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    log("❌ Failed to start server: " + String(error));
    process.exit(1);
  }
})();
