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
exports.setupWalletAuth = setupWalletAuth;
var passport_1 = require("passport");
var passport_local_1 = require("passport-local");
var express_session_1 = require("express-session");
var storage_1 = require("./storage");
function setupWalletAuth(app) {
    var _this = this;
    var sessionSettings = {
        secret: process.env.SESSION_SECRET || "fallback-secret-key",
        resave: false,
        saveUninitialized: false,
        store: storage_1.storage.sessionStore,
        cookie: {
            secure: false, // Set to true in production with HTTPS
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    };
    app.set("trust proxy", 1);
    app.use((0, express_session_1.default)(sessionSettings));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: 'walletAddress',
        passwordField: 'walletAddress', // Use wallet address as both username and password
    }, function (walletAddress, _, done) { return __awaiter(_this, void 0, void 0, function () {
        var user, newUser, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, storage_1.storage.getUserByWallet(walletAddress)];
                case 1:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 3];
                    return [4 /*yield*/, storage_1.storage.updateUserLastLogin(user.id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, done(null, user)];
                case 3: return [4 /*yield*/, storage_1.storage.createUserWithWallet({
                        walletAddress: walletAddress,
                        lastLoginAt: new Date(),
                    })];
                case 4:
                    newUser = _a.sent();
                    return [2 /*return*/, done(null, newUser)];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    return [2 /*return*/, done(error_1)];
                case 7: return [2 /*return*/];
            }
        });
    }); }));
    passport_1.default.serializeUser(function (user, done) { return done(null, user.id); });
    passport_1.default.deserializeUser(function (id, done) { return __awaiter(_this, void 0, void 0, function () {
        var user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage_1.storage.getUser(id)];
                case 1:
                    user = _a.sent();
                    done(null, user || null);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    done(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/wallet-auth", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var walletAddress;
        return __generator(this, function (_a) {
            walletAddress = req.body.walletAddress;
            if (!walletAddress) {
                return [2 /*return*/, res.status(400).json({ message: "Wallet address is required" })];
            }
            // Validate wallet address format (basic Ethereum address validation)
            if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
                return [2 /*return*/, res.status(400).json({ message: "Invalid wallet address format" })];
            }
            passport_1.default.authenticate("local", function (err, user) {
                if (err) {
                    return res.status(500).json({ message: "Authentication error" });
                }
                if (!user) {
                    return res.status(401).json({ message: "Authentication failed" });
                }
                req.login(user, function (loginErr) {
                    if (loginErr) {
                        return res.status(500).json({ message: "Login error" });
                    }
                    res.json(user);
                });
            })(req, res, next);
            return [2 /*return*/];
        });
    }); });
    app.get("/api/user", function (req, res) {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.json(req.user);
    });
    app.post("/api/logout", function (req, res, next) {
        req.logout(function (err) {
            if (err)
                return next(err);
            res.json({ message: "Logged out successfully" });
        });
    });
}
