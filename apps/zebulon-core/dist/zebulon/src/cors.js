"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCors = buildCors;
const cors_1 = __importDefault(require("cors"));
function isAllowedOrigin(origin, explicit, allowNetlifyPreviews) {
    if (!origin)
        return true; // curl/Postman/server-to-server
    if (explicit.includes(origin))
        return true;
    if (allowNetlifyPreviews) {
        try {
            const u = new URL(origin);
            if (u.hostname.endsWith('.netlify.app'))
                return true; // allow Netlify previews/branch deploys
        }
        catch { }
    }
    return false;
}
function buildCors() {
    const explicit = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    const allowNetlifyPreviews = (process.env.CORS_ALLOW_NETLIFY_PREVIEWS || 'false').toLowerCase() === 'true';
    const options = {
        origin: (origin, cb) => {
            if (isAllowedOrigin(origin ?? undefined, explicit, allowNetlifyPreviews))
                return cb(null, true);
            return cb(new Error(`CORS blocked for: ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204,
    };
    return (0, cors_1.default)(options);
}
