"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const test_setup_1 = require("../test-setup");
const tiles = [
    { name: 'ZED', selector: 'text=ZED — AI Assistant', url: '/zed' },
    { name: 'ZYNC', selector: 'text=ZYNC — Creator IDE', url: '/zync' },
    { name: 'ZETA', selector: 'text=ZETA — Security & Firewall', url: '/zeta' },
    { name: 'ZWAP', selector: 'text=ZWAP! — Finance & Supply', url: '/zwap' },
    { name: 'ZLab', selector: 'text=ZLab — Collaboration Hub', url: '/zlab' },
    { name: 'ZULU', selector: 'text=ZULU — System Diagnostics & Dashboard', url: '/zulu' },
];
test_1.test.describe('Zebulon dashboard tile connections', () => {
    test_1.test.beforeEach(async ({ page }) => {
        await (0, test_setup_1.waitForServers)();
        await page.goto('/');
    });
    for (const tile of tiles) {
        (0, test_1.test)(`Tile ${tile.name} opens correct app`, async ({ page }) => {
            await page.click(tile.selector);
            // Wait for navigation or panel
            await page.waitForTimeout(1000);
            // Check for expected URL or UI element
            if (tile.url.startsWith('/')) {
                await (0, test_1.expect)(page).toHaveURL(new RegExp(tile.url.replace('/', '\\/')));
            }
            else {
                await (0, test_1.expect)(page.locator(tile.selector)).toBeVisible();
            }
        });
    }
});
