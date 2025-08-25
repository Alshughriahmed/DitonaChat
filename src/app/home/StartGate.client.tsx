"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const LS_GENDER = 'home:gender';
const LS_AGEOK  = 'home:ageOk';

export default function StartGate(){
  const [gender, setGender] = useState<string>('');
  const [ageOk, setAgeOk]   = useState<boolean>(false);

  // تحميل الحالة من LocalStorage
  useEffect(() => {
    try {
      const g = localStorage.getItem(LS_GENDER) || '';
      const a = localStorage.getItem(LS_AGEOK) === 'true';
      setGender(g); setAgeOk(a);
    } catch {}
  }, []);

  function onAgeChange(v: boolean){
    setAgeOk(v);
    try { localStorage.setItem(LS_AGEOK, v ? 'true' : 'false'); } catch {}
  }

  const enabled = useMemo(() => !!gender && !!ageOk, [gender, ageOk]);

  return (
    <div style={{display:'grid', gap:10}}>
      <label style={{display:'flex', alignItems:'center', gap:8, fontSize:14}}>
        <input
          type="checkbox"
          checked={ageOk}
          onChange={e => onAgeChange(e.target.checked)}
          aria-label="I confirm I am 18+"
        />
        I confirm I am 18+
      </label>

      <Link
        href={enabled ? "/chat" : "#"}
        aria-disabled={!enabled}
        onClick={(e) => { if(!enabled) e.preventDefault(); }}
        style={{
          pointerEvents: enabled ? 'auto' : 'none',
          opacity: enabled ? 1 : .5,
          textAlign:'center',
          padding:'12px 14px',
          borderRadius:12,
          background:'#fff',
          color:'#000',
          fontWeight:700
        }}
      >
        Start Video Chat
      </Link>
    </div>
  );
}
