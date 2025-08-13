"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZed = useZed;
// useZed: React hook for Zed chat integration
const react_1 = require("react");
function useZed(client) {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const sendMessage = async (content, context) => {
        setLoading(true);
        setMessages((msgs) => [...msgs, { role: 'user', content }]);
        try {
            const res = await client.ask(content, context);
            setMessages((msgs) => [...msgs, { role: 'assistant', content: res.reply }]);
        }
        finally {
            setLoading(false);
        }
    };
    return { messages, sendMessage, loading };
}
