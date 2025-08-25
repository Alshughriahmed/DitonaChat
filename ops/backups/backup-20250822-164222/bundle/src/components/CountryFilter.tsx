"use client";
import React, {useEffect, useMemo, useState} from "react";

type Props = {
  selected: string[];                       // أمثلة: ["ALL"] أو ["DE"] أو ["DE","FR","US"]
  onChange: (codes: string[]) => void;      // ترجع أكواد ISO-2 دائماً؛ "ALL" خاص
  isVip: boolean;
  requireVip: (feature: string) => void;
};

function flagEmoji(code: string){
  if (!code || code.length !== 2) return "🌐";
  const A = 127397; const up = code.toUpperCase();
  return String.fromCodePoint(up.charCodeAt(0)+A, up.charCodeAt(1)+A);
}

async function detectMyCountry(): Promise<string|null>{
  // 1) Geolocation -> BigDataCloud (بدون مفتاح)
  try{
    const pos = await new Promise<GeolocationPosition>((res,rej)=>
      navigator.geolocation.getCurrentPosition(res,rej,{enableHighAccuracy:false, timeout:10000, maximumAge:600000})
    );
    const {latitude, longitude} = pos.coords;
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const r = await fetch(url); const j = await r.json();
    const c = (j.countryCode || j.countryCodeAlpha2 || "").toUpperCase();
    if (/^[A-Z]{2}$/.test(c)) return c;
  }catch{}
  // 2) fallback: لغة المتصفح
  try{
    const lang = (navigator.languages && navigator.languages[0]) || navigator.language || "en-US";
    // @ts-ignore
    const loc = new Intl.Locale(lang).maximize?.(); // قد لا تتوفر بكل المتصفحات
    // @ts-ignore
    const reg = (loc && loc.region) || lang.split("-")[1];
    if (reg && /^[A-Z]{2}$/.test(reg)) return reg.toUpperCase();
  }catch{}
  return null;
}

