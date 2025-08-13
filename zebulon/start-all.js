const { spawn } = require('child_process');
const path = require('path');

function run(cmd, cwd) {
  return spawn(cmd, ['run', 'dev'], {
    cwd,
    shell: true,
    stdio: 'inherit'
  });
}

const backendPath = path.join(__dirname, 'backend');
const frontendPath = path.join(__dirname, 'frontend');

console.log('Starting Zebulon backend...');
const backend = run('npm', backendPath);

setTimeout(() => {
  console.log('Starting Zebulon frontend...');
  run('npm', frontendPath);
}, 3000);

// Cross-platform: works on Windows, Mac, Linux
// Usage: node start-all.js
