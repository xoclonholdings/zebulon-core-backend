"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZeta = useZeta;
var react_1 = require("react");
var index_1 = require("../index");
function useZeta(getToken) {
    var api = new index_1.Api(process.env.NEXT_PUBLIC_ZETA_API, getToken);
    var _a = (0, react_1.useState)([]), events = _a[0], setEvents = _a[1];
    var _b = (0, react_1.useState)(null), status = _b[0], setStatus = _b[1];
    (0, react_1.useEffect)(function () {
        api.get('/events').then(setEvents).catch(function () { });
        api.get('/status').then(function (data) { return setStatus(data); }).catch(function () { });
    }, []);
    var scan = function (target) { return api.post('/scan', { target: target }); };
    var toggle = function () { return api.post('/toggle', {}); };
    return { events: events, status: status, scan: scan, toggle: toggle };
}
