
import { test, expect } from '@playwright/test';
import { waitForServers } from '../test-setup';

const tiles = [
  { name: 'ZED', selector: 'text=ZED — AI Assistant', url: '/zed' },
  { name: 'ZYNC', selector: 'text=ZYNC — Creator IDE', url: '/zync' },
  { name: 'ZETA', selector: 'text=ZETA — Security & Firewall', url: '/zeta' },
  { name: 'ZWAP', selector: 'text=ZWAP! — Finance & Supply', url: '/zwap' },
  { name: 'ZLab', selector: 'text=ZLab — Collaboration Hub', url: '/zlab' },
  { name: 'ZULU', selector: 'text=ZULU — System Diagnostics & Dashboard', url: '/zulu' },
];

test.describe('Zebulon dashboard tile connections', () => {

  test.beforeEach(async ({ page }) => {
  await waitForServers();
    await page.goto('/');
  });

  for (const tile of tiles) {
    test(`Tile ${tile.name} opens correct app`, async ({ page }) => {
      await page.click(tile.selector);
      // Wait for navigation or panel
      await page.waitForTimeout(1000);
      // Check for expected URL or UI element
      if (tile.url.startsWith('/')) {
        await expect(page).toHaveURL(new RegExp(tile.url.replace('/', '\\/')));
      } else {
        await expect(page.locator(tile.selector)).toBeVisible();
      }
    });
  }
});
