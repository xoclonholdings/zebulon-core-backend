import { useEffect, useState, useCallback } from 'react'
import { Api } from '../index'

export function useZed(getToken?: ()=>Promise<string>|string) {
  const api = new Api(process.env.NEXT_PUBLIC_ZED_API!, getToken)
  const [messages, setMessages] = useState<{role:'user'|'assistant'; content:string}[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|undefined>()

  const send = useCallback(async (content: string, ctx?: any) => {
    setLoading(true); setError(undefined)
    try {
      setMessages(m => [...m, { role:'user', content }])
      const r = await api.post<{ reply:string }>('/ask', { prompt: content, context: ctx })
      setMessages(m => [...m, { role:'assistant', content: r.reply }])
    } catch (e:any) { setError(e.message) } finally { setLoading(false) }
  }, [])

  return { messages, send, loading, error }
}
