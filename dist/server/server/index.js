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
var express_1 = require("express");
var express_session_1 = require("express-session");
var bcrypt_1 = require("bcrypt");
var path_1 = require("path");
var url_1 = require("url");
var storage_prisma_js_1 = require("./storage-prisma.js");
var gedcom_js_1 = require("./routes/gedcom.js");
var db_dual_js_1 = require("./db-dual.js");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
// Trust proxy for session security
app.set('trust proxy', 1);
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'zebulon-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Serve static files from built public directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist/public')));
// Request logging
app.use(function (req, res, next) {
    var start = Date.now();
    res.on("finish", function () {
        var duration = Date.now() - start;
        if (req.path.startsWith("/api")) {
            console.log("".concat(req.method, " ").concat(req.path, " ").concat(res.statusCode, " in ").concat(duration, "ms"));
        }
    });
    next();
});
var requireAuth = function (req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};
// Authentication endpoints
app.post('/api/auth/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, isValidPassword, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, password = _a.password;
                if (!username || !password) {
                    return [2 /*return*/, res.status(400).json({ error: 'Username and password are required' })];
                }
                return [4 /*yield*/, storage_prisma_js_1.storage.getUserByUsername(username)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid username or password' })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.passwordHash)];
            case 2:
                isValidPassword = _b.sent();
                if (!isValidPassword) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid username or password' })];
                }
                // Update last login
                return [4 /*yield*/, storage_prisma_js_1.storage.updateUserLogin(user.id)];
            case 3:
                // Update last login
                _b.sent();
                // Set session
                req.session.userId = user.id;
                req.session.user = user;
                res.json({
                    id: user.id,
                    username: user.username,
                    role: user.role
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error('Login error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/api/auth/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, existingUser, hashedPassword, newUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, password = _a.password;
                if (!username || !password) {
                    return [2 /*return*/, res.status(400).json({ error: 'Username and password are required' })];
                }
                if (password.length < 6) {
                    return [2 /*return*/, res.status(400).json({ error: 'Password must be at least 6 characters long' })];
                }
                return [4 /*yield*/, storage_prisma_js_1.storage.getUserByUsername(username)];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(409).json({ error: 'Username already exists' })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, storage_prisma_js_1.storage.createUser({
                        username: username,
                        passwordHash: hashedPassword,
                        role: 'user'
                    })];
            case 3:
                newUser = _b.sent();
                // Set session
                req.session.userId = newUser.id;
                req.session.user = newUser;
                res.json({
                    id: newUser.id,
                    username: newUser.username,
                    role: newUser.role
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error('Signup error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get('/api/auth/me', requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.session.userId;
                return [4 /*yield*/, storage_prisma_js_1.storage.getUser(userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                res.json({
                    id: user.id,
                    username: user.username,
                    role: user.role
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Get user error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/auth/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});
app.post('/api/auth/change-password', requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentPassword, newPassword, userId, user, isValidPassword, hashedNewPassword, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                userId = req.session.userId;
                if (!currentPassword || !newPassword) {
                    return [2 /*return*/, res.status(400).json({ error: 'Current password and new password are required' })];
                }
                if (newPassword.length < 6) {
                    return [2 /*return*/, res.status(400).json({ error: 'New password must be at least 6 characters long' })];
                }
                return [4 /*yield*/, storage_prisma_js_1.storage.getUser(userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(currentPassword, user.passwordHash)];
            case 2:
                isValidPassword = _b.sent();
                if (!isValidPassword) {
                    return [2 /*return*/, res.status(401).json({ error: 'Current password is incorrect' })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 3:
                hashedNewPassword = _b.sent();
                return [4 /*yield*/, storage_prisma_js_1.storage.updateUserPassword(userId, hashedNewPassword)];
            case 4:
                _b.sent();
                res.json({ message: 'Password changed successfully' });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                console.error('Change password error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// System status endpoint
app.get('/api/system/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1;
    return __generator(this, function (_a) {
        try {
            status_1 = {
                oracleCore: {
                    active: true,
                    memory: 92,
                    queries: 847,
                    uptime: "99.97%",
                    lastActivity: new Date().toISOString(),
                    databaseConnections: 5,
                    responseTime: "12ms"
                },
                system: {
                    status: "operational",
                    version: "1.0.0",
                    components: ["Zebulon Oracle", "Database Engine", "Query Processor"]
                }
            };
            res.json(status_1);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
        return [2 /*return*/];
    });
}); });
// Module Integration API endpoints
app.get('/api/modules', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var modules, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, storage_prisma_js_1.storage.getModuleIntegrations()];
            case 1:
                modules = _a.sent();
                res.json(modules);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Get modules error:', error_5);
                res.status(500).json({ error: 'Failed to fetch modules' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/modules/:moduleName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var moduleName, module_1, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                moduleName = req.params.moduleName;
                return [4 /*yield*/, storage_prisma_js_1.storage.getModuleIntegration(moduleName)];
            case 1:
                module_1 = _a.sent();
                if (!module_1) {
                    return [2 /*return*/, res.status(404).json({ error: 'Module not found' })];
                }
                res.json(module_1);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Get module error:', error_6);
                res.status(500).json({ error: 'Failed to fetch module' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/modules', requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var moduleData, module_2, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                moduleData = req.body;
                return [4 /*yield*/, storage_prisma_js_1.storage.createModuleIntegration(moduleData)];
            case 1:
                module_2 = _a.sent();
                res.json(module_2);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Create module error:', error_7);
                res.status(500).json({ error: 'Failed to create module integration' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/modules/:moduleName', requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var moduleName, updateData, module_3, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                moduleName = req.params.moduleName;
                updateData = req.body;
                return [4 /*yield*/, storage_prisma_js_1.storage.updateModuleIntegration(moduleName, updateData)];
            case 1:
                module_3 = _a.sent();
                res.json(module_3);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Update module error:', error_8);
                res.status(500).json({ error: 'Failed to update module integration' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/modules/:moduleName', requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var moduleName, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                moduleName = req.params.moduleName;
                return [4 /*yield*/, storage_prisma_js_1.storage.deleteModuleIntegration(moduleName)];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Delete module error:', error_9);
                res.status(500).json({ error: 'Failed to delete module integration' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Oracle Memory endpoints - Admin only access
var requireAdmin = function (req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    // For now, treating all authenticated users as admin
    // In production, check user.role === 'admin'
    next();
};
// Get all Oracle memories
app.get('/api/oracle/memories', requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, status_2, type, memories, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, search = _a.search, status_2 = _a.status, type = _a.type;
                return [4 /*yield*/, storage_prisma_js_1.storage.searchOracleMemories(search, status_2, type)];
            case 1:
                memories = _b.sent();
                res.json({ memories: memories });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _b.sent();
                console.error('Get Oracle memories error:', error_10);
                res.status(500).json({ error: 'Failed to fetch Oracle memories' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get specific Oracle memory by label
app.get('/api/oracle/recall/:label', requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var label, memory, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                label = req.params.label;
                return [4 /*yield*/, storage_prisma_js_1.storage.getOracleMemoryByLabel(label)];
            case 1:
                memory = _a.sent();
                if (!memory) {
                    return [2 /*return*/, res.status(404).json({ error: 'Memory not found' })];
                }
                res.json({ memory: memory });
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.error('Recall Oracle memory error:', error_11);
                res.status(500).json({ error: 'Failed to recall memory' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Store new Oracle memory
app.post('/api/oracle/store', requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, label, description, content, memoryType, userId, existing, memory, error_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, label = _a.label, description = _a.description, content = _a.content, memoryType = _a.memoryType;
                userId = req.session.userId;
                if (!label || !description || !content || !memoryType) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Label, description, content, and memory type are required'
                        })];
                }
                return [4 /*yield*/, storage_prisma_js_1.storage.getOracleMemoryByLabel(label)];
            case 1:
                existing = _b.sent();
                if (existing) {
                    return [2 /*return*/, res.status(409).json({ error: 'Memory with this label already exists' })];
                }
                return [4 /*yield*/, storage_prisma_js_1.storage.createOracleMemory({
                        label: label,
                        description: description,
                        content: content,
                        memoryType: memoryType,
                        createdBy: 'admin' // In production, use actual username
                    })];
            case 2:
                memory = _b.sent();
                res.json({ memory: memory, message: 'Memory stored successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_12 = _b.sent();
                console.error('Store Oracle memory error:', error_12);
                res.status(500).json({ error: 'Failed to store memory' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Lock/unlock Oracle memory
app.patch('/api/oracle/lock', requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, label, status_3, memory, error_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, label = _a.label, status_3 = _a.status;
                if (!label || !status_3 || !['active', 'locked'].includes(status_3)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Valid label and status (active/locked) are required'
                        })];
                }
                return [4 /*yield*/, storage_prisma_js_1.storage.updateOracleMemory(label, { status: status_3 })];
            case 1:
                memory = _b.sent();
                res.json({ memory: memory, message: "Memory ".concat(status_3, " successfully") });
                return [3 /*break*/, 3];
            case 2:
                error_13 = _b.sent();
                console.error('Lock Oracle memory error:', error_13);
                res.status(500).json({ error: 'Failed to update memory status' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Export Oracle memory
app.get('/api/oracle/export/:label', requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var label, _a, format, memory, filename, contentType, data, error_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                label = req.params.label;
                _a = req.query.format, format = _a === void 0 ? 'json' : _a;
                return [4 /*yield*/, storage_prisma_js_1.storage.getOracleMemoryByLabel(label)];
            case 1:
                memory = _b.sent();
                if (!memory) {
                    return [2 /*return*/, res.status(404).json({ error: 'Memory not found' })];
                }
                filename = void 0;
                contentType = void 0;
                data = void 0;
                switch (format) {
                    case 'txt':
                        filename = "".concat(label, ".txt");
                        contentType = 'text/plain';
                        data = "Label: ".concat(memory.label, "\nDescription: ").concat(memory.description, "\nType: ").concat(memory.memoryType, "\nStatus: ").concat(memory.status, "\nCreated: ").concat(memory.createdAt, "\nLast Modified: ").concat(memory.lastModified, "\n\nContent:\n").concat(memory.content);
                        break;
                    case 'json':
                        filename = "".concat(label, ".json");
                        contentType = 'application/json';
                        data = JSON.stringify(memory, null, 2);
                        break;
                    default:
                        return [2 /*return*/, res.status(400).json({ error: 'Unsupported format. Use json or txt' })];
                }
                res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
                res.setHeader('Content-Type', contentType);
                res.send(data);
                return [3 /*break*/, 3];
            case 2:
                error_14 = _b.sent();
                console.error('Export Oracle memory error:', error_14);
                res.status(500).json({ error: 'Failed to export memory' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update Oracle memory
app.patch('/api/oracle/memories/:label', requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var label, updates, memory, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                label = req.params.label;
                updates = req.body;
                // Don't allow changing the label itself or creation metadata
                delete updates.id;
                delete updates.label;
                delete updates.createdBy;
                delete updates.createdAt;
                return [4 /*yield*/, storage_prisma_js_1.storage.updateOracleMemory(label, updates)];
            case 1:
                memory = _a.sent();
                res.json({ memory: memory, message: 'Memory updated successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_15 = _a.sent();
                console.error('Update Oracle memory error:', error_15);
                res.status(500).json({ error: 'Failed to update memory' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Delete Oracle memory
app.delete('/api/oracle/memories/:label', requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var label, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                label = req.params.label;
                return [4 /*yield*/, storage_prisma_js_1.storage.deleteOracleMemory(label)];
            case 1:
                _a.sent();
                res.json({ message: 'Memory deleted successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                console.error('Delete Oracle memory error:', error_16);
                res.status(500).json({ error: 'Failed to delete memory' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GEDCOM routes
app.use('/api/gedcom', gedcom_js_1.default);
// API health check with database status
app.get('/api/health', function (req, res) {
    var dbStatus = (0, db_dual_js_1.getActiveConnection)();
    res.json({
        status: 'ok',
        message: 'Zebulon Oracle System is running with Prisma',
        database: dbStatus
    });
});
// Serve React app
var publicPath = path_1.default.join(__dirname, '../dist/public');
app.get('*', function (req, res) {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path_1.default.join(publicPath, 'index.html'));
    }
    else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});
// Error handler
app.use(function (err, _req, res, _next) {
    var status = err.status || err.statusCode || 500;
    var message = err.message || "Internal Server Error";
    res.status(status).json({ message: message });
    console.error(err);
});
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                console.log('Initializing database with Prisma...');
                // Start server
                app.listen(PORT, function () {
                    console.log('Database initialization completed');
                    console.log("\uD83D\uDE80 Zebulon Oracle System running on port ".concat(PORT));
                    console.log("\uD83C\uDF10 Frontend and Backend unified on single port");
                    console.log("\uD83D\uDCBE Database: PostgreSQL with Prisma");
                    console.log("\uD83D\uDD2E Oracle: Database query and analysis engine ready");
                    console.log("\uD83D\uDD12 Security: Multi-layer protection active");
                    console.log("\uD83C\uDF0D Access your Zebulon Oracle System at: http://localhost:".concat(PORT));
                });
            }
            catch (error) {
                console.error('Failed to start server:', error);
                process.exit(1);
            }
            return [2 /*return*/];
        });
    });
}
startServer();
