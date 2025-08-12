# Zebulon E2E Playwright Tests

## Quickstart

1. **Start the Zebulon full server (frontend + backend)** (in another terminal):
   ```bash
   # For development (hot reload, watch):
   npm run dev

   # For production (optimized, as in deployment):
   npm run build
   npm start
   ```

2. **Run the tests:**
   ```bash
   E2E_BASE_URL=http://localhost:5173 VITE_API_BASE=https://api.zebulonhub.xyz npx playwright test tests/tiles.spec.ts
   ```

- The test will stop on the first real failure and print a clear, actionable error message.
- Every failure message tells you what is missing and what to check (selector, route, or mount).
- You can set `E2E_BASE_URL` and `VITE_API_BASE` as needed for your environment.
