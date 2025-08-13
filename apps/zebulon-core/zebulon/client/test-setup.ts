// test-setup.ts
import { execSync } from 'child_process';
import http from 'http';

export async function waitForServers({
  vitePort = 5173,
  backendPort = 3001,
  backendHealthPath = '/health',
} = {}) {
  // Wait for backend to be up (do not kill or start)
  let backendReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => {
      const req = http.get(`http://localhost:${backendPort}${backendHealthPath}`, res => {
        if (res.statusCode && res.statusCode < 400) {
          backendReady = true;
          resolve(true);
        } else {
          resolve(false);
        }
      });
      req.on('error', () => resolve(false));
      req.end();
    });
    if (backendReady) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!backendReady) throw new Error(`Backend server on port ${backendPort} did not start`);

  // Wait for Vite to be up (do not kill or start)
  let viteReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => {
      const req = http.get(`http://localhost:${vitePort}`, res => {
        if (res.statusCode && res.statusCode < 400) {
          viteReady = true;
          resolve(true);
        } else {
          resolve(false);
        }
      });
      req.on('error', () => resolve(false));
      req.end();
    });
    if (viteReady) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!viteReady) throw new Error(`Vite dev server on port ${vitePort} did not start`);
}
