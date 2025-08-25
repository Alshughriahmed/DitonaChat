'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const MODE = (process.env.NEXT_PUBLIC_AGE_VERIF_METHOD || 'cookie').toLowerCase();

export default function AgeGateClient() {
  const router = useRouter();
  const [gender, setGender] = useState('');
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const disabled = useMemo(() => !agree || busy, [agree, busy]);

  useEffect(() => { try {
    const g = localStorage.getItem('home:gender'); if (g) setGender(g);
  } catch {} }, []);

  async function start() {
    if (disabled) return;
    setBusy(true);
    try {
      if (MODE === 'otp') {
        const destination = prompt('Enter phone/email for OTP (dev only):') || '';
        if (!destination) { setBusy(false); return; }
        await fetch('/api/age/request', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ destination }) });
        const code = prompt('Enter 6-digit code (dev: 000000):') || '';
        if (!code) { setBusy(false); return; }
        const resp = await fetch('/api/age/confirm', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ destination, code }) });
        if (!resp.ok) { alert('OTP verification failed'); setBusy(false); return; }
      } else {
        // Cookie mode (موثوق: من السيرفر)
        const r = await fetch('/api/age/cookie', { method: 'POST' });
        if (!r.ok) { console.error('cookie endpoint failed'); }
      }
      try { if (gender) localStorage.setItem('home:gender', gender); } catch {}
      router.push('/chat');
    } catch (e) {
      console.error('[AgeGate] error', e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl w-full p-6 bg-black/30 backdrop-blur rounded-2xl text-white
                    border border-white/10 mt-24">
      <h1 className="text-2xl font-bold mb-4">Welcome to Ditona Video Chat</h1>
      <p className="opacity-80 mb-6">🔥 Unleash your wild side 🔥</p>

      <label className="block text-sm mb-2">Select your gender</label>
      <select value={gender} onChange={(e)=>setGender(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded bg-neutral-900 border border-neutral-700">
        <option value="">— Select —</option>
        <option value="f">Female</option>
        <option value="m">Male</option>
        <option value="x">Prefer not to say</option>
      </select>

      <label className="flex items-center gap-2 mb-4">
        <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
        <span>I confirm I am 18+</span>
      </label>

      <button data-testid="start-btn" onClick={start} disabled={disabled}
              className={`w-full px-4 py-3 rounded font-semibold
                          ${disabled ? 'bg-neutral-700 opacity-60 cursor-not-allowed'
                                     : 'bg-white text-black hover:bg-neutral-100'}`}>
        Start Video Chat
      </button>

      <div className="mt-4 text-xs opacity-75">
        <a href="/legal/terms" className="underline">Terms of Use</a> · <a href="/legal/privacy" className="underline">Privacy Policy</a>
      </div>
      <div className="mt-3 text-xs opacity-70">Mode: <code>{MODE}</code></div>
    </div>
  );
}
