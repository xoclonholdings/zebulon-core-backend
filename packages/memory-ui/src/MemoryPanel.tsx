import React from 'react';
import type { EntityRef, MemoryClientOpts } from '@zebulon/memory-sdk';
export type MemoryPanelProps = {
  entity: EntityRef;
  clientOpts: MemoryClientOpts;
  defaultScope?: string;
  appName: string;
};
import { useEffect, useState } from 'react';

export function ZebulonCorePanel(props: MemoryPanelProps) {
  const [memories, setMemories] = useState<{content:string,created:number}[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Checking connection...');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const jwt = await props.clientOpts.tokenProvider();
      if (!jwt) {
        setStatus('Not authenticated. Please log in.');
        setUser(null);
        setMemories([]);
        return;
      }
      try {
        setUser(JSON.parse(atob(jwt.split('.')[1])));
      } catch { setUser(null); }
      setStatus('Connecting...');
      fetch(props.clientOpts.baseUrl + '/core', {
        headers: { 'Authorization': 'Bearer ' + jwt }
      })
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .then(data => {
          setStatus('Connected');
          setMemories(Array.isArray(data.items) ? data.items : []);
        })
        .catch(() => {
          setStatus('Unable to connect to Zebulon Core memory.');
          setMemories([]);
        });
    })();
  }, [props.clientOpts.baseUrl]);

  const addMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const jwt = await props.clientOpts.tokenProvider();
    fetch(props.clientOpts.baseUrl + '/core', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + jwt, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input.trim() })
    })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(() => {
        setInput('');
        setStatus('Memory added!');
        // Refresh
        fetch(props.clientOpts.baseUrl + '/core', {
          headers: { 'Authorization': 'Bearer ' + jwt }
        })
          .then(r => r.ok ? r.json() : Promise.reject(r))
          .then(data => setMemories(Array.isArray(data.items) ? data.items : []));
      })
      .catch(() => setStatus('Failed to add memory.'))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    setMemories([]);
    setStatus('Logged out.');
  };

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#222',padding:32,borderRadius:12,minWidth:400,color:'#fff',maxWidth:480}}>
        <h2 style={{marginBottom:16}}>Zebulon Core — {props.appName}</h2>
        <div style={{fontSize:13,marginBottom:8}}>
          {user ? (<span style={{color:'#3fdfff'}}>User: <b>{user.name||user.username||user.email||user.sub||'Unknown'}</b></span>) : null}
        </div>
        <div style={{marginBottom:8,opacity:0.8}}>{status}</div>
        <div style={{maxHeight:120,overflow:'auto',marginBottom:8}}>
          {memories.length ? memories.map((m,i) => (
            <div key={i} style={{padding:'4px 0',borderBottom:'1px solid #2323ff'}}>{m.content}</div>
          )) : <span style={{opacity:0.6}}>No persistent memory.</span>}
        </div>
        <form onSubmit={addMemory} style={{display:'flex',gap:4,marginBottom:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} type="text" placeholder="Add memory..." style={{flex:1,padding:'4px 8px',borderRadius:4,border:'1px solid #2323ff',background:'#23234a',color:'#fff'}} />
          <button type="submit" style={{background:'#3fdfff',color:'#181a2a',border:'none',borderRadius:4,padding:'4px 12px',fontWeight:'bold'}} disabled={loading}>Add</button>
        </form>
        <button onClick={logout} style={{width:'100%',background:'#2323ff',color:'#fff',border:'none',borderRadius:4,padding:'6px 0',fontSize:13}}>Logout</button>
        <button style={{marginTop:16,background:'#333',color:'#fff',border:'none',borderRadius:4,padding:'6px 0',width:'100%'}} onClick={()=>window.dispatchEvent(new CustomEvent('close-memory-panel'))}>Close</button>
      </div>
    </div>
  );
}
