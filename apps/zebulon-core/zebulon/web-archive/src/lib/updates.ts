export async function sendUpdate(tile: string, action: string, payload: any, opts?: { dryRun?: boolean }) {
  const idempotencyKey = crypto.randomUUID();
  const res = await fetch(`/api/${tile}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tile, action, payload, idempotencyKey, dryRun: !!opts?.dryRun })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Update failed");
  return data;
}
