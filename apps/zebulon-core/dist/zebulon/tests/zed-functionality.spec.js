"use strict";
// Zebulon core functionality integration
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const BASE_URL = process.env.BASE_URL || process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
const questions = [
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
test_1.test.describe('Zed Functionality Test (25 questions)', () => {
    for (const [i, q] of questions.entries()) {
        (0, test_1.test)(`Q${i + 1}: ${q.prompt.slice(0, 40)}...`, async ({ request }) => {
            const res = await request.post(`${BASE_URL}/api/ask`, {
                data: { message: q.prompt, mode: 'agent' },
                headers: { 'Content-Type': 'application/json' },
            });
            (0, test_1.expect)(res.ok()).toBeTruthy();
            const data = await res.json();
            (0, test_1.expect)(data.message).toMatch(q.expect);
        });
    }
});