export default function CountryFilter({ selected, onChange, isVip, requireVip }: Props){
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [myCode, setMyCode] = useState<string|null>(null);
  const [detecting, setDetecting] = useState(false);

  const codes = useMemo<string[]>(()=>{
    // كل الدول من المتصفح، وإلا fallback مختصر
    // @ts-ignore
    const sup = Intl.supportedValuesOf?.("region") as string[]|undefined;
    const base = sup?.filter(c=>/^[A-Z]{2}$/.test(c)) ?? [
      "US","GB","DE","FR","ES","IT","NL","SE","NO","DK","FI","PL","PT","IE","CH","AT",
      "BE","LU","LI","CZ","SK","HU","RO","BG","GR","TR","RU","UA","LT","LV","EE",
      "CA","MX","BR","AR","CL","CO","PE","VE","UY","PY","BO","EC",
      "MA","DZ","TN","EG","SA","AE","QA","KW","OM","BH","JO","LB","IQ","IR","IL","SY","YE",
      "ZA","NG","KE","ET","GH","CI","SN","CM","UG","TZ","SD","DZ",
      "IN","PK","BD","LK","NP","AF",
      "ID","MY","SG","TH","VN","PH","KH","LA","MM","BN","TL",
      "JP","KR","CN","TW","HK","MO",
      "AU","NZ"
    ];
    const dn = ((Intl as any).DisplayNames ? new (Intl as any).DisplayNames(navigator.languages, {type:"region"}) : null);
    return [...new Set(base)].sort((a,b)=>{
      const na = dn?.of?.(a) ?? a, nb = dn?.of?.(b) ?? b;
      return String(na).localeCompare(String(nb));
    });
  }, []);

  const dnOf = (code:string) => {
    if (code==="ALL") return "All countries";
    const dn = ((Intl as any).DisplayNames ? new (Intl as any).DisplayNames(navigator.languages, {type:"region"}) : null);
    return dn?.of?.(code) ?? code;
  };

  const filtered = useMemo(()=>{
    const needle = q.trim().toLowerCase();
    if (!needle) return codes;
    return codes.filter(c => dnOf(c).toLowerCase().includes(needle));
  }, [q, codes]);

  // عرض على الحبة: All / My / دولة واحدة / عدة
  const label = useMemo(()=>{
    const real = selected.filter(c=>c!=="ALL");
    if (selected.length===1 && selected[0]==="ALL") return "All";
    if (real.length===1){
      if (myCode && real[0]===myCode) return "My country";
      return dnOf(real[0]);
    }
    if (real.length===0) return "All";
    return `${real.length} selected`;
  }, [selected, myCode]);

  const active = !(selected.length===1 && selected[0]==="ALL");

  const toggleCodeVip = (code:string) => {
    // VIP يختار عدة دول، ALL حصري
    let set = new Set(selected.filter(c=>c!=="ALL"));
    if (set.has(code)) set.delete(code); else set.add(code);
    const next = set.size===0 ? ["ALL"] : Array.from(set);
    onChange(next);
  };

  const choose = async (code:string)=>{
    if (code==="ALL"){ onChange(["ALL"]); return; }

    if (!isVip){
      // لغير VIP مسموح فقط All أو My country
      // إن كان اختياره يساوي myCode نسمح به
      if (!myCode){
        setDetecting(true);
        const c = await detectMyCountry();
        setDetecting(false);
        if (c){ setMyCode(c); if (code===c){ onChange([c]); setOpen(false); return; } }
      }else{
        if (code===myCode){ onChange([code]); setOpen(false); return; }
      }
      requireVip("Choose specific country");
      return;
    }
    // VIP
    toggleCodeVip(code);
  };

  const chooseMy = async ()=>{
    setDetecting(true);
    const c = await detectMyCountry();
    setDetecting(false);
    if (!c){ alert("Allow location to detect your country."); return; }
    setMyCode(c);
    if (!isVip) { onChange([c]); setOpen(false); return; }
    toggleCodeVip(c);
  };

  return (
    <div className="cf-wrap">
      <button className={`pill ${active?"active":""}`} onClick={()=>setOpen(v=>!v)} aria-haspopup="listbox" aria-expanded={open}>
        <span className="flag">{selected.length===1 && selected[0]!=="ALL" ? flagEmoji(selected[0]) : "🌐"}</span>
        <span className="label">{label}</span>
        <span className="caret">▾</span>
      </button>

      {open && (
        <div className="panel" role="listbox">
          <div className="search">
            <input placeholder="Search country..." value={q} onChange={e=>setQ(e.target.value)} />
            <button onClick={()=>setQ("")} aria-label="Clear">✕</button>
          </div>

          <div className="opt" onClick={()=>choose("ALL")}>
            <span className="flag">🌐</span>
            <span className="name">All countries</span>
            {selected.length===1 && selected[0]==="ALL" ? <span className="check">✓</span> : null}
          </div>

          <div className="opt" onClick={chooseMy}>
            <span className="flag">📍</span>
            <span className="name">{detecting ? "Detecting…" : "My country"}</span>
            {myCode && selected.includes(myCode) ? <span className="check">✓</span> : null}
          </div>

          <div className="list">
            {filtered.map(code=>{
              const checked = selected.includes(code);
              return (
                <div key={code} className="opt" onClick={()=>choose(code)} data-code={code}>
                  <span className="flag">{flagEmoji(code)}</span>
                  <span className="name">{dnOf(code)}</span>
                  {checked ? <span className="check">✓</span> : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .cf-wrap{ position:relative; }
        .pill{ display:inline-flex; align-items:center; gap:8px; padding:8px 10px; border-radius:999px;
               border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.06); color:#fff; font-size:13px; }
        .pill.active{ outline:2px solid rgba(255,255,255,.35); }
        .flag{ width:18px; text-align:center; }
        .caret{ opacity:.7 }
        .panel{ position:absolute; right:0; top:calc(100% + 8px); z-index:50; width:min(86vw, 380px); max-height:60vh; overflow:auto;
                background:#0f1115; color:#fff; border:1px solid rgba(255,255,255,.15); border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.4); }
        .search{ display:flex; gap:8px; padding:10px; position:sticky; top:0; background:#0f1115; }
        .search input{ flex:1; background:#151823; color:#fff; border:1px solid rgba(255,255,255,.12); border-radius:8px; padding:8px 10px; }
        .search button{ background:#151823; border:1px solid rgba(255,255,255,.12); color:#fff; border-radius:8px; padding:8px 10px; }
        .opt{ display:flex; align-items:center; gap:10px; padding:10px 12px; cursor:pointer; }
        .opt:hover{ background:rgba(255,255,255,.06); }
        .check{ margin-left:auto; opacity:.85 }
      `}</style>
    </div>
  );
}
