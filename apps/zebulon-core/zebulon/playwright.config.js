"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
    use: {
        baseURL: (_a = process.env.E2E_BASE_URL) !== null && _a !== void 0 ? _a : 'http://localhost:5173',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
    ],
});
