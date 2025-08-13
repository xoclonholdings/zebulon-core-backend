"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const test_setup_1 = require("../test-setup");
(0, test_1.test)('Zed AI chat page connects to backend and returns a reply', async ({ page }) => {
    await (0, test_setup_1.waitForServers)();
    await page.goto('/chat');
    // Wait for chat input to be visible by placeholder
    const inputSelector = 'textarea[placeholder="Ask Zed…"]';
    await page.waitForSelector(inputSelector, { timeout: 10000 });
    // Type a message and send
    await page.fill(inputSelector, 'Hello Zed!');
    await page.getByRole('button', { name: /send/i }).click();
    // Wait for a response from the backend (assistant message)
    const assistantMsg = page.locator('[data-testid="assistant-msg"]').last();
    await (0, test_1.expect)(assistantMsg).toHaveText(/zed/i, { timeout: 15000 });
});
