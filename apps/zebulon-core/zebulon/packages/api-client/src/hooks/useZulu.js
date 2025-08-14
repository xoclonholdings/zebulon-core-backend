"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZulu = useZulu;
var react_1 = require("react");
var index_1 = require("../index");
function useZulu(getToken) {
    var api = new index_1.Api(process.env.NEXT_PUBLIC_ZULU_API, getToken);
    var _a = (0, react_1.useState)([]), cards = _a[0], setCards = _a[1];
    var _b = (0, react_1.useState)(0), unread = _b[0], setUnread = _b[1];
    (0, react_1.useEffect)(function () { api.get('/notifications?limit=12').then(setCards); api.get('/unread').then(function (r) { return setUnread(r.unread); }); }, []);
    var markRead = function (ids) { return api.post('/mark-read', { ids: ids }); };
    return { cards: cards, unread: unread, markRead: markRead };
}
