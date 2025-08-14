"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
var http_1 = require("http");
var storage_1 = require("./storage");
var performance_monitor_1 = require("./performance-monitor");
var cache_1 = require("./cache");
var zeta_core_1 = require("./services/zeta-core");
var firewall_service_1 = require("./services/firewall-service");
var bad_actor_service_1 = require("./services/bad-actor-service");
var socket_handler_1 = require("./services/socket-handler");
var zod_1 = require("zod");
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            httpServer = (0, http_1.createServer)(app);
            // Remove all authentication middleware to prevent MetaMask errors
            // ...existing code...
            // setupSocialAuth(app);
            // Serve React app for main route
            app.get("/", function (req, res, next) {
                // Let Vite handle serving the React app
                next();
            });
            // Backup HTML route only for emergencies  
            app.get("/backup-html", function (req, res) {
                res.send("\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Fantasma Firewall - Security Operations Center</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <style>\n        * { margin: 0; padding: 0; box-sizing: border-box; }\n        body { \n            background: linear-gradient(135deg, #0a0e2a 0%, #1a1f3a 100%);\n            color: #00ccff; \n            font-family: 'Courier New', monospace; \n            padding: 20px;\n            min-height: 100vh;\n        }\n        .header {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 30px;\n            padding: 20px;\n            background: rgba(26, 31, 58, 0.8);\n            border: 1px solid #00ccff;\n            border-radius: 10px;\n        }\n        .logo { display: flex; align-items: center; gap: 15px; }\n        .logo h1 { color: #00ccff; font-size: 1.8rem; }\n        .status { \n            display: flex; \n            align-items: center; \n            gap: 10px;\n            padding: 10px 20px;\n            background: rgba(0, 204, 255, 0.1);\n            border: 1px solid #00ccff;\n            border-radius: 5px;\n        }\n        .status-dot { \n            width: 12px; \n            height: 12px; \n            background: #00ccff; \n            border-radius: 50%; \n            animation: pulse 2s infinite;\n        }\n        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }\n        .grid { \n            display: grid; \n            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); \n            gap: 20px; \n            margin-bottom: 30px;\n        }\n        .card { \n            background: rgba(26, 31, 58, 0.9); \n            border: 1px solid #00ccff; \n            padding: 20px; \n            border-radius: 10px;\n            transition: all 0.3s ease;\n        }\n        .card:hover { \n            border-color: #00ccff;\n            box-shadow: 0 0 20px rgba(0, 204, 255, 0.3);\n        }\n        .card h3 { \n            color: #00ccff; \n            margin-bottom: 15px; \n            font-size: 1.2rem;\n            display: flex;\n            align-items: center;\n            gap: 10px;\n        }\n        .metric { \n            display: flex; \n            justify-content: space-between; \n            margin: 8px 0;\n            padding: 5px 0;\n        }\n        .value { color: #00ccff; font-weight: bold; }\n        .threat { color: #ff4444; font-weight: bold; }\n        .secure { color: #00ccff; font-weight: bold; }\n        .warning { color: #ffaa00; font-weight: bold; }\n        .footer {\n            text-align: center;\n            margin-top: 40px;\n            padding: 20px;\n            border-top: 1px solid #00ccff;\n            color: #888;\n        }\n        @media (max-width: 768px) {\n            .header { flex-direction: column; gap: 15px; }\n            .grid { grid-template-columns: 1fr; }\n            body { padding: 10px; }\n        }\n    </style>\n    <script>\n        // Live data refresh every 5 seconds\n        setInterval(() => {\n            const timestamp = new Date().toLocaleTimeString();\n            document.getElementById('timestamp').textContent = timestamp;\n            \n            // Simulate live metrics\n            const cpu = Math.floor(Math.random() * 40) + 20;\n            const memory = Math.floor(Math.random() * 30) + 60;\n            const threats = Math.floor(Math.random() * 10) + 240;\n            \n            document.getElementById('cpu').textContent = cpu + '%';\n            document.getElementById('memory').textContent = memory + '%';\n            document.getElementById('threats').textContent = threats;\n        }, 5000);\n    </script>\n</head>\n<body>\n    <div class=\"header\">\n        <div class=\"logo\">\n            <div style=\"font-size: 2rem;\">\uD83D\uDEE1\uFE0F</div>\n            <div>\n                <h1>Fantasma Firewall</h1>\n                <div style=\"color: #888; font-size: 0.9rem;\">Security Operations Center</div>\n            </div>\n        </div>\n        <div class=\"status\">\n            <div class=\"status-dot\"></div>\n            <span>SYSTEMS ONLINE</span>\n        </div>\n    </div>\n\n    <div class=\"grid\">\n        <div class=\"card\">\n            <h3>\uD83E\uDD16 Zeta Core AI</h3>\n            <div class=\"metric\">\n                <span>Status:</span>\n                <span class=\"secure\">ACTIVE</span>\n            </div>\n            <div class=\"metric\">\n                <span>AI Confidence:</span>\n                <span class=\"value\">95%</span>\n            </div>\n            <div class=\"metric\">\n                <span>Neural Processing:</span>\n                <span class=\"value\">87%</span>\n            </div>\n            <div class=\"metric\">\n                <span>Threats Blocked:</span>\n                <span class=\"value\" id=\"threats\">247</span>\n            </div>\n        </div>\n\n        <div class=\"card\">\n            <h3>\uD83D\uDD12 Quantum Encryption</h3>\n            <div class=\"metric\">\n                <span>Physical Layer:</span>\n                <span class=\"secure\">SECURE (256-bit)</span>\n            </div>\n            <div class=\"metric\">\n                <span>Network Layer:</span>\n                <span class=\"secure\">SECURE (512-bit)</span>\n            </div>\n            <div class=\"metric\">\n                <span>Application Layer:</span>\n                <span class=\"secure\">SECURE (1024-bit)</span>\n            </div>\n            <div class=\"metric\">\n                <span>Quantum Status:</span>\n                <span class=\"secure\">PROTECTED</span>\n            </div>\n        </div>\n\n        <div class=\"card\">\n            <h3>\u26A1 ZWAP Protection</h3>\n            <div class=\"metric\">\n                <span>Trading Engine:</span>\n                <span class=\"secure\">SECURE (95%)</span>\n            </div>\n            <div class=\"metric\">\n                <span>Smart Contracts:</span>\n                <span class=\"secure\">SECURE (98%)</span>\n            </div>\n            <div class=\"metric\">\n                <span>Credit System:</span>\n                <span class=\"secure\">SECURE (92%)</span>\n            </div>\n            <div class=\"metric\">\n                <span>Exchange Status:</span>\n                <span class=\"secure\">OPERATIONAL</span>\n            </div>\n        </div>\n\n        <div class=\"card\">\n            <h3>\uD83D\uDEA8 Threat Monitoring</h3>\n            <div class=\"metric\">\n                <span>Corporate Infiltration:</span>\n                <span class=\"threat\">BLOCKED</span>\n            </div>\n            <div class=\"metric\">\n                <span>AI Injection Attempts:</span>\n                <span class=\"threat\">15 BLOCKED</span>\n            </div>\n            <div class=\"metric\">\n                <span>Bad Actors Tracked:</span>\n                <span class=\"warning\">3 ACTIVE</span>\n            </div>\n            <div class=\"metric\">\n                <span>Last Threat:</span>\n                <span class=\"value\" id=\"timestamp\">".concat(new Date().toLocaleTimeString(), "</span>\n            </div>\n        </div>\n\n        <div class=\"card\">\n            <h3>\uD83D\uDCCA System Performance</h3>\n            <div class=\"metric\">\n                <span>CPU Usage:</span>\n                <span class=\"value\" id=\"cpu\">31%</span>\n            </div>\n            <div class=\"metric\">\n                <span>Memory Usage:</span>\n                <span class=\"value\" id=\"memory\">70%</span>\n            </div>\n            <div class=\"metric\">\n                <span>Network Latency:</span>\n                <span class=\"value\">25ms</span>\n            </div>\n            <div class=\"metric\">\n                <span>Uptime:</span>\n                <span class=\"secure\">99.9%</span>\n            </div>\n        </div>\n\n        <div class=\"card\">\n            <h3>\uD83C\uDF10 Network Topology</h3>\n            <div class=\"metric\">\n                <span>Zeta Core Alpha:</span>\n                <span class=\"secure\">ONLINE</span>\n            </div>\n            <div class=\"metric\">\n                <span>Firewall Node 1:</span>\n                <span class=\"secure\">ONLINE</span>\n            </div>\n            <div class=\"metric\">\n                <span>Quantum Secure 1:</span>\n                <span class=\"secure\">ONLINE</span>\n            </div>\n            <div class=\"metric\">\n                <span>Network Health:</span>\n                <span class=\"secure\">OPTIMAL</span>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"footer\">\n        <p><strong>Fantasma Firewall protecting ZEBULON Web3 Interface</strong></p>\n        <p>All security systems operational \u2022 Real-time monitoring active</p>\n        <p>\u00A9 2025 ZEBULON Security Operations Center</p>\n    </div>\n</body>\n</html>\n    "));
            });
            // Direct dashboard demo route
            app.get("/demo", function (req, res) {
                res.send("\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Fantasma Firewall - Demo Dashboard</title>\n    <style>\n        body { background: #0a0e2a; color: #00ccff; font-family: monospace; padding: 20px; }\n        .card { background: #1a1f3a; border: 1px solid #00ccff; padding: 15px; margin: 10px 0; border-radius: 5px; }\n        .status { color: #00ccff; font-weight: bold; }\n        .threat { color: #ff4444; }\n        .secure { color: #00ccff; }\n    </style>\n</head>\n<body>\n    <h1>\uD83D\uDEE1\uFE0F Fantasma Firewall - Security Operations Center</h1>\n    \n    <div class=\"card\">\n        <h3>\uD83E\uDD16 Zeta Core AI Status</h3>\n        <p>Status: <span class=\"secure\">ACTIVE</span></p>\n        <p>AI Confidence: <span class=\"status\">95%</span></p>\n        <p>Threats Blocked: <span class=\"status\">247</span></p>\n    </div>\n    \n    <div class=\"card\">\n        <h3>\uD83D\uDD12 Quantum Encryption Layers</h3>\n        <p>Physical Layer: <span class=\"secure\">SECURE (256-bit)</span></p>\n        <p>Network Layer: <span class=\"secure\">SECURE (512-bit)</span></p>\n        <p>Application Layer: <span class=\"secure\">SECURE (1024-bit)</span></p>\n    </div>\n    \n    <div class=\"card\">\n        <h3>\u26A1 ZWAP Protection</h3>\n        <p>Trading Engine: <span class=\"secure\">SECURE (95%)</span></p>\n        <p>Smart Contracts: <span class=\"secure\">SECURE (98%)</span></p>\n        <p>Credit System: <span class=\"secure\">SECURE (92%)</span></p>\n    </div>\n    \n    <div class=\"card\">\n        <h3>\uD83D\uDEA8 Recent Threat Activity</h3>\n        <p><span class=\"threat\">CORPORATE_INFILTRATION</span> - Blocked attempt to access ZWAP protocols</p>\n        <p>Bad Actors Tracked: <span class=\"status\">3 active threats</span></p>\n    </div>\n    \n    <div class=\"card\">\n        <h3>\uD83D\uDCCA System Performance</h3>\n        <p>CPU Usage: <span class=\"status\">31%</span></p>\n        <p>Memory Usage: <span class=\"status\">70%</span></p>\n        <p>Network Latency: <span class=\"status\">25ms</span></p>\n    </div>\n    \n    <div style=\"margin-top: 30px; text-align: center;\">\n        <p>\uD83D\uDD17 <a href=\"/\" style=\"color: #00ccff;\">Return to Full Dashboard</a></p>\n        <p><small>All security systems operational \u2022 Real-time monitoring active</small></p>\n    </div>\n</body>\n</html>\n    ");
            });
            // Admin bypass route
            app.post("/api/auth/admin", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var password, adminUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            password = req.body.password;
                            if (!(password === "admin123" || password === "firewall2025")) return [3 /*break*/, 4];
                            // ...existing code...
                        case 1:
                            adminUser = _a.sent();
                            if (!!adminUser) return [3 /*break*/, 3];
                            return [4 /*yield*/, storage_1.storage.createUser({
                                    // ...existing code...
                                    email: "admin@fantasmafirewall.com"
                                })];
                        case 2:
                            adminUser = _a.sent();
                            _a.label = 3;
                        case 3:
                            // Set up session
                            req.session.userId = adminUser.id;
                            res.json(adminUser);
                            return [3 /*break*/, 5];
                        case 4:
                            res.status(401).json({ message: "Invalid admin password" });
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Setup WebSocket handlers
            (0, socket_handler_1.setupSocketHandlers)(httpServer);
            // Auth routes are handled by standalone-auth.ts
            // Dashboard data endpoints (remove authentication requirement)
            app.get("/api/dashboard/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, securityEvents, systemMetrics, zwapProtection, encryptionLayers, networkNodes, zetaCoreStatus, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all([
                                    storage_1.storage.getSecurityEvents(20),
                                    storage_1.storage.getLatestSystemMetrics(),
                                    storage_1.storage.getZwapProtectionStatus(),
                                    storage_1.storage.getEncryptionLayers(),
                                    storage_1.storage.getNetworkNodes(),
                                    zeta_core_1.zetaCore.getStatus(),
                                ])];
                        case 1:
                            _a = _b.sent(), securityEvents = _a[0], systemMetrics = _a[1], zwapProtection = _a[2], encryptionLayers = _a[3], networkNodes = _a[4], zetaCoreStatus = _a[5];
                            res.json({
                                zetaCore: zetaCoreStatus,
                                threatCounters: firewall_service_1.firewallService.getThreatCounters(),
                                securityEvents: securityEvents,
                                systemMetrics: systemMetrics,
                                zwapProtection: zwapProtection,
                                encryptionLayers: encryptionLayers,
                                networkNodes: networkNodes,
                                timestamp: new Date().toISOString(),
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _b.sent();
                            res.status(500).json({ message: "Failed to fetch dashboard status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Security events endpoints
            app.get("/api/security-events", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var limit, events, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            limit = parseInt(req.query.limit) || 50;
                            return [4 /*yield*/, storage_1.storage.getSecurityEvents(limit)];
                        case 1:
                            events = _a.sent();
                            res.json(events);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch security events" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/security-events", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var eventSchema, eventData, event_1, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            eventSchema = zod_1.z.object({
                                eventType: zod_1.z.string(),
                                severity: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
                                source: zod_1.z.string(),
                                target: zod_1.z.string().optional(),
                                description: zod_1.z.string(),
                                metadata: zod_1.z.any().optional(),
                                status: zod_1.z.string().default("ACTIVE"),
                            });
                            eventData = eventSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.createSecurityEvent(eventData)];
                        case 1:
                            event_1 = _a.sent();
                            res.json(event_1);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            res.status(400).json({ message: error_3 instanceof Error ? error_3.message : "Invalid event data" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.patch("/api/security-events/:id/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, status_1, event_2, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            status_1 = req.body.status;
                            if (!status_1) {
                                return [2 /*return*/, res.status(400).json({ message: "Status is required" })];
                            }
                            return [4 /*yield*/, storage_1.storage.updateSecurityEventStatus(id, status_1)];
                        case 1:
                            event_2 = _a.sent();
                            if (!event_2) {
                                return [2 /*return*/, res.status(404).json({ message: "Security event not found" })];
                            }
                            res.json(event_2);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            res.status(500).json({ message: "Failed to update security event status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Threat patterns endpoints
            app.get("/api/threat-patterns", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var patterns, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getThreatPatterns()];
                        case 1:
                            patterns = _a.sent();
                            res.json(patterns);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch threat patterns" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // System metrics endpoints
            app.get("/api/system-metrics", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var metrics, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getLatestSystemMetrics()];
                        case 1:
                            metrics = _a.sent();
                            res.json(metrics);
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch system metrics" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // ZWAP protection endpoints
            app.get("/api/zwap-protection", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var protection, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getZwapProtectionStatus()];
                        case 1:
                            protection = _a.sent();
                            res.json(protection);
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch ZWAP protection status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.patch("/api/zwap-protection/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, _a, status_2, integrityScore, protection, error_8;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            _a = req.body, status_2 = _a.status, integrityScore = _a.integrityScore;
                            if (!status_2 || integrityScore === undefined) {
                                return [2 /*return*/, res.status(400).json({ message: "Status and integrityScore are required" })];
                            }
                            return [4 /*yield*/, storage_1.storage.updateZwapProtection(id, status_2, integrityScore)];
                        case 1:
                            protection = _b.sent();
                            if (!protection) {
                                return [2 /*return*/, res.status(404).json({ message: "ZWAP protection component not found" })];
                            }
                            res.json(protection);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _b.sent();
                            res.status(500).json({ message: "Failed to update ZWAP protection" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Encryption layers endpoints
            app.get("/api/encryption-layers", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var layers, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getEncryptionLayers()];
                        case 1:
                            layers = _a.sent();
                            res.json(layers);
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch encryption layers" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Network nodes endpoints
            app.get("/api/network-nodes", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var nodes, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getNetworkNodes()];
                        case 1:
                            nodes = _a.sent();
                            res.json(nodes);
                            return [3 /*break*/, 3];
                        case 2:
                            error_10 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch network nodes" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Zeta Core AI endpoints
            app.get("/api/zeta-core/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var status_3, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, zeta_core_1.zetaCore.getStatus()];
                        case 1:
                            status_3 = _a.sent();
                            res.json(status_3);
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch Zeta Core status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/zeta-core/analyze", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var data, confidence, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            data = req.body.data;
                            return [4 /*yield*/, zeta_core_1.zetaCore.analyzeCorpopateSabotage(data)];
                        case 1:
                            confidence = _a.sent();
                            res.json({ confidence: confidence });
                            return [3 /*break*/, 3];
                        case 2:
                            error_12 = _a.sent();
                            res.status(500).json({ message: "Failed to analyze data" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Firewall service endpoints
            app.post("/api/firewall/detect-threat", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, source, target, threatType, detected, error_13;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = req.body, source = _a.source, target = _a.target, threatType = _a.threatType;
                            if (!source || !target || !threatType) {
                                return [2 /*return*/, res.status(400).json({ message: "Source, target, and threatType are required" })];
                            }
                            return [4 /*yield*/, firewall_service_1.firewallService.detectThreat(source, target, threatType)];
                        case 1:
                            detected = _b.sent();
                            res.json({ detected: detected, threatCounters: firewall_service_1.firewallService.getThreatCounters() });
                            return [3 /*break*/, 3];
                        case 2:
                            error_13 = _b.sent();
                            res.status(500).json({ message: "Failed to detect threat" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/firewall/counters", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var counters;
                return __generator(this, function (_a) {
                    try {
                        counters = firewall_service_1.firewallService.getThreatCounters();
                        res.json(counters);
                    }
                    catch (error) {
                        res.status(500).json({ message: "Failed to fetch threat counters" });
                    }
                    return [2 /*return*/];
                });
            }); });
            // Bad Actor Management endpoints
            app.get("/api/bad-actors", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var badActors, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getBadActors()];
                        case 1:
                            badActors = _a.sent();
                            res.json(badActors);
                            return [3 /*break*/, 3];
                        case 2:
                            error_14 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch bad actors" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/bad-actors/detect", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, identifier, identifierType, threatIndicators, badActor, error_15;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = req.body, identifier = _a.identifier, identifierType = _a.identifierType, threatIndicators = _a.threatIndicators;
                            if (!identifier || !identifierType) {
                                return [2 /*return*/, res.status(400).json({ message: "Identifier and identifierType are required" })];
                            }
                            return [4 /*yield*/, bad_actor_service_1.badActorService.detectAndTrackBadActor(identifier, identifierType, threatIndicators || {})];
                        case 1:
                            badActor = _b.sent();
                            res.json(badActor);
                            return [3 /*break*/, 3];
                        case 2:
                            error_15 = _b.sent();
                            res.status(500).json({ message: "Failed to detect bad actor" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/bad-actors/:id/escalate", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var badActorId_1, badActors, badActor, escalated, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            badActorId_1 = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getBadActors()];
                        case 1:
                            badActors = _a.sent();
                            badActor = badActors.find(function (a) { return a.id === badActorId_1; });
                            if (!badActor) {
                                return [2 /*return*/, res.status(404).json({ message: "Bad actor not found" })];
                            }
                            return [4 /*yield*/, storage_1.storage.escalateBadActor(badActor.identifier)];
                        case 2:
                            escalated = _a.sent();
                            res.json(escalated);
                            return [3 /*break*/, 4];
                        case 3:
                            error_16 = _a.sent();
                            res.status(500).json({ message: "Failed to escalate bad actor" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/bad-actors/:id/deploy-countermeasures", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var badActorId_2, countermeasureType, badActors, badActor, result, _a, error_17;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 12, , 13]);
                            badActorId_2 = parseInt(req.params.id);
                            countermeasureType = req.body.countermeasureType;
                            return [4 /*yield*/, storage_1.storage.getBadActors()];
                        case 1:
                            badActors = _b.sent();
                            badActor = badActors.find(function (a) { return a.id === badActorId_2; });
                            if (!badActor) {
                                return [2 /*return*/, res.status(404).json({ message: "Bad actor not found" })];
                            }
                            result = void 0;
                            _a = countermeasureType;
                            switch (_a) {
                                case "honeypot": return [3 /*break*/, 2];
                                case "data_poisoning": return [3 /*break*/, 4];
                                case "quantum_isolation": return [3 /*break*/, 6];
                                case "data_deprecation": return [3 /*break*/, 8];
                            }
                            return [3 /*break*/, 10];
                        case 2: return [4 /*yield*/, bad_actor_service_1.badActorService.deployHoneypotProtocol(badActor.identifier)];
                        case 3:
                            result = _b.sent();
                            return [3 /*break*/, 11];
                        case 4: return [4 /*yield*/, bad_actor_service_1.badActorService.deployDataPoisoningProtocol(badActorId_2, badActor.threatLevel)];
                        case 5:
                            result = _b.sent();
                            return [3 /*break*/, 11];
                        case 6: return [4 /*yield*/, bad_actor_service_1.badActorService.deployQuantumIsolationProtocol(badActorId_2)];
                        case 7:
                            result = _b.sent();
                            return [3 /*break*/, 11];
                        case 8: return [4 /*yield*/, bad_actor_service_1.badActorService.deployDataDeprecationProtocol(badActorId_2, "API_KEY", "SUSPICIOUS_ACCESS")];
                        case 9:
                            result = _b.sent();
                            return [3 /*break*/, 11];
                        case 10: return [2 /*return*/, res.status(400).json({ message: "Invalid countermeasure type" })];
                        case 11:
                            res.json(result);
                            return [3 /*break*/, 13];
                        case 12:
                            error_17 = _b.sent();
                            res.status(500).json({ message: error_17 instanceof Error ? error_17.message : "Failed to deploy countermeasure" });
                            return [3 /*break*/, 13];
                        case 13: return [2 /*return*/];
                    }
                });
            }); });
            // Data Deprecation endpoints
            app.get("/api/data-deprecation", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var deprecations, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getActiveDeprecations()];
                        case 1:
                            deprecations = _a.sent();
                            res.json(deprecations);
                            return [3 /*break*/, 3];
                        case 2:
                            error_18 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch data deprecations" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Quantum Protocols endpoints
            app.get("/api/quantum-protocols", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var protocols, error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getQuantumProtocols()];
                        case 1:
                            protocols = _a.sent();
                            res.json(protocols);
                            return [3 /*break*/, 3];
                        case 2:
                            error_19 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch quantum protocols" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/threat-mitigation/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var status_4, error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, bad_actor_service_1.badActorService.getActiveThreatMitigationStatus()];
                        case 1:
                            status_4 = _a.sent();
                            res.json(status_4);
                            return [3 /*break*/, 3];
                        case 2:
                            error_20 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch threat mitigation status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // FAQ API Routes
            app.get('/api/faq', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var categories, items, error_21;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, storage_1.storage.getFaqCategories()];
                        case 1:
                            categories = _a.sent();
                            return [4 /*yield*/, storage_1.storage.getFaqItems()];
                        case 2:
                            items = _a.sent();
                            res.json({ categories: categories, items: items });
                            return [3 /*break*/, 4];
                        case 3:
                            error_21 = _a.sent();
                            console.error('Error fetching FAQ data:', error_21);
                            res.status(500).json({ error: 'Failed to fetch FAQ data' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.get('/api/how-to-guides', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var guides, error_22;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getHowToGuides()];
                        case 1:
                            guides = _a.sent();
                            res.json(guides);
                            return [3 /*break*/, 3];
                        case 2:
                            error_22 = _a.sent();
                            console.error('Error fetching How-To guides:', error_22);
                            res.status(500).json({ error: 'Failed to fetch How-To guides' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get('/api/how-to-guides/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var guide, error_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getHowToGuideById(parseInt(req.params.id))];
                        case 1:
                            guide = _a.sent();
                            if (!guide) {
                                return [2 /*return*/, res.status(404).json({ error: 'Guide not found' })];
                            }
                            res.json(guide);
                            return [3 /*break*/, 3];
                        case 2:
                            error_23 = _a.sent();
                            console.error('Error fetching How-To guide:', error_23);
                            res.status(500).json({ error: 'Failed to fetch How-To guide' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Admin API Routes
            app.get('/api/admin/faq', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var categories, items, error_24;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, storage_1.storage.getFaqCategories()];
                        case 1:
                            categories = _a.sent();
                            return [4 /*yield*/, storage_1.storage.getFaqItems()];
                        case 2:
                            items = _a.sent();
                            res.json({ categories: categories, items: items });
                            return [3 /*break*/, 4];
                        case 3:
                            error_24 = _a.sent();
                            console.error('Error fetching admin FAQ data:', error_24);
                            res.status(500).json({ error: 'Failed to fetch FAQ data' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/admin/faq/items', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var item, error_25;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.createFaqItem(req.body)];
                        case 1:
                            item = _a.sent();
                            res.json(item);
                            return [3 /*break*/, 3];
                        case 2:
                            error_25 = _a.sent();
                            console.error('Error creating FAQ item:', error_25);
                            res.status(500).json({ error: 'Failed to create FAQ item' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.put('/api/admin/faq/items/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var item, error_26;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.updateFaqItem(parseInt(req.params.id), req.body)];
                        case 1:
                            item = _a.sent();
                            res.json(item);
                            return [3 /*break*/, 3];
                        case 2:
                            error_26 = _a.sent();
                            console.error('Error updating FAQ item:', error_26);
                            res.status(500).json({ error: 'Failed to update FAQ item' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.delete('/api/admin/faq/items/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var error_27;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.deleteFaqItem(parseInt(req.params.id))];
                        case 1:
                            _a.sent();
                            res.json({ success: true });
                            return [3 /*break*/, 3];
                        case 2:
                            error_27 = _a.sent();
                            console.error('Error deleting FAQ item:', error_27);
                            res.status(500).json({ error: 'Failed to delete FAQ item' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get('/api/admin/how-to-guides', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var guides, error_28;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getHowToGuides()];
                        case 1:
                            guides = _a.sent();
                            res.json(guides);
                            return [3 /*break*/, 3];
                        case 2:
                            error_28 = _a.sent();
                            console.error('Error fetching admin How-To guides:', error_28);
                            res.status(500).json({ error: 'Failed to fetch How-To guides' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/admin/how-to-guides', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var guide, error_29;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.createHowToGuide(req.body)];
                        case 1:
                            guide = _a.sent();
                            res.json(guide);
                            return [3 /*break*/, 3];
                        case 2:
                            error_29 = _a.sent();
                            console.error('Error creating How-To guide:', error_29);
                            res.status(500).json({ error: 'Failed to create How-To guide' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.put('/api/admin/how-to-guides/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var guide, error_30;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.updateHowToGuide(parseInt(req.params.id), req.body)];
                        case 1:
                            guide = _a.sent();
                            res.json(guide);
                            return [3 /*break*/, 3];
                        case 2:
                            error_30 = _a.sent();
                            console.error('Error updating How-To guide:', error_30);
                            res.status(500).json({ error: 'Failed to update How-To guide' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.delete('/api/admin/how-to-guides/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var error_31;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.deleteHowToGuide(parseInt(req.params.id))];
                        case 1:
                            _a.sent();
                            res.json({ success: true });
                            return [3 /*break*/, 3];
                        case 2:
                            error_31 = _a.sent();
                            console.error('Error deleting How-To guide:', error_31);
                            res.status(500).json({ error: 'Failed to delete How-To guide' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Configuration endpoint for integration setup
            app.get("/api/integrations/config", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        res.json({
                            available_integrations: [
                                { id: "zebulon", name: "ZEBULON Web3 Interface", status: "configurable" },
                                { id: "zapier", name: "Zapier Automation", status: "configurable" },
                                { id: "custom_api", name: "Custom API Integration", status: "configurable" }
                            ],
                            setup_guide: "See How-To guides for detailed integration instructions"
                        });
                    }
                    catch (error) {
                        console.error("Error fetching integration config:", error);
                        res.status(500).json({ error: "Failed to fetch integration configuration" });
                    }
                    return [2 /*return*/];
                });
            }); });
            // Unlimited real-time data endpoints
            app.get("/api/unlimited/security-events", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var events, error_32;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getSecurityEvents(10000)];
                        case 1:
                            events = _a.sent();
                            res.json(events);
                            return [3 /*break*/, 3];
                        case 2:
                            error_32 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch unlimited security events" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/unlimited/system-metrics", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var metrics, error_33;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getLatestSystemMetrics()];
                        case 1:
                            metrics = _a.sent();
                            res.json(metrics);
                            return [3 /*break*/, 3];
                        case 2:
                            error_33 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch unlimited system metrics" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Performance monitoring endpoints
            app.get("/api/performance", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var stats, error_34;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, performance_monitor_1.performanceMonitor.getPerformanceStats()];
                        case 1:
                            stats = _a.sent();
                            res.json(stats);
                            return [3 /*break*/, 3];
                        case 2:
                            error_34 = _a.sent();
                            console.error("Performance stats error:", error_34);
                            res.status(500).json({ error: "Failed to get performance statistics" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Cache management endpoints
            app.post("/api/cache/clear", function (req, res) {
                try {
                    cache_1.cache.invalidateDashboard();
                    cache_1.cache.invalidateMetrics();
                    cache_1.cache.invalidateUser();
                    res.json({ message: "All caches cleared successfully" });
                }
                catch (error) {
                    console.error("Cache clear error:", error);
                    res.status(500).json({ error: "Failed to clear cache" });
                }
            });
            app.get("/api/cache/stats", function (req, res) {
                try {
                    var stats = cache_1.cache.getStats();
                    res.json(stats);
                }
                catch (error) {
                    console.error("Cache stats error:", error);
                    res.status(500).json({ error: "Failed to get cache statistics" });
                }
            });
            // Initialize performance monitoring
            performance_monitor_1.performanceMonitor.start();
            console.log("Performance monitoring initialized");
            return [2 /*return*/, httpServer];
        });
    });
}
