export type UpdateRequest = {
  tile: "zed" | "zeta" | "zlab" | "zwap" | "zync" | "zulu";
  action: string;
  payload: unknown;
  idempotencyKey: string;
  dryRun?: boolean;
};

export type UpdateResult = {
  ok: true;
  summary: string;
  badge?: { status: "ok" | "warn" | "error"; label: string; at: string };
  events?: Array<{ topic: string; message: string }>;
} | {
  ok: false;
  error: string;
};
