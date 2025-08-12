// Zebulon Core main server entry

import express from 'express';
import cors from 'cors';
// ...import core middleware and routes


const app = express();

// --- CORS configuration ---
const allowedOrigins = [
  'https://zebulonhub.xyz',
  'https://www.zebulonhub.xyz'
];
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
// ...other core middleware


// --- Health check route (must be before auth middleware) ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});


// Mount Zed backend plugin
let ZedAppRouter;
try {
  // Use JS output if running from dist, else use TS for dev
  if (__dirname.endsWith('dist')) {
    ZedAppRouter = require('./apps/zed-backend/index.js').ZedAppRouter;
  } else {
    ZedAppRouter = require('./apps/zed-backend/index.ts').ZedAppRouter;
  }
} catch (e) {
  console.error('Failed to load ZedAppRouter:', e);
  process.exit(1);
}
const appsRouter = express.Router();
appsRouter.use('/zed', ZedAppRouter);
app.use('/apps', appsRouter);

// Temporary legacy redirect for old Zed routes
app.use('/zed', (req, res, next) => {
  console.warn('Deprecated: /zed/* route accessed. Redirecting to /apps/zed/*');
  res.redirect(301, `/apps/zed${req.url}`);
});



// --- Adaptable Port configuration ---
import http from 'http';
const DEFAULT_PORT = parseInt(process.env.PORT || '5000', 10);
const MAX_PORT = DEFAULT_PORT + 20; // Try up to 20 ports

function startServer(port: number) {
  const server = http.createServer(app);
  server.listen(port);
  server.on('listening', () => {
    console.log('Zebulon Core server running on port', port);
    console.log('Allowed origins:', allowedOrigins);
    console.log('Core API base URL: /');
    console.log('Zed plugin API base URL: /apps/zed');
    console.log('Note: Use /chat, /memory, /ollama/* for core endpoints. /apps/zed is for Zed plugin-specific routes.');
  });
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      if (port < MAX_PORT) {
        console.warn(`Port ${port} in use, trying port ${port + 1}...`);
        setTimeout(() => startServer(port + 1), 500);
      } else {
        console.error('No available ports found in range. Exiting.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}



// --- Global error handler for pretty printing errors ---
app.use((err: any, req: any, res: any, next: any) => {
  console.error('--- ZEBULON ERROR ---');
  if (err.code === 'ENOENT') {
    console.error('File not found:', err.path);
  }
  console.error('Message:', err.message);
  if (err.stack) console.error('Stack:', err.stack);
  if (err.cause) console.error('Cause:', err.cause);
  console.error('--- END ERROR ---');
  res.status(500).json({ error: err.message, code: err.code, path: err.path });
});

startServer(DEFAULT_PORT);
