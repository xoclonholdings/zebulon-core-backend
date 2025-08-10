import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    baseURL: process.env.E2E_BASE_URL || "http://localhost:5173",
    viewport: { width: 1280, height: 800 },
    trace: "retain-on-failure",
  },
  // ...existing config (merge if present)
});
