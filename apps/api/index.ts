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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Zebulon Core API running on port ${PORT}`);
});
