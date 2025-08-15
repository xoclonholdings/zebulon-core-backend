import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zebulon Oracle System is running' });
});

// System status endpoint
app.get('/api/system/status', (req, res) => {
  res.json({
    oracleCore: {
      active: true,
      memory: 92,
      queries: 847,
      uptime: '99.97%',
      lastActivity: new Date().toISOString(),
      databaseConnections: 5,
      responseTime: '12ms',
    },
    system: {
      status: 'operational',
      version: '1.0.0',
      components: ['Zebulon Oracle', 'Database Engine', 'Query Processor'],
    },
  });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
  console.error(err);
});

app.listen(PORT, () => {
  console.log(`🚀 Zebulon Oracle System running on port ${PORT}`);
});