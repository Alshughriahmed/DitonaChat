'use client';

import React, {useEffect, useMemo, useState} from "react";

type Props = {
  value?: string; // ISO 3166-1 alpha-2 (e.g. "US")
  onChange?: (v: string)=>void;
  className?: string;
};

const CODES = [
  "US","GB","DE","FR","ES","IT","CA","BR","AR","MX","RU","TR","SA","KW","AE","QA","BH","OM",
  "EG","MA","DZ","TN","JO","LB","IQ","SY","YE",
  "IN","PK","BD","ID","TH","SG","JP","KR","CN","PH","VN","MY",
  "SE","NO","FI","DK","NL","BE","CH","AT","PL","PT","GR","HU","RO","BG","CZ","SK","UA","IE",
  "AU","NZ","ZA","NG","KE","GH","ET","TZ"
];

export default function CountryPicker({ value, onChange, className }: Props) {
  // منع الـSSR mismatch: لا نعرض أي نص قبل mount
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{ setMounted(true); }, []);

  const dn = useMemo(() => {
    try {
      // قد تكون غير متوفرة جزئياً في Node؛ نحن على العميل فقط هنا
      return new (Intl as any).DisplayNames?.(["en"], { type: "region" });
    } catch { return null as any; }
  }, []);

  // أسماء مستقرة بالإنجليزية مع fallback للرمز
  const items = useMemo(() => {
    const coll = new Intl.Collator("en");
    return CODES
      .map(code => ({ code, name: (dn?.of?.(code) as string) || code }))
      .sort((a,b) => coll.compare(a.name, b.name));
  }, [dn]);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(x =>
      x.name.toLowerCase().includes(s) || x.code.toLowerCase().includes(s)
    );
  }, [q, items]);

  const current = items.find(x => x.code === (value || "").toUpperCase());

  if (!mounted) {
    // زر بلا محتوى متغير أثناء SSR لتجنب التحذير
    return <div className={className || ""} />;
  }

  return (
    <div className={className || ""}>
      <button
        type="button"
        onClick={() => setOpen(v=>!v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>🌍</span>
        <span className="text-sm">
          {current ? `${current.name} (${current.code})` : "All countries"}
        </span>
      </button>

      {open && (
        <div className="absolute mt-2 z-50 w-[260px] max-h-[50vh] overflow-auto rounded-xl border border-white/10 bg-black/70 backdrop-blur p-2">
          <input
            autoFocus
            placeholder="Search…"
            value={q}
            onChange={e=>setQ(e.target.value)}
            className="w-full mb-2 px-2 py-1 rounded bg-white/10 outline-none"
          />
          <button
            className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10"
            onClick={()=>{ onChange?.(""); setOpen(false); }}
          >
            All countries
          </button>
          {filtered.map(x=>(
            <button
              key={x.code}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10"
              onClick={()=>{ onChange?.(x.code); setOpen(false); }}
            >
              {x.name} ({x.code})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
