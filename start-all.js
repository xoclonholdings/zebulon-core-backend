// start-all.js
// Cross-platform Zebulon startup script: starts backend, waits, then starts frontend.
// Usage: node start-all.js
// For production, see the comment at the end.

const { spawn } = require('child_process');
const path = require('path');

// Helper to run a process and stream its output
function runProcess(cmd, args, cwd, name) {
  const proc = spawn(cmd, args, { cwd, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
  proc.stdout.on('data', data => process.stdout.write(`[${name}] ${data}`));
  proc.stderr.on('data', data => process.stderr.write(`[${name} ERROR] ${data}`));
  proc.on('exit', code => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      process.exit(code);
    }
  });
  return proc;
}

// Start backend
console.log('Starting Zebulon backend...');
const backendDir = path.join(__dirname, 'zebulon', 'backend');
const backend = runProcess('npm', ['run', 'dev'], backendDir, 'backend');

// Wait a few seconds for backend to initialize
setTimeout(() => {
  console.log('Starting Zebulon frontend...');
  const frontendDir = path.join(__dirname, 'zebulon', 'frontend');
  const frontend = runProcess('npm', ['run', 'dev'], frontendDir, 'frontend');
}, 5000);

// Production mode (example):
// Backend: cd zebulon/backend && npm run build && npm start
// Frontend: cd zebulon/frontend && npm run build && npm start
