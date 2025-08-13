
# zed-netd: Adaptive Wireless Network Daemon for Zed

## Overview
`zed-netd` is a robust, headless, adaptive network management daemon for Linux (NetworkManager) that keeps Zed online by auto-connecting in strict priority order:

1. Trusted Wi-Fi
2. Device cellular data (WWAN)
3. Public/open Wi-Fi (no captive portal)
4. Satellite heartbeat (last resort)

All configuration is runtime-editable via a local REST API and persisted in `netd-state.json`. No secrets or SSIDs are hardcoded. Designed for reliability, recovery, and full transparency.

---

## Quick Start

**Requirements:**
- Linux with NetworkManager (`nmcli` must be installed and available in PATH)
- (Optional) ModemManager (`mmcli`) for cellular diagnostics
- Node.js 18+

**Install NetworkManager:**
```
sudo apt update && sudo apt install network-manager
```

**Run the daemon:**
```
node services/net/zed-netd.cjs
```

**Enable at boot (systemd):**
See `../../systemd/zed-netd.service` for a sample unit file. Edit `User=` as needed.

---

## Robust Help & Troubleshooting

**Common Issues:**
- `nmcli: not found`: Install NetworkManager as above.
- `mmcli: not found`: Only needed for cellular diagnostics; install ModemManager if required.
- `Permission denied`: Ensure you run as a user with rights to control NetworkManager (often root or a network group).
- `Cannot connect to Wi-Fi`: Check that your Wi-Fi device is enabled and not blocked (try `nmcli radio wifi on`).
- `State file errors`: The daemon auto-creates `netd-state.json` if missing or corrupted.

**How to Use the Help Button in Chat Sidebar:**
- Click the Help button for this full guide, troubleshooting, and REST API usage.
- Click Settings to view and edit network priorities, trusted/banned SSIDs, and satellite options live.

**How to Integrate with Zed Chat:**
- The daemon runs independently but exposes a REST API for the backend/chat UI to query status, show network path, and allow user-initiated changes (trust, ban, priority, etc).
- The chat sidebar can call `/status` to show current network, `/state` for config, and POST to endpoints for user actions.

---

## REST API (binds 127.0.0.1:5088)

- `GET /status` → `{ online, currentPath, ssid, priority }`
- `GET /state` → current persisted state
- `POST /trust` `{ "ssid": "..." }` → add to trusted_ssids
- `POST /untrust` `{ "ssid": "..." }` → remove from trusted_ssids
- `POST /ban` `{ "ssid": "..." }` → add to banned_open_ssids
- `POST /unban` `{ "ssid": "..." }` → remove from banned_open_ssids
- `POST /priority` `{ "list": [ ... ] }` → replace priority
- `POST /satellite` `{ "enabled": true|false, "relayUrl": "...", "authHeader": "...", "heartbeatMs": 60000 }`
- `POST /wifi/trust-current` → trust the currently connected Wi-Fi SSID
- `POST /connect/now` → trigger immediate failover scan

---

## State File Schema (`netd-state.json`)
```
{
  "priority": ["trusted_wifi", "cellular", "open_wifi", "satellite"],
  "trusted_ssids": [],
  "banned_open_ssids": ["xfinitywifi", "attwifi", "Boingo Hotspot"],
  "satellite": { "enabled": false, "relayUrl": "", "authHeader": "", "heartbeatMs": 60000 }
}
```

---

## Acceptance Test Checklist
- [ ] Start with no state file → daemon creates defaults
- [ ] POST /trust to add two SSIDs; power on a saved AP → service connects to trusted Wi-Fi
- [ ] Kill Wi-Fi AP → service switches to WWAN automatically (if available)
- [ ] Disable WWAN → service attempts open Wi-Fi (connects if non-captive, skips if captive)
- [ ] Remove all networks → service enters satellite mode and sends heartbeats
- [ ] Restore trusted Wi-Fi → service exits satellite mode and reconnects; /status shows wifi:<ssid>
- [ ] Change priority at runtime via POST /priority → verify order changes without restart
- [ ] POST /wifi/trust-current trusts a new SSID while connected

---

## Usage

Run with:
```
node services/net/zed-netd.cjs
```

---

## Systemd Unit
See `../../systemd/zed-netd.service` for a sample unit file.

---

## Support

For further help, see the chat sidebar Help button, or contact your system administrator.
