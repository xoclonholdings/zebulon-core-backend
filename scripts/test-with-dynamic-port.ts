import getPort from 'get-port';
import { spawn } from 'child_process';

async function main() {
  // Use a range of ports from 5173 to 5199
  const port = await getPort({ port: Array.from({ length: 127 }, (_, i) => 5173 + i) });
  process.env.VITE_PORT = port.toString();

  // Start the dev server
  const dev = spawn('pnpm', ['--filter', './client', 'dev'], {
    env: { ...process.env, VITE_PORT: port.toString() },
    stdio: 'inherit',
    detached: true,
  });

  // Wait for the dev server to be ready
  console.log(`Waiting for http://localhost:${port} to be ready...`);
  await new Promise((resolve) => setTimeout(resolve, 8000)); // Adjust as needed

  // Run Playwright tests
  const test = spawn('npx', ['playwright', 'test', `--base-url=http://localhost:${port}`], {
    stdio: 'inherit',
  });

  test.on('exit', (code) => {
    process.exit(code ?? 1);
  });
}

main();
