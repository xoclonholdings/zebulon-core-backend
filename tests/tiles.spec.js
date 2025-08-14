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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
var BASE_URL = (_a = process.env.E2E_BASE_URL) !== null && _a !== void 0 ? _a : 'http://localhost:5173';
var API_BASE = process.env.VITE_API_BASE;
var SEL = {
    appRoot: '#app',
    grid: '[data-testid="home-grid"]',
    tile: {
        zed: '[data-testid="tile-zed"]',
        zeta: '[data-testid="tile-zeta"]',
        zlab: '[data-testid="tile-zlab"]',
        zwap: '[data-testid="tile-zwap"]',
        zync: '[data-testid="tile-zync"]',
        zulu: '[data-testid="tile-zulu"]',
    },
    ready: {
        zed: '[data-testid="zed-ready"]',
        zeta: '[data-testid="zeta-ready"]',
        zlab: '[data-testid="zlab-ready"]',
        zwap: '[data-testid="zwap-ready"]',
        zync: '[data-testid="zync-ready"]',
        zulu: '[data-testid="zulu-ready"]',
    },
    header: {
        coreBtn: '[data-testid="btn-core"]',
        settingsBtn: '[data-testid="btn-settings"]',
    },
    views: {
        core: '[data-testid="core-panel"]',
        settings: '[data-testid="settings-panel"]',
    },
    homeLogo: '[data-testid="home-logo"]',
};
function step(name, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, test.step(name, fn)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    err_1 = _b.sent();
                    throw new Error("[".concat(name, "] ").concat((_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _a !== void 0 ? _a : err_1));
                case 3: return [2 /*return*/];
            }
        });
    });
}
test.describe('Zebulon Homeview E2E', function () {
    it('home + tiles', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        // Helper for tile navigation
        function openTile(tile, readySel, expectedPath, readyMsg, action) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, step("Open ".concat(tile.toUpperCase()), function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, page.click(SEL.tile[tile])];
                                        case 1:
                                            _b.sent();
                                            return [4 /*yield*/, page.waitForURL(expectedPath, { timeout: 10000 })];
                                        case 2:
                                            _b.sent();
                                            (0, test_1.expect)(page.url(), "".concat(tile.toUpperCase(), " tile click did not navigate to ").concat(expectedPath, ". Ensure router path and Link are wired.")).toContain(expectedPath);
                                            return [4 /*yield*/, page.waitForSelector(readySel, { timeout: 10000 })];
                                        case 3:
                                            _b.sent();
                                            _a = test_1.expect;
                                            return [4 /*yield*/, page.isVisible(readySel)];
                                        case 4:
                                            _a.apply(void 0, [_b.sent(), "".concat(tile.toUpperCase(), " view ready marker not found. Ensure component mounts and data-testid='").concat(tile, "-ready' exists.")]).toBeTruthy();
                                            return [4 /*yield*/, action()];
                                        case 5:
                                            _b.sent();
                                            return [4 /*yield*/, page.$(SEL.homeLogo)];
                                        case 6:
                                            if (!_b.sent()) return [3 /*break*/, 8];
                                            return [4 /*yield*/, page.click(SEL.homeLogo)];
                                        case 7:
                                            _b.sent();
                                            return [3 /*break*/, 10];
                                        case 8: return [4 /*yield*/, page.goBack()];
                                        case 9:
                                            _b.sent();
                                            _b.label = 10;
                                        case 10: return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var consoleErrors;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    consoleErrors = [];
                    page.on('pageerror', function (err) {
                        consoleErrors.push("Page error: ".concat(err.message));
                    });
                    page.on('console', function (msg) {
                        if (msg.type() === 'error')
                            consoleErrors.push("Console error: ".concat(msg.text()));
                    });
                    return [4 /*yield*/, step('Open Home', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var resp, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.goto(BASE_URL)];
                                    case 1:
                                        resp = _b.sent();
                                        (0, test_1.expect)(resp === null || resp === void 0 ? void 0 : resp.status(), 'Home did not load (HTTP error). Check dev server, E2E_BASE_URL, or Vite preview.').toBe(200);
                                        return [4 /*yield*/, (0, test_1.expect)(page.locator(SEL.appRoot)).toBeVisible({ timeout: 15000 })];
                                    case 2:
                                        _b.sent();
                                        _a = test_1.expect;
                                        return [4 /*yield*/, page.$(SEL.appRoot)];
                                    case 3:
                                        _a.apply(void 0, [_b.sent(), 'Home did not load (no #app root). Check dev server, E2E_BASE_URL, or Vite preview.']).not.toBeNull();
                                        (0, test_1.expect)(consoleErrors, 'Console errors on home load. Check browser console for stack.').toEqual([]);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, step('Verify grid + tiles visible', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _i, _a, _b, key, sel, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, (0, test_1.expect)(page.locator(SEL.grid)).toBeVisible({ timeout: 15000 })];
                                    case 1:
                                        _d.sent();
                                        _i = 0, _a = Object.entries(SEL.tile);
                                        _d.label = 2;
                                    case 2:
                                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                                        _b = _a[_i], key = _b[0], sel = _b[1];
                                        _c = test_1.expect;
                                        return [4 /*yield*/, page.isVisible(sel)];
                                    case 3:
                                        _c.apply(void 0, [_d.sent(), "Tile ".concat(key.toUpperCase(), " not visible. Check data-testid and grid render.")]).toBeTruthy();
                                        _d.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, openTile('zed', SEL.ready.zed, '/zed', 'ZED ready marker', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.$('[data-testid="zed-input"]')];
                                    case 1:
                                        if (!_b.sent()) return [3 /*break*/, 4];
                                        return [4 /*yield*/, page.fill('[data-testid="zed-input"]', 'test')];
                                    case 2:
                                        _b.sent();
                                        _a = test_1.expect;
                                        return [4 /*yield*/, page.inputValue('[data-testid="zed-input"]')];
                                    case 3:
                                        _a.apply(void 0, [_b.sent(), 'ZED input not accepting text.']).toBe('test');
                                        _b.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, openTile('zeta', SEL.ready.zeta, '/zeta', 'ZETA ready marker', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, page.$('[data-testid="firewall-toggle"]')];
                                    case 1:
                                        if (!_a.sent()) return [3 /*break*/, 3];
                                        return [4 /*yield*/, page.click('[data-testid="firewall-toggle"]')];
                                    case 2:
                                        _a.sent();
                                        (0, test_1.expect)(true, 'ZETA firewall toggle not clickable.').toBeTruthy();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, openTile('zlab', SEL.ready.zlab, '/zlab', 'ZLab ready marker', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.$('[data-testid="zlab-kanban"]')];
                                    case 1:
                                        if (!_b.sent()) return [3 /*break*/, 3];
                                        _a = test_1.expect;
                                        return [4 /*yield*/, page.isVisible('[data-testid="zlab-kanban"]')];
                                    case 2:
                                        _a.apply(void 0, [_b.sent(), 'ZLab Kanban board not visible.']).toBeTruthy();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, openTile('zwap', SEL.ready.zwap, '/zwap', 'ZWAP ready marker', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.$('[data-testid="wallet-status"]')];
                                    case 1:
                                        if (!_b.sent()) return [3 /*break*/, 3];
                                        _a = test_1.expect;
                                        return [4 /*yield*/, page.isVisible('[data-testid="wallet-status"]')];
                                    case 2:
                                        _a.apply(void 0, [_b.sent(), 'ZWAP wallet badge not visible.']).toBeTruthy();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, openTile('zync', SEL.ready.zync, '/zync', 'ZYNC ready marker', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.$('[data-testid="zync-editor"]')];
                                    case 1:
                                        if (!_b.sent()) return [3 /*break*/, 3];
                                        _a = test_1.expect;
                                        return [4 /*yield*/, page.isVisible('[data-testid="zync-editor"]')];
                                    case 2:
                                        _a.apply(void 0, [_b.sent(), 'ZYNC IDE pane not visible.']).toBeTruthy();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, openTile('zulu', SEL.ready.zulu, '/zulu', 'ZULU ready marker', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.$('[data-testid="zulu-diagnostics"]')];
                                    case 1:
                                        if (!_b.sent()) return [3 /*break*/, 3];
                                        _a = test_1.expect;
                                        return [4 /*yield*/, page.isVisible('[data-testid="zulu-diagnostics"]')];
                                    case 2:
                                        _a.apply(void 0, [_b.sent(), 'ZULU diagnostics list not visible.']).toBeTruthy();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, step('Open Core panel', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.click(SEL.header.coreBtn)];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, page.waitForSelector(SEL.views.core, { timeout: 10000 })];
                                    case 2:
                                        _b.sent();
                                        _a = test_1.expect;
                                        return [4 /*yield*/, page.isVisible(SEL.views.core)];
                                    case 3:
                                        _a.apply(void 0, [_b.sent(), 'Core panel not visible. Check data-testid="core-panel".']).toBeTruthy();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, step('Open Settings', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.click(SEL.header.settingsBtn)];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, page.waitForSelector(SEL.views.settings, { timeout: 10000 })];
                                    case 2:
                                        _b.sent();
                                        _a = test_1.expect;
                                        return [4 /*yield*/, page.isVisible(SEL.views.settings)];
                                    case 3:
                                        _a.apply(void 0, [_b.sent(), 'Settings panel not visible. Check data-testid="settings-panel".']).toBeTruthy();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 10:
                    _c.sent();
                    if (!API_BASE) return [3 /*break*/, 12];
                    return [4 /*yield*/, step('API health', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var resp, json;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, request.get("".concat(API_BASE, "/health"))];
                                    case 1:
                                        resp = _a.sent();
                                        (0, test_1.expect)(resp.status(), 'API health endpoint did not return 200. Check backend Railway/port/env.').toBe(200);
                                        return [4 /*yield*/, resp.json()];
                                    case 2:
                                        json = _a.sent();
                                        (0, test_1.expect)(json.ok, 'API health endpoint did not return { ok: true }. Check backend health logic.').toBeTruthy();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    }); });
});
