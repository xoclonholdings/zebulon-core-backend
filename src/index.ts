import express from 'express';
import morgan from 'morgan';
import { buildCors } from './cors';

const app = express();
const PORT = Number(process.env.PORT || 3001); // Railway injects PORT at runtime

app.use(morgan('dev'));
app.use(express.json());
app.use(buildCors());

app.get('/health', (_req, res) => res.status(200).send('OK'));

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message required' });
    // Replace with real handler later; echo proves transport works:
    return res.status(200).json({ reply: `Zed says: ${message}` });
  } catch (err: any) {
    console.error('Chat error:', err?.message || err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// (Optional) Explicit preflight; cors() already handles OPTIONS
app.options('*', buildCors());

app.listen(PORT, () => {
  console.log(`[server] listening on :${PORT}`);
});
