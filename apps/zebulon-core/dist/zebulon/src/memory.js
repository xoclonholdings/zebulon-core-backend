"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUser = ensureUser;
exports.ensureSession = ensureSession;
exports.addMessage = addMessage;
exports.getRecentContext = getRecentContext;
exports.getSummary = getSummary;
exports.setSummary = setSummary;
exports.addFeedback = addFeedback;
exports.getUserStyle = getUserStyle;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = new better_sqlite3_1.default(process.env.MEMORY_DB_PATH || "memory.db");
db.pragma("journal_mode = WAL");
// --- Schema ---
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  title TEXT,
  summary TEXT DEFAULT '',
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,           -- "user" | "assistant"
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  message_id INTEGER NOT NULL,  -- assistant message id
  rating INTEGER NOT NULL,      -- +1 thumbs up, -1 thumbs down
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(session_id) REFERENCES sessions(id),
  FOREIGN KEY(message_id) REFERENCES messages(id)
);

-- Per-user “preference weights” (very simple)
CREATE TABLE IF NOT EXISTS user_prefs (
  user_id TEXT PRIMARY KEY,
  terse INTEGER DEFAULT 0,      -- positive => prefers concise
  formal INTEGER DEFAULT 0,     -- positive => prefers formal tone
  steps INTEGER DEFAULT 0       -- positive => prefers step lists
);
`);
// --- Helpers ---
function ensureUser(userId) {
    db.prepare(`INSERT OR IGNORE INTO users (id) VALUES (?)`).run(userId);
    db.prepare(`INSERT OR IGNORE INTO user_prefs (user_id) VALUES (?)`).run(userId);
}
function ensureSession(sessionId, userId, title) {
    ensureUser(userId);
    db.prepare(`
    INSERT OR IGNORE INTO sessions (id, user_id, title)
    VALUES (?, ?, ?)
  `).run(sessionId, userId, title || null);
}
function addMessage(sessionId, role, content) {
    const info = db.prepare(`
    INSERT INTO messages (session_id, role, content)
    VALUES (?, ?, ?)
  `).run(sessionId, role, content);
    return info.lastInsertRowid;
}
function getRecentContext(sessionId, limit = 12) {
    const rows = db.prepare(`
    SELECT role, content
    FROM messages
    WHERE session_id = ?
    ORDER BY id DESC
    LIMIT ?
  `).all(sessionId, limit);
    return rows.reverse();
}
function getSummary(sessionId) {
    const r = db.prepare(`SELECT summary FROM sessions WHERE id = ?`).get(sessionId);
    return (r?.summary || "").trim();
}
function setSummary(sessionId, summary) {
    db.prepare(`UPDATE sessions SET summary = ? WHERE id = ?`).run(summary, sessionId);
}
function addFeedback(sessionId, messageId, rating, note) {
    db.prepare(`
    INSERT INTO feedback (session_id, message_id, rating, note)
    VALUES (?, ?, ?, ?)
  `).run(sessionId, messageId, rating, note || null);
    // Update simple user preference weights
    // Upvote assistant responses containing step lists => +steps
    // Upvote short replies => +terse ; downvote short => -terse
    const msg = db.prepare(`SELECT content FROM messages WHERE id = ?`).get(messageId);
    if (!msg)
        return;
    const text = msg.content || "";
    const hasSteps = /(^|\n)[\-\*\d]\./.test(text) || /Step\s*\d+/i.test(text);
    const isShort = text.length < 180;
    if (rating > 0) {
        if (hasSteps)
            db.prepare(`UPDATE user_prefs SET steps = steps + 1 WHERE user_id = (SELECT user_id FROM sessions WHERE id = ?)`).run(sessionId);
        if (isShort)
            db.prepare(`UPDATE user_prefs SET terse = terse + 1 WHERE user_id = (SELECT user_id FROM sessions WHERE id = ?)`).run(sessionId);
    }
    else {
        if (hasSteps)
            db.prepare(`UPDATE user_prefs SET steps = steps - 1 WHERE user_id = (SELECT user_id FROM sessions WHERE id = ?)`).run(sessionId);
        if (isShort)
            db.prepare(`UPDATE user_prefs SET terse = terse - 1 WHERE user_id = (SELECT user_id FROM sessions WHERE id = ?)`).run(sessionId);
    }
}
function getUserStyle(userId) {
    const r = db.prepare(`SELECT terse, formal, steps FROM user_prefs WHERE user_id = ?`).get(userId);
    return {
        terse: Number(r?.terse || 0),
        formal: Number(r?.formal || 0),
        steps: Number(r?.steps || 0),
    };
}
