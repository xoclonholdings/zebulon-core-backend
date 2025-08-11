// Simple Express API mocks for Zebulon tiles (CommonJS)
const express = require('express');
const app = express();
const port = 5050;

app.get('/api/zed', (req, res) => {
  res.json({
    conversation: [
      { role: 'user', content: 'Hello ZED!' },
      { role: 'ai', content: 'Hello, how can I help you today?' }
    ],
    summary: 'ZED is online.'
  });
});

app.get('/api/zeta', (req, res) => {
  res.json({
    threats: 2,
    firewall: 'active',
    logs: [{ time: '2025-08-11', event: 'Blocked intrusion attempt' }]
  });
});

app.get('/api/zlab', (req, res) => {
  res.json({
    projects: ['Project Alpha', 'Project Beta'],
    tasks: [{ name: 'Design UI', status: 'in progress' }],
    meetings: [{ topic: 'Sprint Planning', time: '10:00' }]
  });
});

app.get('/api/zwap', (req, res) => {
  res.json({
    balance: 1200.50,
    supply: ['Widget A', 'Widget B'],
    orders: [{ id: 1, item: 'Widget A', status: 'shipped' }]
  });
});

app.get('/api/zync', (req, res) => {
  res.json({
    repos: ['zebulon-core', 'zync-ide'],
    builds: [{ id: 1, status: 'success' }],
    git: 'connected'
  });
});

app.get('/api/zulu', (req, res) => {
  res.json({
    metrics: { cpu: 32, mem: 68 },
    news: ['System update available', 'All systems nominal'],
    diagnostics: 'OK'
  });
});

app.listen(port, () => {
  console.log(`Zebulon API mock server running at http://localhost:${port}`);
});
