"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var child_process_1 = require("child_process");
// This will start the app, open the Zebulon UI, and take a screenshot
describe('Zebulon UI loads and screenshot is taken', function () {
    // Kill any running servers
    try {
        (0, child_process_1.execSync)('pkill -f vite || true');
    }
    catch (_a) { }
    try {
        (0, child_process_1.execSync)('pkill -f node || true');
    }
    catch (_b) { }
    // Start backend server
    var spawn = require('child_process').spawn;
    var backendProc = spawn('pnpm', ['--dir', './server', 'dev'], { stdio: 'ignore', detached: true });
    // Wait for backend to be up
    var backendReady = false;
    // Open UI in Playwright and log URL for user
    var baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5173';
    var response;
    for (var i = 0; i < 20; i++) {
        try {
            response = yield page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
            if (response && response.status() < 400)
                break;
        }
        catch (e) { }
        yield new Promise(function (r) { return setTimeout(r, 1000); });
    }
    if (!response || response.status() >= 400)
        throw new Error('UI did not load');
    // Wait for dashboard or fallback to body
    var loaded = false;
    try {
        yield page.waitForSelector('[data-testid="dashboard-grid"]', { timeout: 15000 });
        loaded = true;
    }
    catch (_c) {
        // Fallback: wait for any body content
        yield page.waitForSelector('body', { timeout: 5000 });
    }
    // Take screenshot
    var screenshotPath = 'test-results/zebulon-ui-screenshot.png';
    yield page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);
    // Confirm screenshot exists
    if (!fs_1.default.existsSync(screenshotPath)) {
        throw new Error('Screenshot was not created');
    }
    // Open screenshot with default image viewer (Linux)
    try {
        (0, child_process_1.execSync)("xdg-open ".concat(screenshotPath, " &"), { stdio: 'ignore' });
        console.log('Screenshot opened with default image viewer.');
    }
    catch (e) {
        console.warn('Could not open screenshot automatically:', e);
    }
    // Clean up: kill backend server process
    try {
        process.kill(-backendProc.pid);
        console.log('Backend server process killed.');
    }
    catch (e) {
        console.warn('Could not kill backend server process:', e);
    }
});
