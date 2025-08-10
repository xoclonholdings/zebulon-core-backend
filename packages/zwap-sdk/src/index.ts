// ZWAP SDK: getBalance, swap, redeemSupply, useZWAP
export async function getBalance(addr: string): Promise<number> { throw new Error('Not implemented') }
export async function swap(...args: any[]): Promise<any> { throw new Error('Not implemented') }
export async function redeemSupply(itemId: string): Promise<any> { throw new Error('Not implemented') }
export function useZWAP() { return { getBalance, swap, redeemSupply } }
