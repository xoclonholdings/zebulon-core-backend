import { Request, Response } from 'express';
import { sendAudit, busNotify, kv, vec } from './';

export async function getZedStatus(req: Request, res: Response) {
  // TODO: check db, memory, llm
  res.json({ ok: true, uptime: process.uptime(), deps: { db: true, memory: true, llm: !!process.env.OLLAMA_BASE || !!process.env.OPENAI_API_KEY } });
}

export async function getZedSummary(req: Request, res: Response) {
  // TODO: fetch last 10 events, key settings
  res.json({ events: [], settings: [] });
}

export async function getZedSettings(req: Request, res: Response) {
  // TODO: fetch settings from db
  res.json({ settings: [] });
}

export async function putZedSettings(req: Request, res: Response) {
  // TODO: update settings in db, emit audit
  sendAudit('zed', 'settings_update', req.user?.id, req.body);
  res.json({ ok: true });
}

export async function postZedAction(req: Request, res: Response) {
  // TODO: handle chat/summarize/embed, wire to LLM
  const { type, payload } = req.body;
  // ...
  busNotify('zed', 'created', { type, payload });
  res.json({ ok: true, result: 'stub' });
}
