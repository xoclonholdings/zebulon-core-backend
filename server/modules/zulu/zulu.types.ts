export type ZuluCheck = {
  key: string;
  label: string;
  status: 'ok' | 'warn' | 'error';
  message?: string;
  value?: any;
  latencyMs?: number;
};

export type ZuluHealthSummary = {
  ok: boolean;
  checks: Record<string, ZuluCheck>;
  timestamp: string;
};

export type ZuluTask = {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastRun?: ZuluRun;
  lastStatus?: string;
  totalRuns?: number;
};

export type ZuluRun = {
  id: string;
  taskKey: string;
  status: 'queued' | 'running' | 'ok' | 'warn' | 'error';
  startedAt: string;
  finishedAt?: string;
  meta?: any;
  logs?: { ts: string; msg: string }[];
};

export type ZuluLogLine = { ts: string; msg: string };
