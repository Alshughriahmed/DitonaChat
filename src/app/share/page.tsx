"use client";
import { makeSocket, type SocketT } from '@/utils/socket';

import { useEffect, useMemo, useState } from 'react';
export default function Share(){
  const [origin, setOrigin] = useState<string>('');
  useEffect(()=>{ if (typeof window !== 'undefined') setOrigin(window.location.origin); }, []);
  const routes = useMemo(()=> origin ? [
    origin,
    origin + '/rtc/socket-test',
    origin + '/match/debug',
    origin + '/chat',
    origin + '/api/health',
  ] : [], [origin]);

  const qr = origin ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(origin)}` : '';

  return (
    <main className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Share this EXACT URL</h1>
      <p className="text-sm">افتح نفس الرابط تمامًا على الكمبيوتر والجوال (نفس الدومين). لا تستخدم رابطًا مختلفًا.</p>
      <div className="rounded-2xl border p-4">
        <div className="font-mono break-all">{origin || '...'}</div>
        {qr ? <img src={qr} alt="QR" className="mt-3 rounded-2xl border" /> : null}
      </div>
      <div className="space-y-1">
        {routes.map(r => <div key={r} className="text-sm font-mono break-all">{r}</div>)}
      </div>
    </main>
  );
}
