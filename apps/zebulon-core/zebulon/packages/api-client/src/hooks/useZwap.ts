import { useEffect, useState } from 'react'
import { Api } from '../index'
type Balance = { asset:string; amount:string }
type Item = { id:string; title:string; price:string }

export function useZwap(getToken?: any) {
  const api = new Api(process.env.NEXT_PUBLIC_ZWAP_API!, getToken)
  const [balances, setBalances] = useState<Balance[]>([])
  const [supply, setSupply] = useState<Item[]>([])
  useEffect(()=>{ api.get<Balance[]>('/balances').then(setBalances); api.get<Item[]>('/supply').then(setSupply) },[])
  return {
    balances, supply,
    swap: (p:{from:string; to:string; amount:string})=>api.post('/swap', p),
    redeem: (itemId:string)=>api.post('/supply/redeem', { itemId })
  }
}
