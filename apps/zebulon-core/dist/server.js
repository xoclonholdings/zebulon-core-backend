"use strict";
// Zebulon Core main server entry
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// ...import core middleware and routes
const app = (0, express_1.default)();
// --- CORS configuration ---
const allowedOrigins = [
    'https://zebulonhub.xyz',
    'https://www.zebulonhub.xyz'
];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// --- Health check route (must be before auth middleware) ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
// --- Serve Zebulon UI from /apps/zebulon-core/zebulon/client ---
const path_1 = __importDefault(require("path"));
const clientPath = path_1.default.resolve(__dirname, 'zebulon', 'client');
const clientIndex = path_1.default.join(clientPath, 'index.html');
app.use(express_1.default.static(path_1.default.join(clientPath, 'public')));
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
const http_1 = __importDefault(require("http"));
const DEFAULT_PORT = parseInt(process.env.PORT || '3001', 10);
const MAX_PORT = DEFAULT_PORT + 20; // Try up to 20 ports
function startServer(port) {
    const server = http_1.default.createServer(app);
    server.listen(port);
    server.on('listening', () => {
        console.log('Zebulon Core server running on port', port);
        console.log('Allowed origins:', allowedOrigins);
        console.log('Core API base URL: /');
        console.log('Note: Use /chat, /memory, /ollama/* for core endpoints.');
        console.log('Frontend served from /apps/zebulon-core/zebulon/client');
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (port < MAX_PORT) {
                console.warn(`Port ${port} in use, trying port ${port + 1}...`);
                setTimeout(() => startServer(port + 1), 500);
            }
            else {
                console.error('No available ports found in range. Exiting.');
                process.exit(1);
            }
        }
        else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}
// --- Global error handler for pretty printing errors ---
app.use((err, req, res, next) => {
    console.error('--- ZEBULON ERROR ---');
    if (err.code === 'ENOENT') {
        console.error('File not found:', err.path);
    }
    console.error('Message:', err.message);
    if (err.stack)
        console.error('Stack:', err.stack);
    if (err.cause)
        console.error('Cause:', err.cause);
    console.error('--- END ERROR ---');
    res.status(500).json({ error: err.message, code: err.code, path: err.path });
});
startServer(DEFAULT_PORT);
