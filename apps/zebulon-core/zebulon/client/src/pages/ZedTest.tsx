// Removed: Non-Zebulon page
import { useState } from 'react';
import { zedChat, zedAgent } from '../services/zed';

export default function ZedTest() {
  const [msg, setMsg] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function call(fn: (m: string)=>Promise<{reply:string;provider?:string}>) {
    setBusy(true); setErr(null);
    try {
      const { reply, provider } = await fn(msg);
      setLog(l => [`You: ${msg}`, `Zed (${provider ?? 'unknown'}): ${reply}`, ...l]);
      setMsg('');
    } catch (e: any) {
      setErr(e?.message || 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Zed Test</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a message…" style={{ flex:1, padding:10 }} />
        <button onClick={()=>call(zedChat)} disabled={!msg||busy}>{busy?'…':'Chat'}</button>
        <button onClick={()=>call(zedAgent)} disabled={!msg||busy}>{busy?'…':'Agent'}</button>
      </div>
      {err && <div style={{ color:'crimson', marginTop:8 }}>{err}</div>}
      <ul style={{ marginTop:16 }}>{log.map((x,i)=><li key={i}>{x}</li>)}</ul>
    </div>
  );
}
