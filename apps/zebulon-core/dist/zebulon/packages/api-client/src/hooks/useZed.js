"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZed = useZed;
const react_1 = require("react");
const index_1 = require("../index");
function useZed(getToken) {
    const api = new index_1.Api(process.env.NEXT_PUBLIC_ZED_API, getToken);
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const send = (0, react_1.useCallback)(async (content, ctx) => {
        setLoading(true);
        setError(undefined);
        try {
            setMessages(m => [...m, { role: 'user', content }]);
            const r = await api.post('/ask', { prompt: content, context: ctx });
            setMessages(m => [...m, { role: 'assistant', content: r.reply }]);
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { messages, send, loading, error };
}
