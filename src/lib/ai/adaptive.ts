import OpenAI from "openai";
import { CreateMLCEngine, type ChatCompletionMessageParam } from "@mlc-ai/web-llm";

const CLOUD = "https://api.zebulonhub.xyz/v1";
let webllmInit: Promise<any> | null = null;

async function tryCloud(messages: ChatCompletionMessageParam[]) {
  const client = new OpenAI({ baseURL: CLOUD, apiKey: "sk-local" });
  const r = await client.chat.completions.create({ model: "gpt-4", messages });
  return r.choices[0]?.message?.content ?? "";
}

async function tryWebLLM(messages: ChatCompletionMessageParam[]) {
  if (!('gpu' in navigator)) throw new Error("WebGPU unavailable");
  if (!webllmInit) webllmInit = CreateMLCEngine("Llama-3.1-8B-Instruct-q4f16_1", { gpuInference: true } as any);
  const engine = await webllmInit;
  const r = await engine.chat.completions.create({ messages, stream: false });
  return r.choices?.[0]?.message?.content ?? "";
}

export async function adaptiveChat(messages: ChatCompletionMessageParam[]) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 3000);
  try {
    await fetch(CLOUD.replace("/v1","/readyz"), { signal: ac.signal });
    clearTimeout(t);
    return await tryCloud(messages);
  } catch (_) {
    clearTimeout(t);
    try { return await tryWebLLM(messages); }
    catch (e) { throw new Error("No cloud and no WebGPU fallback available."); }
  }
}
