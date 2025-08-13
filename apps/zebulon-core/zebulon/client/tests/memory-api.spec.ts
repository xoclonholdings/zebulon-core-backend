
import { test, expect } from '@playwright/test';
import { waitForServers } from '../test-setup';

// This test assumes a /api/memory endpoint exists for memory read/write

test('Zebulon memory API: can write and read memory', async ({ request }) => {
  await waitForServers();
  const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5173';
  const testKey = 'test-key-' + Date.now();
  const testValue = 'test-value';

  // Write memory
  const writeRes = await request.post(`${baseUrl}/api/memory`, {
    data: { key: testKey, value: testValue },
  });
  expect(writeRes.ok()).toBeTruthy();

  // Read memory
  const readRes = await request.get(`${baseUrl}/api/memory?key=${testKey}`);
  expect(readRes.ok()).toBeTruthy();
  const data = await readRes.json();
  expect(data.value).toBe(testValue);
});
