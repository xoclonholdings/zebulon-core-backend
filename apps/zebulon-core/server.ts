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
import type { CorsOptions } from 'cors';
const corsOptions: CorsOptions = {
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
import { ZedAppRouter } from './apps/zed-backend';
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
    console.log('API base URL:', `/apps/zed`);
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

startServer(DEFAULT_PORT);
