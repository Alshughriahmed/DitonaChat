"use client";
import React, {useEffect, useMemo, useState} from "react";

type Gender = "male"|"female"|"couple"|"lgbtq";
type GenderPref = "any"|"male"|"female"|"couple"|"lgbtq";

type Prefs = {
  name: string;
  avatarUrl: string;
  introMsg: string;
  hideLocation: boolean;
  myGender: Gender;            // جنس المستخدم نفسه (حر للجميع)
  matchGender: GenderPref;     // تفضيل المطابقة (VIP لغير "All")
  genderPref?: GenderPref;     // توافق خلفي
  socials: { instagram?: string; snapchat?: string; facebook?: string; };
};

const defaults: Prefs = {
  name: "", avatarUrl: "", introMsg: "",
  hideLocation: false, myGender: "male", matchGender: "any",
  socials: {}
};

function loadPrefs(): Prefs {
  if (typeof window==="undefined") return defaults;
  try {
    const raw = localStorage.getItem("user:prefs");
    const parsed = raw ? JSON.parse(raw) : {};
    const matchGender: GenderPref = parsed.matchGender ?? parsed.genderPref ?? "any";
    const myGender: Gender = parsed.myGender ?? "male";
    return {...defaults, ...parsed, matchGender, myGender};
  } catch { return defaults; }
}
function savePrefs(p: Prefs){ try{ localStorage.setItem("user:prefs", JSON.stringify(p)); }catch{} }

