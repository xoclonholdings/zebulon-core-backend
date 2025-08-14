"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUser = ensureUser;
exports.ensureSession = ensureSession;
exports.addMessage = addMessage;
exports.getRecentContext = getRecentContext;
exports.getSummary = getSummary;
exports.setSummary = setSummary;
exports.addFeedback = addFeedback;
exports.getUserStyle = getUserStyle;
var better_sqlite3_1 = require("better-sqlite3");
var db = new better_sqlite3_1.default(process.env.MEMORY_DB_PATH || "memory.db");
db.pragma("journal_mode = WAL");
// --- Schema ---
db.exec("\nCREATE TABLE IF NOT EXISTS users (\n  id TEXT PRIMARY KEY,\n  created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE IF NOT EXISTS sessions (\n  id TEXT PRIMARY KEY,\n  user_id TEXT NOT NULL,\n  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n  title TEXT,\n  summary TEXT DEFAULT '',\n  FOREIGN KEY(user_id) REFERENCES users(id)\n);\n\nCREATE TABLE IF NOT EXISTS messages (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  session_id TEXT NOT NULL,\n  role TEXT NOT NULL,           -- \"user\" | \"assistant\"\n  content TEXT NOT NULL,\n  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY(session_id) REFERENCES sessions(id)\n);\n\nCREATE TABLE IF NOT EXISTS feedback (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  session_id TEXT NOT NULL,\n  message_id INTEGER NOT NULL,  -- assistant message id\n  rating INTEGER NOT NULL,      -- +1 thumbs up, -1 thumbs down\n  note TEXT,\n  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY(session_id) REFERENCES sessions(id),\n  FOREIGN KEY(message_id) REFERENCES messages(id)\n);\n\n-- Per-user \u201Cpreference weights\u201D (very simple)\nCREATE TABLE IF NOT EXISTS user_prefs (\n  user_id TEXT PRIMARY KEY,\n  terse INTEGER DEFAULT 0,      -- positive => prefers concise\n  formal INTEGER DEFAULT 0,     -- positive => prefers formal tone\n  steps INTEGER DEFAULT 0       -- positive => prefers step lists\n);\n");
// --- Helpers ---
function ensureUser(userId) {
    db.prepare("INSERT OR IGNORE INTO users (id) VALUES (?)").run(userId);
    db.prepare("INSERT OR IGNORE INTO user_prefs (user_id) VALUES (?)").run(userId);
}
function ensureSession(sessionId, userId, title) {
    ensureUser(userId);
    db.prepare("\n    INSERT OR IGNORE INTO sessions (id, user_id, title)\n    VALUES (?, ?, ?)\n  ").run(sessionId, userId, title || null);
}
function addMessage(sessionId, role, content) {
    var info = db.prepare("\n    INSERT INTO messages (session_id, role, content)\n    VALUES (?, ?, ?)\n  ").run(sessionId, role, content);
    return info.lastInsertRowid;
}
function getRecentContext(sessionId, limit) {
    if (limit === void 0) { limit = 12; }
    var rows = db.prepare("\n    SELECT role, content\n    FROM messages\n    WHERE session_id = ?\n    ORDER BY id DESC\n    LIMIT ?\n  ").all(sessionId, limit);
    return rows.reverse();
}
function getSummary(sessionId) {
    var r = db.prepare("SELECT summary FROM sessions WHERE id = ?").get(sessionId);
    return ((r === null || r === void 0 ? void 0 : r.summary) || "").trim();
}
function setSummary(sessionId, summary) {
    db.prepare("UPDATE sessions SET summary = ? WHERE id = ?").run(summary, sessionId);
}
function addFeedback(sessionId, messageId, rating, note) {
    db.prepare("\n    INSERT INTO feedback (session_id, message_id, rating, note)\n    VALUES (?, ?, ?, ?)\n  ").run(sessionId, messageId, rating, note || null);
    // Update simple user preference weights
    // Upvote assistant responses containing step lists => +steps
    // Upvote short replies => +terse ; downvote short => -terse
    var msg = db.prepare("SELECT content FROM messages WHERE id = ?").get(messageId);
    if (!msg)
        return;
    var text = msg.content || "";
    var hasSteps = /(^|\n)[\-\*\d]\./.test(text) || /Step\s*\d+/i.test(text);
    var isShort = text.length < 180;
    if (rating > 0) {
        if (hasSteps)
            db.prepare("UPDATE user_prefs SET steps = steps + 1 WHERE user_id = (SELECT user_id FROM sessions WHERE id = ?)").run(sessionId);
        if (isShort)
            db.prepare("UPDATE user_prefs SET terse = terse + 1 WHERE user_id = (SELECT user_id FROM sessions WHERE id = ?)").run(sessionId);
    }
    else {
        if (hasSteps)
            db.prepare("UPDATE user_prefs SET steps = steps - 1 WHERE user_id = (SELECT user_id FROM sessions WHERE id = ?)").run(sessionId);
        if (isShort)
            db.prepare("UPDATE user_prefs SET terse = terse - 1 WHERE user_id = (SELECT user_id FROM sessions WHERE id = ?)").run(sessionId);
    }
}
function getUserStyle(userId) {
    var r = db.prepare("SELECT terse, formal, steps FROM user_prefs WHERE user_id = ?").get(userId);
    return {
        terse: Number((r === null || r === void 0 ? void 0 : r.terse) || 0),
        formal: Number((r === null || r === void 0 ? void 0 : r.formal) || 0),
        steps: Number((r === null || r === void 0 ? void 0 : r.steps) || 0),
    };
}
