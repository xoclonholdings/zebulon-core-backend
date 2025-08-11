// Zebulon Core API entrypoint
import express from 'express';
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/version', (req, res) => {
  // TODO: Read from package.json and git sha
  res.json({ version: '0.1.0', git: null });
});

const DEFAULT_PORT = parseInt(process.env.PORT || '5700', 10);
const MAX_PORT = DEFAULT_PORT + 20;
function tryListen(port) {
  app.listen(port, () => {
    console.log(`Zebulon Core API running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (port < MAX_PORT) {
        console.warn(`Port ${port} in use, trying port ${port + 1}...`);
        setTimeout(() => tryListen(port + 1), 500);
      } else {
        console.error('No available ports found in range. Exiting.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}
tryListen(DEFAULT_PORT);
