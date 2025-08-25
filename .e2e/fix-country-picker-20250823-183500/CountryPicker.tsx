"use client";
import React, { useEffect, useMemo, useState } from "react";

export type CountryPickerProps = { value?: string; onChange?: (code: string)=>void; className?: string; };

function flag(cc: string) {
  if (!cc || cc.length !== 2) return "🌍";
  const A = 127397; return String.fromCodePoint(cc.charCodeAt(0)+A, cc.charCodeAt(1)+A);
}

export default function CountryPicker({ value = "", onChange, className = "" }: CountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  // @ts-ignore
  const codes: string[] = useMemo(() => (Intl as any)?.supportedValuesOf?.("region") || [
    "US","GB","DE","FR","ES","IT","CA","BR","AR","MX","RU","TR","SA","EG","AE","IN","PK","BD","ID","TH","SG","JP","KR","CN","AU","NZ","ZA","NG","KE","MA"
  ], []);
  const dn = useMemo(() => new Intl.DisplayNames(["en"], { type: "region" }), []);
  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    const mapped = codes.filter((c:string)=>/^[A-Z]{2}$/.test(c)).map((c) => ({ code: c, name: dn.of(c) || c }));
    const sorted = mapped.sort((a,b)=>a.name.localeCompare(b.name));
    if (!term) return sorted;
    return sorted.filter(x => x.name.toLowerCase().includes(term) || x.code.toLowerCase().includes(term));
  }, [codes, dn, q]);

  const currentName = value ? (dn.of(value) || value) : "All countries";

  useEffect(() => { if (!open) setQ(""); }, [open]);

  return (
    <div className={"relative " + className}>
      <button type="button" onClick={() => setOpen(v=>!v)}
        className="h-9 px-3 rounded-full text-xs bg-black/40 border border-white/10 backdrop-blur-sm hover:bg-black/50"
        aria-haspopup="listbox" aria-expanded={open}>
        <span className="mr-1">{value ? flag(value) : "🌍"}</span>
        <span>{currentName}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-50 w-[min(92vw,360px)] rounded-2xl bg-black/80 border border-white/10 p-2 backdrop-blur-md" role="listbox">
          <input autoFocus placeholder="Search country…" value={q} onChange={(e)=>setQ(e.target.value)}
            className="w-full mb-2 h-9 px-3 rounded-lg bg-black/40 border border-white/10 text-sm outline-none" />
          <div className="max-h-[50vh] overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              <button className={`text-left px-2 py-2 rounded-lg hover:bg-white/10 ${value===""?"bg-white/10":""}`}
                onClick={()=>{ onChange?.(""); setOpen(false); }}>🌍 All countries</button>
              {items.map(({code, name}) => (
                <button key={code} className={`text-left px-2 py-2 rounded-lg hover:bg-white/10 ${value===code?"bg-white/10":""}`}
                  onClick={()=>{ onChange?.(code); setOpen(false); }}>
                  <span className="mr-2">{flag(code)}</span>{name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
