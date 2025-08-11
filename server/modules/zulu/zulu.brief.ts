import { execSync } from 'node:child_process';
import { readRecentZuluLogLines } from './logger';
import { getHealth } from './zulu.service';

function checkNpmOutdated(): { total: number; critical: number; updates: Record<string, any> } | null {
  try {
    const out = execSync('npm outdated --json', { stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).toString();
    if (!out.trim()) return { total: 0, critical: 0, updates: {} };
    const json = JSON.parse(out);
    let total = Object.keys(json).length;
    let critical = 0;
    for (const k of Object.keys(json)) {
      const x = json[k];
      if (x?.current && x?.latest) {
        const curMajor = String(x.current).split('.')[0];
        const latMajor = String(x.latest).split('.')[0];
        if (curMajor !== latMajor) critical++;
      }
    }
    return { total, critical, updates: json };
  } catch {
    return null;
  }
}

export async function getZuluBrief() {
  const health = await getHealth();
  const dbMs = health.checks?.db?.latencyMs ?? null;
  const freePct = health.checks?.disk?.pctFree ?? null;
  const diskWarn = !!health.checks?.disk?.warn;
  const uploadsWritable = !!health.checks?.uploadsDir?.writable;

  const updates = checkNpmOutdated();
  const logTail = readRecentZuluLogLines(5);

  return {
    ts: new Date().toISOString(),
    overallOk: !!health.ok,
    dbMs,
    freePct,
    diskWarn,
    uploadsWritable,
    updates, // { total, critical, updates } | null
    ticker: logTail,
  };
}
