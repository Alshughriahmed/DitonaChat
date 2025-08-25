export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
import type { Viewport } from 'next';
export const dynamic = 'force-static';

import Link from "next/link";
import GenderSelect from "./GenderSelect.client";
import StartGate from "./StartGate.client";

export default function HomePage() {
  // ملاحظة: لا نستخدم Hooks هنا (Server Component) لتفادي أي Hydration issues
  return (
    <main
      style={{
        minHeight: '100svh',
        position: 'relative',
        overflow: 'hidden',
        // خلفية hero.webp + تدرّج احتياطي لو غابت الصورة
        backgroundImage: 'linear-gradient(180deg, rgba(10,10,10,.9), rgba(10,10,10,.9)), url("/landing/hero.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff'
      }}
    >
      {/* Header: Login/Sign up + +18 badge */}
      <header style={{display:'flex',justifyContent:'flex-end',gap:12,alignItems:'center',padding:'16px 20px'}}>
        <span style={{padding:'2px 8px',border:'1px solid #ff4d4f',borderRadius:999,color:'#ff4d4f',fontWeight:600,fontSize:12}}>18+</span>
        <Link href="/api/auth/signin" className="hover:underline">Login</Link>
        <Link href="/api/auth/signin" className="hover:underline">Sign up</Link>
      </header>

      {/* Center card */}
      <section style={{display:'grid',placeItems:'center',padding:'24px'}}>
        <div
          style={{
            width:'min(560px,92vw)',
            background:'rgba(20,20,20,.75)',
            border:'1px solid rgba(255,255,255,.08)',
            backdropFilter:'blur(6px)',
            borderRadius:16,
            padding:'24px 20px',
            boxShadow:'0 8px 40px rgba(0,0,0,.35)'
          }}
        >
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:4,textAlign:'center'}}>Welcome to Ditona Video Chat</h1>
          <p style={{textAlign:'center',opacity:.9,marginBottom:16}}>🔥 Unleash your wild side 🔥</p>

          {/* عناصر Client معزولة لمنع أي Hydration mismatch */}
          <div style={{display:'grid',gap:12}}>
            <label style={{fontSize:14,opacity:.9}}>Select your gender</label>
            <GenderSelect />
            <StartGate />
          </div>

          {/* روابط قانونية تحت الكارد */}
          <p style={{marginTop:14,textAlign:'center',opacity:.85,fontSize:13}}>
            <Link href="/legal/terms">Terms of Use</Link> · <Link href="/legal/privacy">Privacy Policy</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
