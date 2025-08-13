"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZwap = useZwap;
const react_1 = require("react");
const index_1 = require("../index");
function useZwap(getToken) {
    const api = new index_1.Api(process.env.NEXT_PUBLIC_ZWAP_API, getToken);
    const [balances, setBalances] = (0, react_1.useState)([]);
    const [supply, setSupply] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => { api.get('/balances').then(setBalances); api.get('/supply').then(setSupply); }, []);
    return {
        balances, supply,
        swap: (p) => api.post('/swap', p),
        redeem: (itemId) => api.post('/supply/redeem', { itemId })
    };
}
