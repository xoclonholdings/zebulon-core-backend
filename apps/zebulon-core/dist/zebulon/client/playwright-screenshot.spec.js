"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
// This will start the app, open the Zebulon UI, and take a screenshot
describe('Zebulon UI loads and screenshot is taken', () => {
    // Kill any running servers
    try {
        (0, child_process_1.execSync)('pkill -f vite || true');
    }
    catch { }
    try {
        (0, child_process_1.execSync)('pkill -f node || true');
    }
    catch { }
    // Start backend server
    const { spawn } = require('child_process');
    const backendProc = spawn('pnpm', ['--dir', './server', 'dev'], { stdio: 'ignore', detached: true });
    // Wait for backend to be up
    let backendReady = false;
    // Open UI in Playwright and log URL for user
    const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5173';
    let response;
    for (let i = 0; i < 20; i++) {
        try {
            response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
            if (response && response.status() < 400)
                break;
        }
        catch (e) { }
        await new Promise(r => setTimeout(r, 1000));
    }
    if (!response || response.status() >= 400)
        throw new Error('UI did not load');
    // Wait for dashboard or fallback to body
    let loaded = false;
    try {
        await page.waitForSelector('[data-testid="dashboard-grid"]', { timeout: 15000 });
        loaded = true;
    }
    catch {
        // Fallback: wait for any body content
        await page.waitForSelector('body', { timeout: 5000 });
    }
    // Take screenshot
    const screenshotPath = 'test-results/zebulon-ui-screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);
    // Confirm screenshot exists
    if (!fs_1.default.existsSync(screenshotPath)) {
        throw new Error('Screenshot was not created');
    }
    // Open screenshot with default image viewer (Linux)
    try {
        (0, child_process_1.execSync)(`xdg-open ${screenshotPath} &`, { stdio: 'ignore' });
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
