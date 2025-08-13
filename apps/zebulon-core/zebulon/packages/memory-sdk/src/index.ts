export type EntityRef = { kind: 'user'|'org'|'device'|'app', id: string }
export type MemoryItem = {
  id: string; scope: string; key: string; value: any;
  tags?: string[]; pinned?: boolean; createdAt: string; updatedAt: string;
}

export type MemoryClientOpts = {
  baseUrl: string; tokenProvider: () => Promise<string>;
}

export class MemoryClient {
  constructor(private opts: MemoryClientOpts) {}
  async upsert(args: {entity: EntityRef; scope: string; key: string; value: any; tags?: string[]; ttl?: number}) { return Promise.resolve(); }
  async query(args: {entity: EntityRef; scope?: string; key?: string; tags?: string[]; text?: string; topK?: number}): Promise<MemoryItem[]> { return Promise.resolve([]); }
  async list(args: {entity: EntityRef; scope?: string; limit?: number}): Promise<MemoryItem[]> { return Promise.resolve([]); }
  async pin(id: string) { return Promise.resolve(); }
  async unpin(id: string) { return Promise.resolve(); }
  async event(args: {entity: EntityRef; app: string; type: string; payload: any}) { return Promise.resolve(); }
  subscribe(entity: EntityRef, onMsg:(m: MemoryItem|{event:string})=>void): ()=>void { /* SSE */ return () => {/*close*/}; }
}

import { useEffect, useMemo, useRef, useState } from 'react'
export function useMemory(entity: EntityRef, opts: MemoryClientOpts){
  const client = useMemo(()=>new MemoryClient(opts),[opts.baseUrl])
  const [items,setItems]=useState<MemoryItem[]>([])
  const stopRef = useRef<()=>void>(()=>{})
  useEffect(()=>{
    stopRef.current = client.subscribe(entity,(msg:any)=>{
      // merge updates
    })
    return ()=> stopRef.current?.()
  },[entity])
  return {
    client,
    items,
    remember: (p: {scope:string;key:string;value:any;tags?:string[];ttl?:number})=>client.upsert({entity,...p}),
    recall: (p: {scope?:string;key?:string;tags?:string[];text?:string;topK?:number})=>client.query({entity,...p}),
    pin:(id:string)=>client.pin(id), unpin:(id:string)=>client.unpin(id)
  }
}
