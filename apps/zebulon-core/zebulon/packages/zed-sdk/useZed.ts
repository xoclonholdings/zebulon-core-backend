// useZed: React hook for Zed chat integration
import { useState } from 'react';
import { ZedClient } from './zed-client';

export function useZed(client: ZedClient) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string, context?: any) => {
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: 'user', content }]);
    try {
      const res = await client.ask(content, context);
      setMessages((msgs) => [...msgs, { role: 'assistant', content: res.reply }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}
