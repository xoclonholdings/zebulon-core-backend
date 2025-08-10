#!/usr/bin/env node
/**
 * zed-netd: Adaptive Wireless Network Daemon for Zed
 *
 * - Auto-connects in priority order: trusted Wi-Fi, cellular, open Wi-Fi, satellite
 * - Fully runtime-configurable via REST API and netd-state.json
 * - No hardcoded networks; all config is persisted
 * - Uses nmcli (and optionally mmcli for diagnostics)
 * - Robust, headless, recovers from network changes/sleep/crash
 *
 * Author: GitHub Copilot (2025)
 */

const fs = require('fs');
const http = require('http');
const { exec, execSync } = require('child_process');
const path = require('path');

const STATE_PATH = path.join(__dirname, 'netd-state.json');
const PORT = 5088;
const HOST = '127.0.0.1';
const CONNECTIVITY_URL = 'http://connectivitycheck.gstatic.com/generate_204';
const WWAN_TYPES = ['gsm', 'cdma', 'wwan'];
const DEFAULT_STATE = {
  priority: ['trusted_wifi', 'cellular', 'open_wifi', 'satellite'],
  trusted_ssids: [],
  banned_open_ssids: ['xfinitywifi', 'attwifi', 'Boingo Hotspot'],
  satellite: { enabled: false, relayUrl: '', authHeader: '', heartbeatMs: 60000 }
};

let state = null;
let online = false;
let currentPath = null;
let ssid = null;
let healthFails = 0;
let heartbeatTimer = null;
let scanTimer = null;
let backoff = 2000;

// --- State Management ---
function loadState() {
  if (!fs.existsSync(STATE_PATH)) {
    fs.writeFileSync(STATE_PATH, JSON.stringify(DEFAULT_STATE, null, 2));
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    log('Created default netd-state.json');
  } else {
    state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  }
}
function saveState() {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// --- Logging ---
function log(...args) {
  console.log('[zed-netd]', ...args);
}

// --- Network Helpers ---
function nmcli(cmd) {
  return new Promise((resolve, reject) => {
    exec(`nmcli -t ${cmd}`, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve(stdout.trim());
    });
  });
}
function mmcli(cmd) {
  return new Promise((resolve, reject) => {
    exec(`mmcli ${cmd}`, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve(stdout.trim());
    });
  });
}

// --- Connectivity Check ---
function checkConnectivity() {
  return new Promise((resolve) => {
    const req = http.get(CONNECTIVITY_URL, (res) => {
      resolve(res.statusCode === 204 || res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.abort();
      resolve(false);
    });
  });
}

// --- Wi-Fi Scan & Connect ---
async function scanWifi() {
  const out = await nmcli('device wifi list');
  return out.split('\n').slice(1).map(line => {
    const parts = line.split(/\s{2,}/);
    return {
      ssid: parts[0],
      signal: parts[6],
      security: parts[7] || '--'
    };
  }).filter(w => w.ssid);
}
async function getCurrentWifi() {
  try {
    const out = await nmcli('device status');
    const wifi = out.split('\n').find(l => l.includes('wifi') && l.includes('connected'));
    if (!wifi) return null;
    const dev = wifi.split(':')[0];
    const info = await nmcli(`-f active,ssid dev wifi | grep yes`);
    const ssid = info.split(':')[1];
    return ssid || null;
  } catch {
    return null;
  }
}
async function connectTrustedWifi() {
  const wifiList = await scanWifi();
  const trusted = wifiList.find(w => state.trusted_ssids.includes(w.ssid));
  if (trusted) {
    log('Connecting to trusted Wi-Fi:', trusted.ssid);
    await nmcli(`device wifi connect "${trusted.ssid}"`);
    currentPath = `wifi:${trusted.ssid}`;
    ssid = trusted.ssid;
    return true;
  }
  return false;
}
async function connectOpenWifi() {
  const wifiList = await scanWifi();
  for (const w of wifiList) {
    if (w.security === '--' && !state.banned_open_ssids.includes(w.ssid)) {
      log('Trying open Wi-Fi:', w.ssid);
      await nmcli(`device wifi connect "${w.ssid}"`);
      // Captive portal check
      const ok = await checkConnectivity();
      if (ok) {
        currentPath = `openwifi:${w.ssid}`;
        ssid = w.ssid;
        return true;
      } else {
        log('Captive portal detected, disconnecting:', w.ssid);
        await nmcli('device disconnect wifi');
      }
    }
  }
  return false;
}

// --- Cellular (WWAN) ---
async function connectCellular() {
  try {
    const out = await nmcli('connection show --active');
    const active = out.split('\n').find(l => WWAN_TYPES.some(t => l.includes(t)));
    if (active) {
      log('Cellular already active');
      currentPath = 'wwan';
      ssid = null;
      return true;
    }
    // Try to bring up any saved cellular profile
    const profiles = (await nmcli('connection show')).split('\n').filter(l => WWAN_TYPES.some(t => l.includes(t)));
    for (const p of profiles) {
      const name = p.split(':')[0];
      log('Bringing up cellular profile:', name);
      await nmcli(`connection up "${name}"`);
      currentPath = 'wwan';
      ssid = null;
      return true;
    }
    // Try to connect any WWAN device
    const devs = (await nmcli('device')).split('\n').filter(l => l.includes('wwan'));
    for (const d of devs) {
      const dev = d.split(':')[0];
      log('Connecting WWAN device:', dev);
      await nmcli(`device connect ${dev}`);
      currentPath = 'wwan';
      ssid = null;
      return true;
    }
  } catch (e) {
    log('Cellular connect error:', e);
  }
  return false;
}

// --- Satellite Heartbeat ---
async function enterSatelliteMode() {
  if (!state.satellite.enabled || !state.satellite.relayUrl) {
    log('Satellite mode not enabled/configured. Staying offline.');
    online = false;
    currentPath = 'satellite';
    return;
  }
  log('Entering satellite heartbeat mode');
  currentPath = 'satellite';
  ssid = null;
  online = false;
  sendHeartbeat();
}
function sendHeartbeat() {
  if (!state.satellite.enabled || !state.satellite.relayUrl) return;
  const payload = JSON.stringify({
    type: 'heartbeat',
    source: 'zed-netd',
    ts: Date.now(),
    path: currentPath
  });
  const url = new URL(state.satellite.relayUrl);
  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(state.satellite.authHeader ? { 'Authorization': state.satellite.authHeader } : {})
    }
  };
  const req = http.request({
    hostname: url.hostname,
    port: url.port || 80,
    path: url.pathname,
    method: 'POST',
    headers: opts.headers
  }, res => {
    log('Satellite heartbeat sent, status:', res.statusCode);
  });
  req.on('error', err => log('Satellite heartbeat error:', err));
  req.write(payload);
  req.end();
  heartbeatTimer = setTimeout(sendHeartbeat, state.satellite.heartbeatMs || 60000);
}
function exitSatelliteMode() {
  if (heartbeatTimer) clearTimeout(heartbeatTimer);
  heartbeatTimer = null;
}

