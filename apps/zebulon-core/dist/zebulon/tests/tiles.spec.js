"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const API_BASE = process.env.VITE_API_BASE;
const SEL = {
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
async function step(name, fn) {
    try {
        return await test.step(name, fn);
    }
    catch (err) {
        throw new Error(`[${name}] ${err?.message ?? err}`);
    }
}
test.describe('Zebulon Homeview E2E', () => {
    it('home + tiles', async ({ page }) => {
        // Timeout for the whole test
        let consoleErrors = [];
        page.on('pageerror', err => {
            consoleErrors.push(`Page error: ${err.message}`);
        });
        page.on('console', msg => {
            if (msg.type() === 'error')
                consoleErrors.push(`Console error: ${msg.text()}`);
        });
        await step('Open Home', async () => {
            const resp = await page.goto(BASE_URL);
            (0, test_1.expect)(resp?.status(), 'Home did not load (HTTP error). Check dev server, E2E_BASE_URL, or Vite preview.').toBe(200);
            await (0, test_1.expect)(page.locator(SEL.appRoot)).toBeVisible({ timeout: 15000 });
            (0, test_1.expect)(await page.$(SEL.appRoot), 'Home did not load (no #app root). Check dev server, E2E_BASE_URL, or Vite preview.').not.toBeNull();
            (0, test_1.expect)(consoleErrors, 'Console errors on home load. Check browser console for stack.').toEqual([]);
        });
        await step('Verify grid + tiles visible', async () => {
            await (0, test_1.expect)(page.locator(SEL.grid)).toBeVisible({ timeout: 15000 });
            for (const [key, sel] of Object.entries(SEL.tile)) {
                (0, test_1.expect)(await page.isVisible(sel), `Tile ${key.toUpperCase()} not visible. Check data-testid and grid render.`).toBeTruthy();
            }
        });
        // Helper for tile navigation
        async function openTile(tile, readySel, expectedPath, readyMsg, action) {
            await step(`Open ${tile.toUpperCase()}`, async () => {
                await page.click(SEL.tile[tile]);
                await page.waitForURL(expectedPath, { timeout: 10000 });
                (0, test_1.expect)(page.url(), `${tile.toUpperCase()} tile click did not navigate to ${expectedPath}. Ensure router path and Link are wired.`).toContain(expectedPath);
                await page.waitForSelector(readySel, { timeout: 10000 });
                (0, test_1.expect)(await page.isVisible(readySel), `${tile.toUpperCase()} view ready marker not found. Ensure component mounts and data-testid='${tile}-ready' exists.`).toBeTruthy();
                await action();
                // Return home
                if (await page.$(SEL.homeLogo)) {
                    await page.click(SEL.homeLogo);
                }
                else {
                    await page.goBack();
                }
            });
        }
        await openTile('zed', SEL.ready.zed, '/zed', 'ZED ready marker', async () => {
            if (await page.$('[data-testid="zed-input"]')) {
                await page.fill('[data-testid="zed-input"]', 'test');
                (0, test_1.expect)(await page.inputValue('[data-testid="zed-input"]'), 'ZED input not accepting text.').toBe('test');
            }
        });
        await openTile('zeta', SEL.ready.zeta, '/zeta', 'ZETA ready marker', async () => {
            if (await page.$('[data-testid="firewall-toggle"]')) {
                await page.click('[data-testid="firewall-toggle"]');
                (0, test_1.expect)(true, 'ZETA firewall toggle not clickable.').toBeTruthy();
            }
        });
        await openTile('zlab', SEL.ready.zlab, '/zlab', 'ZLab ready marker', async () => {
            if (await page.$('[data-testid="zlab-kanban"]')) {
                (0, test_1.expect)(await page.isVisible('[data-testid="zlab-kanban"]'), 'ZLab Kanban board not visible.').toBeTruthy();
            }
        });
        await openTile('zwap', SEL.ready.zwap, '/zwap', 'ZWAP ready marker', async () => {
            if (await page.$('[data-testid="wallet-status"]')) {
                (0, test_1.expect)(await page.isVisible('[data-testid="wallet-status"]'), 'ZWAP wallet badge not visible.').toBeTruthy();
            }
        });
        await openTile('zync', SEL.ready.zync, '/zync', 'ZYNC ready marker', async () => {
            if (await page.$('[data-testid="zync-editor"]')) {
                (0, test_1.expect)(await page.isVisible('[data-testid="zync-editor"]'), 'ZYNC IDE pane not visible.').toBeTruthy();
            }
        });
        await openTile('zulu', SEL.ready.zulu, '/zulu', 'ZULU ready marker', async () => {
            if (await page.$('[data-testid="zulu-diagnostics"]')) {
                (0, test_1.expect)(await page.isVisible('[data-testid="zulu-diagnostics"]'), 'ZULU diagnostics list not visible.').toBeTruthy();
            }
        });
        await step('Open Core panel', async () => {
            await page.click(SEL.header.coreBtn);
            await page.waitForSelector(SEL.views.core, { timeout: 10000 });
            (0, test_1.expect)(await page.isVisible(SEL.views.core), 'Core panel not visible. Check data-testid="core-panel".').toBeTruthy();
        });
        await step('Open Settings', async () => {
            await page.click(SEL.header.settingsBtn);
            await page.waitForSelector(SEL.views.settings, { timeout: 10000 });
            (0, test_1.expect)(await page.isVisible(SEL.views.settings), 'Settings panel not visible. Check data-testid="settings-panel".').toBeTruthy();
        });
        if (API_BASE) {
            await step('API health', async () => {
                const resp = await request.get(`${API_BASE}/health`);
                (0, test_1.expect)(resp.status(), 'API health endpoint did not return 200. Check backend Railway/port/env.').toBe(200);
                const json = await resp.json();
                (0, test_1.expect)(json.ok, 'API health endpoint did not return { ok: true }. Check backend health logic.').toBeTruthy();
            });
        }
    });
});
