"use client";

import { useState } from "react";

async function startCheckout(setLoading: (v:boolean)=>void) {
  try {
    setLoading(true);
    const res = await fetch("/api/stripe/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // يستعمل STRIPE_PRICE_VIP_MONTHLY من .env إن لم تُمرَّر priceId
    });
    const j = await res.json();
    if (j?.url) window.location.href = j.url;
    else alert("Stripe error: " + (j?.error || "UNKNOWN"));
  } catch (e: any) {
    alert("Failed to start checkout");
  } finally {
    setLoading(false);
  }
}

export default function SubscribePage(){
  const [loading, setLoading] = useState(false);
  return (
    <main style={{minHeight:'100svh',display:'grid',placeItems:'center',background:'#0b0b0b',color:'#fff'}}>
      <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',padding:24,borderRadius:16,width:'min(560px,92vw)'}}>
        <h1 style={{fontSize:24,fontWeight:800,marginBottom:8}}>Upgrade to VIP</h1>
        <p style={{opacity:.85,marginBottom:16}}>Priority matching, Beauty & Previous features.</p>
        <button
          onClick={() => startCheckout(setLoading)}
          disabled={loading}
          style={{padding:'12px 16px',borderRadius:12,background:'#fff',color:'#000',fontWeight:800,opacity:loading?.8:1}}
        >
          {loading ? "Redirecting..." : "Go to Checkout"}
        </button>
      </div>
    </main>
  );
}
