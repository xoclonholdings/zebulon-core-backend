"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = getBalance;
exports.swap = swap;
exports.redeemSupply = redeemSupply;
exports.useZWAP = useZWAP;
// ZWAP SDK: getBalance, swap, redeemSupply, useZWAP
async function getBalance(addr) { throw new Error('Not implemented'); }
async function swap(...args) { throw new Error('Not implemented'); }
async function redeemSupply(itemId) { throw new Error('Not implemented'); }
function useZWAP() { return { getBalance, swap, redeemSupply }; }
