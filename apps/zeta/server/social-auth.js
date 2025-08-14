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
exports.setupSocialAuth = setupSocialAuth;
var passport_1 = require("passport");
var passport_twitter_1 = require("passport-twitter");
var passport_instagram_graph_1 = require("passport-instagram-graph");
var passport_snapchat_1 = require("passport-snapchat");
var express_session_1 = require("express-session");
var storage_1 = require("./storage");
function setupSocialAuth(app) {
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
    // Twitter OAuth Strategy
    if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
        passport_1.default.use(new passport_twitter_1.Strategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: "/api/auth/twitter/callback"
        }, function (token, tokenSecret, profile, done) { return __awaiter(_this, void 0, void 0, function () {
            var user, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, storage_1.storage.getUserBySocialId('twitter', profile.id)];
                    case 1:
                        user = _e.sent();
                        if (!!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, storage_1.storage.createSocialUser({
                                twitterId: profile.id,
                                twitterUsername: profile.username,
                                username: profile.displayName || profile.username,
                                profileImageUrl: (_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                                email: (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                            })];
                    case 2:
                        user = _e.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, storage_1.storage.updateUserLastLogin(user.id)];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5: return [2 /*return*/, done(null, user)];
                    case 6:
                        error_1 = _e.sent();
                        return [2 /*return*/, done(error_1)];
                    case 7: return [2 /*return*/];
                }
            });
        }); }));
    }
    // Instagram OAuth Strategy
    if (process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET) {
        passport_1.default.use(new passport_instagram_graph_1.Strategy({
            clientID: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
            callbackURL: "/api/auth/instagram/callback"
        }, function (accessToken, refreshToken, profile, done) { return __awaiter(_this, void 0, void 0, function () {
            var user, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, storage_1.storage.getUserBySocialId('instagram', profile.id)];
                    case 1:
                        user = _c.sent();
                        if (!!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, storage_1.storage.createSocialUser({
                                instagramId: profile.id,
                                instagramUsername: profile.username,
                                username: profile.displayName || profile.username,
                                profileImageUrl: (_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                            })];
                    case 2:
                        user = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, storage_1.storage.updateUserLastLogin(user.id)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [2 /*return*/, done(null, user)];
                    case 6:
                        error_2 = _c.sent();
                        return [2 /*return*/, done(error_2)];
                    case 7: return [2 /*return*/];
                }
            });
        }); }));
    }
    // Snapchat OAuth Strategy
    if (process.env.SNAPCHAT_CLIENT_ID && process.env.SNAPCHAT_CLIENT_SECRET) {
        passport_1.default.use(new passport_snapchat_1.Strategy({
            clientID: process.env.SNAPCHAT_CLIENT_ID,
            clientSecret: process.env.SNAPCHAT_CLIENT_SECRET,
            callbackURL: "/api/auth/snapchat/callback"
        }, function (accessToken, refreshToken, profile, done) { return __awaiter(_this, void 0, void 0, function () {
            var user, error_3;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, storage_1.storage.getUserBySocialId('snapchat', profile.id)];
                    case 1:
                        user = _c.sent();
                        if (!!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, storage_1.storage.createSocialUser({
                                snapchatId: profile.id,
                                snapchatUsername: profile.username,
                                username: profile.displayName || profile.username,
                                profileImageUrl: (_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                            })];
                    case 2:
                        user = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, storage_1.storage.updateUserLastLogin(user.id)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [2 /*return*/, done(null, user)];
                    case 6:
                        error_3 = _c.sent();
                        return [2 /*return*/, done(error_3)];
                    case 7: return [2 /*return*/];
                }
            });
        }); }));
    }
    passport_1.default.serializeUser(function (user, done) { return done(null, user.id); });
    passport_1.default.deserializeUser(function (id, done) { return __awaiter(_this, void 0, void 0, function () {
        var user, error_4;
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
                    error_4 = _a.sent();
                    done(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Social login routes
    app.get('/api/auth/twitter', passport_1.default.authenticate('twitter'));
    app.get('/api/auth/twitter/callback', passport_1.default.authenticate('twitter', { failureRedirect: '/auth?error=twitter' }), function (req, res) {
        res.redirect('/?social=twitter');
    });
    app.get('/api/auth/instagram', passport_1.default.authenticate('instagram'));
    app.get('/api/auth/instagram/callback', passport_1.default.authenticate('instagram', { failureRedirect: '/auth?error=instagram' }), function (req, res) {
        res.redirect('/?social=instagram');
    });
    app.get('/api/auth/snapchat', passport_1.default.authenticate('snapchat'));
    app.get('/api/auth/snapchat/callback', passport_1.default.authenticate('snapchat', { failureRedirect: '/auth?error=snapchat' }), function (req, res) {
        res.redirect('/?social=snapchat');
    });
    // ...existing code...
    app.post("/api/social-auth", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, provider, socialId, username, profileImage, email, user_1, userData, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, provider = _a.provider, socialId = _a.socialId, username = _a.username, profileImage = _a.profileImage, email = _a.email;
                    if (!provider || !socialId) {
                        return [2 /*return*/, res.status(400).json({ message: "Provider and social ID are required" })];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, storage_1.storage.getUserBySocialId(provider, socialId)];
                case 2:
                    user_1 = _b.sent();
                    if (!!user_1) return [3 /*break*/, 4];
                    userData = { username: username, profileImageUrl: profileImage, email: email };
                    userData["".concat(provider, "Id")] = socialId;
                    userData["".concat(provider, "Username")] = username;
                    return [4 /*yield*/, storage_1.storage.createSocialUser(userData)];
                case 3:
                    user_1 = _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, storage_1.storage.updateUserLastLogin(user_1.id)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    req.login(user_1, function (err) {
                        if (err) {
                            return res.status(500).json({ message: "Login error" });
                        }
                        res.json(user_1);
                    });
                    return [3 /*break*/, 8];
                case 7:
                    error_5 = _b.sent();
                    res.status(500).json({ message: "Authentication error" });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
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
