"use strict";
// PWA Service Worker Registration for Zebulon Chromebook App
// Enables offline functionality and app-like behavior
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
exports.zebulonPWA = void 0;
var ZebulonPWA = /** @class */ (function () {
    function ZebulonPWA() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isStandalone = false;
        this.checkStandaloneMode();
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupConnectionMonitoring();
    }
    ZebulonPWA.prototype.checkStandaloneMode = function () {
        // Check if running as installed PWA
        this.isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true ||
                document.referrer.includes('android-app://');
        if (this.isStandalone) {
            console.log('Zebulon: Running as installed PWA');
            document.body.classList.add('pwa-standalone');
        }
    };
    ZebulonPWA.prototype.registerServiceWorker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var registration_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!('serviceWorker' in navigator)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.serviceWorker.register('/sw.js', {
                                scope: '/'
                            })];
                    case 2:
                        registration_1 = _a.sent();
                        console.log('Zebulon Service Worker registered successfully:', registration_1.scope);
                        // Listen for service worker updates
                        registration_1.addEventListener('updatefound', function () {
                            var newWorker = registration_1.installing;
                            if (newWorker) {
                                newWorker.addEventListener('statechange', function () {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        _this.notifyUpdate();
                                    }
                                });
                            }
                        });
                        // Listen for messages from service worker
                        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Zebulon Service Worker registration failed:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ZebulonPWA.prototype.setupInstallPrompt = function () {
        var _this = this;
        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            _this.deferredPrompt = e;
            _this.showInstallButton();
        });
        window.addEventListener('appinstalled', function () {
            console.log('Zebulon PWA was installed');
            _this.isInstalled = true;
            _this.hideInstallButton();
            _this.deferredPrompt = null;
        });
    };
    ZebulonPWA.prototype.setupConnectionMonitoring = function () {
        var _this = this;
        window.addEventListener('online', function () {
            console.log('Zebulon: Connection restored');
            _this.notifyConnectionStatus(true);
        });
        window.addEventListener('offline', function () {
            console.log('Zebulon: Connection lost - switching to offline mode');
            _this.notifyConnectionStatus(false);
        });
    };
    ZebulonPWA.prototype.handleServiceWorkerMessage = function (event) {
        var _a;
        if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === 'CONNECTION_RESTORED') {
            console.log('Zebulon: Service Worker detected connection restoration');
            this.notifyConnectionStatus(true);
        }
    };
    ZebulonPWA.prototype.notifyUpdate = function () {
        // Notify user about app update
        var event = new CustomEvent('pwa-update-available', {
            detail: { message: 'A new version of Zebulon is available' }
        });
        window.dispatchEvent(event);
    };
    ZebulonPWA.prototype.notifyConnectionStatus = function (isOnline) {
        var event = new CustomEvent('pwa-connection-change', {
            detail: { isOnline: isOnline, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    };
    ZebulonPWA.prototype.showInstallButton = function () {
        var event = new CustomEvent('pwa-install-available', {
            detail: { canInstall: true }
        });
        window.dispatchEvent(event);
    };
    ZebulonPWA.prototype.hideInstallButton = function () {
        var event = new CustomEvent('pwa-install-available', {
            detail: { canInstall: false }
        });
        window.dispatchEvent(event);
    };
    // Public methods for app to use
    ZebulonPWA.prototype.installApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var choice, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.deferredPrompt) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.deferredPrompt.prompt()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.deferredPrompt.userChoice];
                    case 3:
                        choice = _a.sent();
                        if (choice.outcome === 'accepted') {
                            console.log('Zebulon: User accepted PWA installation');
                            return [2 /*return*/, true];
                        }
                        else {
                            console.log('Zebulon: User dismissed PWA installation');
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Zebulon: PWA installation failed:', error_2);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ZebulonPWA.prototype.isAppInstallable = function () {
        return this.deferredPrompt !== null;
    };
    ZebulonPWA.prototype.isRunningStandalone = function () {
        return this.isStandalone;
    };
    ZebulonPWA.prototype.isAppInstalled = function () {
        return this.isInstalled;
    };
    ZebulonPWA.prototype.getConnectionStatus = function () {
        return navigator.onLine;
    };
    ZebulonPWA.prototype.requestPersistentStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var granted, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!('storage' in navigator && 'persist' in navigator.storage)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.storage.persist()];
                    case 2:
                        granted = _a.sent();
                        console.log('Zebulon: Persistent storage granted:', granted);
                        return [2 /*return*/, granted];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Zebulon: Failed to request persistent storage:', error_3);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    ZebulonPWA.prototype.getStorageEstimate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var estimate, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!('storage' in navigator && 'estimate' in navigator.storage)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.storage.estimate()];
                    case 2:
                        estimate = _a.sent();
                        console.log('Zebulon Storage estimate:', estimate);
                        return [2 /*return*/, estimate];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Zebulon: Failed to get storage estimate:', error_4);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    return ZebulonPWA;
}());
// Initialize PWA functionality
exports.zebulonPWA = new ZebulonPWA();
// Export for use in components
exports.default = exports.zebulonPWA;
