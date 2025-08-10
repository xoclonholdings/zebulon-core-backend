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
  origin: function (origin, callback) {
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

// Mount Zed backend under /apps/zed
// (Placeholder import, update path after moving code)
// import zedBackend from './apps/zed-backend';
// app.use('/apps/zed', zedBackend);


// --- Port configuration ---
const PORT = process.env.PORT || 5000;

// --- Startup logging ---
app.listen(PORT, () => {
  console.log('Zebulon Core server running on port', PORT);
  console.log('Allowed origins:', allowedOrigins);
  console.log('API base URL:', `/apps/zed`);
});
