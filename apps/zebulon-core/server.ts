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

// --- Health check route (must be before auth middleware) ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --- Serve Zebulon UI from /apps/zebulon-core/zebulon/client ---
import path from 'path';
const clientPath = path.resolve(__dirname, 'zebulon', 'client');
const clientIndex = path.join(clientPath, 'index.html');
app.use(express.static(path.join(clientPath, 'public')));
app.get('/', (_req, res) => {
  res.sendFile(clientIndex);
});
app.get('/index.html', (_req, res) => {
  res.sendFile(clientIndex);
});
// Fallback for client-side routing
// Catch-all route for client-side routing (only for non-API/non-health requests)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(clientIndex);
});

// --- Adaptable Port configuration ---
import http from 'http';
const DEFAULT_PORT = parseInt(process.env.PORT || '3001', 10);
const MAX_PORT = DEFAULT_PORT + 20; // Try up to 20 ports

function startServer(port: number) {
  const server = http.createServer(app);
  server.listen(port);
  server.on('listening', () => {
    console.log('Zebulon Core server running on port', port);
    console.log('Allowed origins:', allowedOrigins);
    console.log('Core API base URL: /');
    console.log('Note: Use /chat, /memory, /ollama/* for core endpoints.');
    console.log('Frontend served from /apps/zebulon-core/zebulon/client');
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
