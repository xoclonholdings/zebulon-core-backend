"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const test_setup_1 = require("../test-setup");
// This test assumes a /api/memory endpoint exists for memory read/write
(0, test_1.test)('Zebulon memory API: can write and read memory', async ({ request }) => {
    await (0, test_setup_1.waitForServers)();
    const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5173';
    const testKey = 'test-key-' + Date.now();
    const testValue = 'test-value';
    // Write memory
    const writeRes = await request.post(`${baseUrl}/api/memory`, {
        data: { key: testKey, value: testValue },
    });
    (0, test_1.expect)(writeRes.ok()).toBeTruthy();
    // Read memory
    const readRes = await request.get(`${baseUrl}/api/memory?key=${testKey}`);
    (0, test_1.expect)(readRes.ok()).toBeTruthy();
    const data = await readRes.json();
    (0, test_1.expect)(data.value).toBe(testValue);
});
