"use client";
import { makeSocket, type SocketT } from '@/utils/socket';

import { useEffect, useState } from 'react';
type Status = { configured?: boolean; mock?: boolean; online?: boolean; queued?: number };
export default function MatchDebug(){
  const [st,setSt] = useState<Status|null>(null);
  const [log,setLog] = useState<string[]>([]);
  const [loading,setLoading] = useState(false);
  async function call(path: string, init?: RequestInit){
    const r = await fetch(path, init);
    const j = await r.json().catch(()=>({}));
    setLog(l => [`${path} -> ${r.status} ${JSON.stringify(j)}` , ...l].slice(0,50));
    return { ok:r.ok, j };
  }
  async function refresh(){ const {j}=await call('/api/match/status'); setSt(j as any); }
  async function enqueue(){ setLoading(true); await call('/api/match/enqueue',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({ gender:'ANY', safe:true })}); setLoading(false); refresh(); }
  async function cancel(){ setLoading(true); await call('/api/match/cancel',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({})}); setLoading(false); refresh(); }
  useEffect(()=>{ refresh(); },[]);
  return (
    <main className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Match Debug</h1>
      <div className="text-sm">status: {JSON.stringify(st)}</div>
      <div className="flex gap-3">
        <button onClick={enqueue} disabled={loading} className="px-4 py-2 rounded-2xl border">Enqueue</button>
        <button onClick={cancel} disabled={loading} className="px-4 py-2 rounded-2xl border">Cancel</button>
        <button onClick={refresh} className="px-4 py-2 rounded-2xl border">Refresh</button>
        <a className="px-4 py-2 rounded-2xl border" href="/chat">/chat</a>
      </div>
      <pre className="text-xs bg-black/5 p-3 rounded-2xl max-h-72 overflow-auto">{log.join('\n')}</pre>
    </main>
  );
}