export default function SettingsPage(){
    const [browserLocale, setBrowserLocale] = useState('en-US');
  useEffect(() => {
    try {
      const loc = typeof navigator !== 'undefined' && (navigator as any).language ? (navigator as any).language : 'en-US';
      setBrowserLocale(loc);
    } catch {}
  }, []);
// VIP (محلي)
  const [vip, setVip] = useState<boolean>(() => {
    if (typeof window==="undefined") return false;
    return localStorage.getItem("user:vip")==="1";
  });
  useEffect(()=>{ try{ localStorage.setItem("user:vip", vip?"1":"0"); }catch{} },[vip]);

  // التفضيلات
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  useEffect(()=>savePrefs(prefs), [prefs]);

  // نافذة الترقية
  const [showUpgrade, setShowUpgrade] = useState(false);
  const openUpgrade = () => setShowUpgrade(true);
  const closeUpgrade = () => setShowUpgrade(false);

  // بوابة VIP: ما نعطّل العناصر — إن لم يكن VIP نفتح نافذة ترقية
  function guardVip(doIt:()=>void){ if (vip) doIt(); else openUpgrade(); }

  // setters
  const setName = (v:string)=> setPrefs(p=>({...p,name:v}));
  const setAvatar = (v:string)=> setPrefs(p=>({...p,avatarUrl:v}));
  const setIntro = (v:string)=> guardVip(()=> setPrefs(p=>({...p,introMsg:v})));
  const setMyGender = (v:Gender)=> setPrefs(p=>({...p,myGender:v}));
  const setMatchGender = (v:GenderPref)=> {
    if (v==="any") { setPrefs(p=>({...p,matchGender:v, genderPref:v})); return; }
    guardVip(()=> setPrefs(p=>({...p,matchGender:v, genderPref:v})));
  };
  const setHideLocation = (v:boolean)=> guardVip(()=> setPrefs(p=>({...p,hideLocation:v})));
  const setSocial = (k:keyof Prefs["socials"], v:string)=> guardVip(()=> setPrefs(p=>({...p,socials:{...p.socials,[k]:v}})));

  const browserLang = useMemo(()=> (typeof navigator!=="undefined"? browserLocale : "en-US"),[]);

  return (
    <div className="root">
      <header className="topbar">
        <h1>Settings</h1>
        <div className="top-actions">
          <button className="btn vip" onClick={openUpgrade}>Get VIP</button>
          <label className="simvip">
            <input type="checkbox" checked={vip} onChange={e=>setVip(e.target.checked)} />
            <span>Simulate VIP (dev)</span>
          </label>
        </div>
      </header>

      <main className="content">
        {/* Profile */}
        <section className="card">
          <h2>Profile</h2>
          <div className="row">
            <div className="col">
              <label className="field">
                <span className="label">Display name</span>
                <input className="input" value={prefs.name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
              </label>
              <label className="field">
                <span className="label">Avatar URL</span>
                <input className="input" value={prefs.avatarUrl} onChange={e=>setAvatar(e.target.value)} placeholder="https://…" />
              </label>
            </div>
            <div className="avatar-col">
              <div className="avatar">
                {prefs.avatarUrl
                  ? <img src={prefs.avatarUrl} alt="avatar" />
                  : <span>No image</span>
                }
              </div>
            </div>
          </div>
        </section>

        {/* General */}
        <section className="card">
          <h2>General</h2>
          <div className="row row-plain">
            <div className="muted">Browser language</div>
            <div className="mono">{browserLang}</div>
          </div>
        </section>

        {/* Privacy */}
        <section className="card">
          <h2>Privacy</h2>
          <label className="row row-click">
            <span>Hide my location <span className="muted">(VIP)</span></span>
            <input type="checkbox" checked={prefs.hideLocation} onChange={e=>setHideLocation(e.target.checked)} />
          </label>
        </section>

        {/* Gender & matching */}
        <section className="card">
          <h2>Gender & match preferences</h2>

          <label className="field">
            <span className="label">My gender</span>
            <select className="input" value={prefs.myGender} onChange={e=>setMyGender(e.target.value as Gender)}>
              <option value="male">Male ♂</option>
              <option value="female">Female ♀</option>
              <option value="couple">Couple ❤</option>
              <option value="lgbtq">LGBTQ 🏳️‍🌈</option>
            </select>
          </label>

          <label className="field">
            <span className="label">Preferred match gender</span>
            <select className="input" value={prefs.matchGender} onChange={e=>setMatchGender(e.target.value as GenderPref)}>
              <option value="any">All</option>
              <option value="male">Male (VIP)</option>
              <option value="female">Female (VIP)</option>
              <option value="couple">Couple (VIP)</option>
              <option value="lgbtq">LGBTQ (VIP)</option>
            </select>
          </label>
        </section>

        {/* Extras */}
        <section className="card">
          <h2>Profile extras</h2>
          <label className="field">
            <span className="label">Intro message <span className="muted">(VIP)</span></span>
            <textarea className="input textarea"
              placeholder="Shown to your match when connected…"
              value={prefs.introMsg}
              onChange={e=>setIntro(e.target.value)}
              onFocus={()=>!vip && openUpgrade()}
            />
          </label>

          <div className="grid3">
            <label className="field">
              <span className="label">Instagram (VIP)</span>
              <input className="input" placeholder="https://instagram.com/…"
                value={prefs.socials.instagram||""}
                onChange={e=>setSocial("instagram", e.target.value)}
                onFocus={()=>!vip && openUpgrade()}
              />
            </label>
            <label className="field">
              <span className="label">Snapchat (VIP)</span>
              <input className="input" placeholder="https://snapchat.com/add/…"
                value={prefs.socials.snapchat||""}
                onChange={e=>setSocial("snapchat", e.target.value)}
                onFocus={()=>!vip && openUpgrade()}
              />
            </label>
            <label className="field">
              <span className="label">Facebook (VIP)</span>
              <input className="input" placeholder="https://facebook.com/…"
                value={prefs.socials.facebook||""}
                onChange={e=>setSocial("facebook", e.target.value)}
                onFocus={()=>!vip && openUpgrade()}
              />
            </label>
          </div>
        </section>

        <div className="muted small">Changes are saved locally.</div>
      </main>

      {showUpgrade && (
        <div className="modal">
          <div className="modal-card">
            <div className="modal-head">
              <h3>Upgrade to VIP</h3>
              <button className="btn" onClick={closeUpgrade} aria-label="Close">✕</button>
            </div>
            <p className="muted">
              Unlock advanced matching (gender & country), privacy controls, intro message, and social links.
            </p>
            <div className="prices">
              <div className="price"><span>Daily</span><b>$3.99</b></div>
              <div className="price"><span>Weekly</span><b>$7.99</b></div>
              <div className="price"><span>Monthly</span><b>$19.99</b></div>
              <div className="price"><span>Yearly</span><b>$99.99</b></div>
            </div>
            <div className="actions">
              <button className="btn" onClick={closeUpgrade}>Later</button>
              <a className="btn vip" href="/subscribe">Continue to Subscribe</a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .root{
          height: 100svh;
          display:flex; flex-direction:column;
          background:#0b0b0b; color:#fff;
          -webkit-tap-highlight-color: transparent;
        }
        .topbar{
          position:sticky; top:0; z-index:10;
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 16px; background:rgba(0,0,0,0.7);
          backdrop-filter: blur(6px); border-bottom:1px solid rgba(255,255,255,.08);
        }
        .topbar h1{ font-size:18px; font-weight:700; }
        .top-actions{ display:flex; gap:10px; align-items:center; }
        .simvip{ display:flex; gap:6px; align-items:center; font-size:12px; opacity:.8; }

        .content{
          flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch;
          padding:16px; gap:12px; display:flex; flex-direction:column;
        }
        .card{
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
          border-radius:16px; padding:12px; display:flex; flex-direction:column; gap:10px;
        }
        .card h2{ font-size:16px; font-weight:700; margin-bottom:4px; }
        .row{ display:flex; gap:12px; align-items:flex-start; }
        .row-plain{ justify-content:space-between; align-items:center; }
        .row-click{ justify-content:space-between; padding:8px 10px; border-radius:10px; background:rgba(255,255,255,.03); }
        .col{ flex:1; display:flex; flex-direction:column; gap:10px; }
        .avatar-col{ width:96px; display:flex; justify-content:center; }
        .avatar{ width:80px; height:80px; border-radius:50%; overflow:hidden;
                 background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.15);
                 display:grid; place-items:center; font-size:12px; opacity:.8; }
        .avatar img{ width:100%; height:100%; object-fit:cover; }

        .field{ display:flex; flex-direction:column; gap:6px; }
        .label{ font-size:13px; opacity:.85; }
        .input{
          width:100%; border-radius:10px; border:1px solid rgba(255,255,255,.15);
          background:rgba(0,0,0,.35); color:#fff; padding:10px 12px; outline:none;
        }
        .textarea{ min-height:90px; resize:vertical; }
        .grid3{ display:grid; grid-template-columns:1fr; gap:10px; }
        @media (min-width:680px){ .grid3{ grid-template-columns:repeat(3,1fr); } }

        .btn{
          border:1px solid rgba(255,255,255,.2);
          background:rgba(255,255,255,.1);
          color:#fff; border-radius:10px; padding:8px 12px; cursor:pointer;
        }
        .btn.vip{ border-color:rgba(255,215,0,.4); color:#FFD700; background:rgba(255,215,0,.1); font-weight:700; }
        .muted{ opacity:.75; }
        .small{ font-size:12px; }
        .mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

        .modal{ position:fixed; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.6); backdrop-filter:blur(4px); z-index:50; }
        .modal-card{ width:min(92vw,560px); background:#111; border:1px solid rgba(255,215,0,.3); border-radius:16px; padding:14px; }
        .modal-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
        .prices{ display:grid; gap:8px; margin-top:8px; }
        .price{ display:flex; justify-content:space-between; padding:10px; border:1px solid rgba(255,255,255,.1); border-radius:10px; background:rgba(255,255,255,.05); }
        .actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:10px; }
      `}</style>
    </div>
  );
}
