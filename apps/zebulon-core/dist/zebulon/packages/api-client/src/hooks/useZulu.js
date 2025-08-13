"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZulu = useZulu;
const react_1 = require("react");
const index_1 = require("../index");
function useZulu(getToken) {
    const api = new index_1.Api(process.env.NEXT_PUBLIC_ZULU_API, getToken);
    const [cards, setCards] = (0, react_1.useState)([]);
    const [unread, setUnread] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => { api.get('/notifications?limit=12').then(setCards); api.get('/unread').then(r => setUnread(r.unread)); }, []);
    const markRead = (ids) => api.post('/mark-read', { ids });
    return { cards, unread, markRead };
}
