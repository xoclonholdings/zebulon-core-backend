import { useEffect, useState } from 'react'
import { Api } from '../index'
type Event = { id:string; type:string; severity:'info'|'warn'|'alert'; createdAt:string; details?:any }

export function useZeta(getToken?: any) {
  const api = new Api(process.env.NEXT_PUBLIC_ZETA_API!, getToken)
  const [events, setEvents] = useState<Event[]>([])
  const [status, setStatus] = useState<{firewall:'on'|'off'}|null>(null)

  useEffect(() => {
    api.get<Event[]>('/events').then(setEvents).catch(()=>{})
    api.get<{firewall:'on'|'off'}>('/status').then((data) => setStatus(data)).catch(()=>{})
  }, [])
  const scan = (target:string) => api.post('/scan', { target })
  const toggle = () => api.post('/toggle', {})

  return { events, status, scan, toggle }
}
