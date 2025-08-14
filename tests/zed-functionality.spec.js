"use strict";
// Zebulon core functionality integration
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
var BASE_URL = process.env.BASE_URL || process.env.API_URL || "http://localhost:".concat(process.env.PORT || 3001);
var questions = [
    // Conversation ability
    { prompt: 'Hello Zed!', expect: /hello|hi|greetings/i },
    { prompt: 'What is the capital of Ghana?', expect: /accra/i },
    { prompt: 'Summarize our conversation so far.', expect: /summary|recap|so far/i },
    { prompt: 'Give me a step-by-step guide to making tea.', expect: /step|boil|water|tea/i },
    { prompt: 'Thank you!', expect: /you'?re welcome|glad|help/i },
    // Query logging
    { prompt: 'Log this query for analytics.', expect: /logged|analytics|recorded/i },
    // Interaction logging
    { prompt: 'How do I view my interaction history?', expect: /history|log|interaction/i },
    // Authentication
    { prompt: 'Am I authenticated?', expect: /yes|authenticated|logged in/i },
    // Error handling
    { prompt: '', expect: /error|empty|invalid/i },
    { prompt: 'Cause an error on purpose.', expect: /error|problem|issue/i },
    // Model selection
    { prompt: 'Which AI model are you using?', expect: /model|gpt|ollama|tinyllama/i },
    // Metadata handling
    { prompt: 'What metadata do you store with each query?', expect: /metadata|info|data/i },
    // Filtering/querying logs
    { prompt: 'Show me my last 3 queries.', expect: /query|log|last 3/i },
    // Admin features
    { prompt: 'Show all user logs (admin).', expect: /admin|all users|logs/i },
    // Edge cases
    { prompt: 'What happens if I send a very long message? ' + 'a'.repeat(1000), expect: /long|truncated|processed/i },
    { prompt: 'What if I use special characters? !@#$%^&*()', expect: /special|characters|processed/i },
    { prompt: 'How do you handle SQL injection: "; DROP TABLE users;--', expect: /safe|secure|protected/i },
    { prompt: 'Can you handle unicode? 你好，Zed！', expect: /unicode|你好|hello/i },
    { prompt: 'What is the current server time?', expect: /time|date|current/i },
    { prompt: 'How do I reset my session?', expect: /reset|session|restart/i },
    { prompt: 'What is your privacy policy?', expect: /privacy|policy|data/i },
    { prompt: 'How do I contact support?', expect: /support|contact|help/i },
    { prompt: 'What is your uptime?', expect: /uptime|running|hours/i },
    { prompt: 'How do I change my password?', expect: /password|change|update/i },
    { prompt: 'What is the meaning of life?', expect: /42|meaning|life/i },
];
test_1.test.describe('Zed Functionality Test (25 questions)', function () {
    var _loop_1 = function (i, q) {
        (0, test_1.test)("Q".concat(i + 1, ": ").concat(q.prompt.slice(0, 40), "..."), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var res, data;
            var request = _b.request;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, request.post("".concat(BASE_URL, "/api/ask"), {
                            data: { message: q.prompt, mode: 'agent' },
                            headers: { 'Content-Type': 'application/json' },
                        })];
                    case 1:
                        res = _c.sent();
                        (0, test_1.expect)(res.ok()).toBeTruthy();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _c.sent();
                        (0, test_1.expect)(data.message).toMatch(q.expect);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    for (var _i = 0, _a = questions.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], i = _b[0], q = _b[1];
        _loop_1(i, q);
    }
});
