// Shared telemetry lib
export function logTelemetry(event: string, details: any) {
  // TODO: Integrate with real telemetry/observability
  console.log(`[TELEMETRY] ${event}`, details);
}
