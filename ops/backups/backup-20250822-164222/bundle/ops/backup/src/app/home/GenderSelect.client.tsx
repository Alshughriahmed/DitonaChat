"use client";

import { useEffect, useRef, useState } from "react";

type Gender = 'male' | 'female' | 'couple' | 'lgbtq' | 'unknown';
const LS_KEY = 'home:gender';

const OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'female', label: 'Female', emoji: '♀' },
  { value: 'male',   label: 'Male',   emoji: '♂' },
  { value: 'couple', label: 'Couple', emoji: '❤' },
  { value: 'lgbtq',  label: 'LGBTQ',  emoji: '🏳️‍🌈' },
];

export default function GenderSelect(){
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Gender | ''>('');
  const rootRef = useRef<HTMLDivElement>(null);

  // قراءة القيمة من localStorage بعد mount
  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_KEY) as Gender | null;
      if (v) setValue(v);
    } catch {}
  }, []);

  // إغلاق عند الضغط خارج
  useEffect(() => {
    function onDoc(e: MouseEvent){
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function apply(v: Gender){
    setValue(v);
    try { localStorage.setItem(LS_KEY, v); } catch {}
    setOpen(false);
  }

  const label = value ? `${OPTIONS.find(o=>o.value===value)?.emoji || ''} ${OPTIONS.find(o=>o.value===value)?.label || ''}` : '— Select —';

  return (
    <div ref={rootRef} style={{position:'relative'}}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          width:'100%', padding:'10px 12px', borderRadius:12,
          background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.14)',
          textAlign:'left'
        }}
      >
        <span style={{opacity: value ? 1 : .7}}>{label}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          style={{
            position:'absolute', left:0, right:0, top:'calc(100% + 6px)',
            background:'rgba(24,24,24,.98)', border:'1px solid rgba(255,255,255,.14)', borderRadius:12,
            overflow:'hidden', zIndex:20
          }}
        >
          {OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                role="option"
                aria-selected={value===opt.value}
                onClick={() => apply(opt.value)}
                style={{display:'block', width:'100%', textAlign:'left', padding:'10px 12px'}}
              >
                <span style={{opacity:.9, marginRight:8}}>{opt.emoji}</span>{opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
