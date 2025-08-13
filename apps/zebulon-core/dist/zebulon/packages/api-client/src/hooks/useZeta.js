"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZeta = useZeta;
const react_1 = require("react");
const index_1 = require("../index");
function useZeta(getToken) {
    const api = new index_1.Api(process.env.NEXT_PUBLIC_ZETA_API, getToken);
    const [events, setEvents] = (0, react_1.useState)([]);
    const [status, setStatus] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        api.get('/events').then(setEvents).catch(() => { });
        api.get('/status').then((data) => setStatus(data)).catch(() => { });
    }, []);
    const scan = (target) => api.post('/scan', { target });
    const toggle = () => api.post('/toggle', {});
    return { events, status, scan, toggle };
}
