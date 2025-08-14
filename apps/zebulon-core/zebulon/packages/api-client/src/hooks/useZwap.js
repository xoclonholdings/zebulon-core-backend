"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZwap = useZwap;
var react_1 = require("react");
var index_1 = require("../index");
function useZwap(getToken) {
    var api = new index_1.Api(process.env.NEXT_PUBLIC_ZWAP_API, getToken);
    var _a = (0, react_1.useState)([]), balances = _a[0], setBalances = _a[1];
    var _b = (0, react_1.useState)([]), supply = _b[0], setSupply = _b[1];
    (0, react_1.useEffect)(function () { api.get('/balances').then(setBalances); api.get('/supply').then(setSupply); }, []);
    return {
        balances: balances,
        supply: supply,
        swap: function (p) { return api.post('/swap', p); },
        redeem: function (itemId) { return api.post('/supply/redeem', { itemId: itemId }); }
    };
}