// --- Health Check ---
async function healthCheck() {
  const ok = await checkConnectivity();
  if (ok) {
    healthFails = 0;
    if (!online) log('Network restored:', currentPath);
    online = true;
  } else {
    healthFails++;
    log('Connectivity check failed', healthFails, '/3');
    if (healthFails >= 3) {
      log('Health check failed 3x, disconnecting and failing over');
      await nmcli('networking off');
      setTimeout(() => nmcli('networking on'), 1000);
      online = false;
      failover();
      return;
    }
  }
  setTimeout(healthCheck, 10000);
}

// --- Failover Logic ---
async function failover() {
  exitSatelliteMode();
  for (const mode of state.priority) {
    if (mode === 'trusted_wifi' && await connectTrustedWifi()) {
      online = true;
      setTimeout(healthCheck, 10000);
      return;
    }
    if (mode === 'cellular' && await connectCellular()) {
      online = true;
      setTimeout(healthCheck, 10000);
      return;
    }
    if (mode === 'open_wifi' && await connectOpenWifi()) {
      online = true;
      setTimeout(healthCheck, 10000);
      return;
    }
    if (mode === 'satellite') {
      await enterSatelliteMode();
      break;
    }
  }
  // If all fail, enter satellite mode and retry with backoff
  if (!online && state.priority.includes('satellite')) {
    await enterSatelliteMode();
    log('All networks failed, retrying in', backoff, 'ms');
    scanTimer = setTimeout(() => {
      backoff = Math.min(backoff * 2, 60000);
      failover();
    }, backoff);
  }
}

// --- REST API ---
const api = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ online, currentPath, ssid, priority: state.priority }));
    return;
  }
  if (req.method === 'GET' && url.pathname === '/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(state));
    return;
  }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = body ? JSON.parse(body) : {};
        if (url.pathname === '/trust' && data.ssid) {
          if (!state.trusted_ssids.includes(data.ssid)) state.trusted_ssids.push(data.ssid);
          saveState();
          res.writeHead(200); res.end('OK');
          return;
        }
        if (url.pathname === '/untrust' && data.ssid) {
          state.trusted_ssids = state.trusted_ssids.filter(s => s !== data.ssid);
          saveState();
          res.writeHead(200); res.end('OK');
          return;
        }
        if (url.pathname === '/ban' && data.ssid) {
          if (!state.banned_open_ssids.includes(data.ssid)) state.banned_open_ssids.push(data.ssid);
          saveState();
          res.writeHead(200); res.end('OK');
          return;
        }
        if (url.pathname === '/unban' && data.ssid) {
          state.banned_open_ssids = state.banned_open_ssids.filter(s => s !== data.ssid);
          saveState();
          res.writeHead(200); res.end('OK');
          return;
        }
        if (url.pathname === '/priority' && Array.isArray(data.list)) {
          const valid = ['trusted_wifi', 'cellular', 'open_wifi', 'satellite'];
          if (data.list.every(x => valid.includes(x)) && data.list.length === 4) {
            state.priority = data.list;
            saveState();
            res.writeHead(200); res.end('OK');
            return;
          } else {
            res.writeHead(400); res.end('Invalid priority list');
            return;
          }
        }
        if (url.pathname === '/satellite' && typeof data.enabled === 'boolean') {
          state.satellite = { ...state.satellite, ...data };
          saveState();
          res.writeHead(200); res.end('OK');
          return;
        }
        if (url.pathname === '/wifi/trust-current') {
          const cur = await getCurrentWifi();
          if (cur && !state.trusted_ssids.includes(cur)) {
            state.trusted_ssids.push(cur);
            saveState();
            res.writeHead(200); res.end('OK');
            return;
          } else {
            res.writeHead(400); res.end('No current Wi-Fi or already trusted');
            return;
          }
        }
        if (url.pathname === '/connect/now') {
          backoff = 2000;
          failover();
          res.writeHead(200); res.end('OK');
          return;
        }
        res.writeHead(404); res.end('Not found');
      } catch (e) {
        res.writeHead(400); res.end('Bad request');
      }
    });
    return;
  }
  res.writeHead(404); res.end('Not found');
});

// --- Main ---
function shutdown() {
  log('Shutting down...');
  if (heartbeatTimer) clearTimeout(heartbeatTimer);
  if (scanTimer) clearTimeout(scanTimer);
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

loadState();
api.listen(PORT, HOST, () => log('REST API listening on', `${HOST}:${PORT}`));
failover();
