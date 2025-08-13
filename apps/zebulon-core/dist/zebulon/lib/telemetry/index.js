"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTelemetry = logTelemetry;
// Shared telemetry lib
function logTelemetry(event, details) {
    // TODO: Integrate with real telemetry/observability
    console.log(`[TELEMETRY] ${event}`, details);
}
