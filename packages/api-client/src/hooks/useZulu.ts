import { useEffect, useState } from 'react'
import { Api } from '../index'
type Card = { id:string; kind:'system'|'security'|'finance'|'tasks'|'release'|'news'; title:string; link?:string; severity?:'info'|'warn'|'alert'; createdAt:string }

export function useZulu(getToken?: any) {
  const api = new Api(process.env.NEXT_PUBLIC_ZULU_API!, getToken)
  const [cards, setCards] = useState<Card[]>([])
  const [unread, setUnread] = useState(0)
  useEffect(()=>{ api.get<Card[]>('/notifications?limit=12').then(setCards); api.get<{unread:number}>('/unread').then(r=>setUnread(r.unread)) },[])
  const markRead = (ids:string[])=>api.post('/mark-read',{ ids })
  return { cards, unread, markRead }
}
