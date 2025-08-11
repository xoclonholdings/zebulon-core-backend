// Zed Lite: Minimal chat bubble logic for embedding in Core/tiles
import { ZedClient } from '@zebulon/zed-sdk';

export async function zedLiteAsk(prompt: string, client: ZedClient, fallback: (prompt: string) => Promise<string>) {
  try {
    const res = await client.ask(prompt);
    return res.reply;
  } catch {
    // Fallback: direct OpenAI call or other local AI
    return fallback(prompt);
  }
}
