# ZED Tile

## Endpoints
- `/api/zed/status` (GET)
- `/api/zed/summary` (GET)
- `/api/zed/settings` (GET/PUT)
- `/api/zed/action` (POST)

## Envs
- `OLLAMA_BASE` or `OPENAI_API_KEY` (optional)

## Events
- Heartbeat every 60s
- Created on /action success

## Definition of Done
- All endpoints RBAC-guarded
- Events emitted to NOTIFY 'bus'
- Telemetry and metrics present
- E2E smoke tests pass
- UI tile mounted at /zed
