import { Router } from 'express';
import { getAI } from '@zebulon/ai';

const router = Router();

// POST /chat
router.post('/chat', async (req, res) => {
  try {
    const { messages, options } = req.body;
    const ai = getAI();
    const response = await ai.chat(messages, options);
    res.json({ response });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /chat/stream (SSE)
router.post('/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  try {
    const { messages, options } = req.body;
    const ai = getAI();
    await ai.chatStream!(messages, { ...options, stream: true }, {
  onToken: (token: string) => res.write(`data: ${JSON.stringify(token)}\n\n`),
      onEnd: () => res.end(),
  onError: (err: Error) => {
        res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`);
        res.end();
      },
    });
  } catch (err: any) {
    res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`);
    res.end();
  }
});

export default router;
