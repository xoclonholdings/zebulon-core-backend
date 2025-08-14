"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCors = buildCors;
var cors_1 = require("cors");
function isAllowedOrigin(origin, explicit, allowNetlifyPreviews) {
    if (!origin)
        return true; // curl/Postman/server-to-server
    if (explicit.includes(origin))
        return true;
    if (allowNetlifyPreviews) {
        try {
            var u = new URL(origin);
            if (u.hostname.endsWith('.netlify.app'))
                return true; // allow Netlify previews/branch deploys
        }
        catch (_a) { }
    }
    return false;
}
function buildCors() {
    var explicit = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    var allowNetlifyPreviews = (process.env.CORS_ALLOW_NETLIFY_PREVIEWS || 'false').toLowerCase() === 'true';
    var options = {
        origin: function (origin, cb) {
            if (isAllowedOrigin(origin !== null && origin !== void 0 ? origin : undefined, explicit, allowNetlifyPreviews))
                return cb(null, true);
            return cb(new Error("CORS blocked for: ".concat(origin)));
        },
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204,
    };
    return (0, cors_1.default)(options);
}
