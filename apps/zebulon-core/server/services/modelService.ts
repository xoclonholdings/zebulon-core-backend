// Ollama model service for listing, switching, and health checking models
import fetch from 'node-fetch';

const OLLAMA_BASE_URL = process.env.OLLAMA_API_URL?.replace(/\/api\/generate$/, '') || 'http://localhost:11434';

export async function listOllamaModels() {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
  if (!res.ok) throw new Error('Failed to list Ollama models: ' + res.statusText);
  const data = (await res.json()) as { models?: any[] };
  return data.models || [];
}

export async function ollamaHealthCheck() {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/health`);
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function switchOllamaModel(model: string) {
  // No explicit switch endpoint; just use the model in chat calls
  // This is a placeholder for future logic (e.g., preloading, validation)
  return { ok: true, model };
}
