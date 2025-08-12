// Simple Ollama API client for ZED backend
// Use native fetch (Node 18+)


const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

// Enhanced Ollama chat: supports streaming, model selection, error handling, and context
export async function ollamaChat(
  prompt: string,
  history: any[] = [],
  model: string = 'llama3',
  opts: { stream?: boolean, onToken?: (token: string) => void } = {}
): Promise<string> {
  const messages = history.map(m => ({ role: m.role, content: m.message }));
  messages.push({ role: 'user', content: prompt });
  const body = {
    model,
    messages,
    stream: !!opts.stream
  };
  const res = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    let errMsg = 'Ollama API error: ' + res.statusText;
    try {
      const errData = await res.json();
      if (errData && errData.error) errMsg += ` - ${errData.error}`;
    } catch {}
    throw new Error(errMsg);
  }
  if (opts.stream) {
    // Stream response tokens (SSE or NDJSON)
    const reader = res.body?.getReader();
    if (!reader) throw new Error('No stream reader available');
    let full = '';
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      // Ollama streams NDJSON: { message: { content: "..." } }
      for (const line of chunk.split('\n')) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          const token = obj?.message?.content || '';
          if (token) {
            full += token;
            if (opts.onToken) opts.onToken(token);
          }
        } catch {}
      }
    }
    return full;
  } else {
    const data = await res.json();
    return data?.message?.content || '';
  }
}

// List available models (calls /api/tags)
export async function listOllamaModels() {
  const url = OLLAMA_API_URL.replace(/\/api\/generate$/, '/api/tags');
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to list Ollama models: ' + res.statusText);
  const data = (await res.json()) as { models?: any[] };
  return data.models || [];
}

// Health check endpoint
export async function ollamaHealthCheck() {
  const url = OLLAMA_API_URL.replace(/\/api\/generate$/, '/api/health');
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// Switch model (no-op, placeholder for future logic)
export async function switchOllamaModel(model: string) {
  // No explicit switch endpoint; just use the model in chat calls
  return { ok: true, model };
}
