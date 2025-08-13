"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAI = getAI;
// Stub implementation for getAI
function getAI() {
    return {
        name: 'StubAI',
        chat: async (...args) => {
            const msg = args[0] ?? '';
            return { reply: `Echo: ${msg}` };
        },
        chatStream: async function* (...args) {
            const msg = args[0] ?? '';
            yield { reply: `Echo: ${msg}` };
        },
    };
    // (removed extra bracket)
}
