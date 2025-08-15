import { api } from '../lib/api.js';

export async function zedChat(message: string) {
  const res = await api('/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  return res.json() as Promise<{ reply: string; provider?: string }>;
}

export async function zedAgent(message: string) {
  const res = await api('/agent', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  return res.json() as Promise<{ reply: string; provider?: string }>;
}
