
"use client";

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';
import { makeSocket, type SocketT } from '@/utils/socket';

import { useState } from "react";
type Plan = "PRO_WEEKLY"|"VIP_MONTHLY"|"ELITE_YEARLY"|"BOOST_ME_DAILY";

export default function BillingTestPage(){
  const [busy,setBusy]=useState<Plan|null>(null);
  const [err,setErr]=useState<string|null>(null);

  async function checkout(plan: Plan){
    setErr(null); setBusy(plan);
    try{
      const r = await fetch("/api/stripe/create-checkout-session",{method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify({plan})});
      const j = await r.json();
      if(!r.ok || !j?.url){ throw new Error(j?.error || "Failed"); }
      window.location.href = j.url as string;
    }catch(e:any){ setErr(e.message || "Error"); setBusy(null); }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Stripe Test Checkout</h1>
      <p className="text-sm opacity-80">يجب أن تكون مسجّل الدخول.</p>

      {err && <div className="text-red-600 text-sm">Error: {err}</div>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button onClick={()=>checkout("BOOST_ME_DAILY")} className="px-4 py-3 rounded-xl border shadow"
          disabled={busy!==null}>{busy==="BOOST_ME_DAILY"?"..." :"Boost (Daily)"}</button>
        <button onClick={()=>checkout("PRO_WEEKLY")} className="px-4 py-3 rounded-xl border shadow"
          disabled={busy!==null}>{busy==="PRO_WEEKLY"?"..." :"Pro (Weekly)"}</button>
        <button onClick={()=>checkout("VIP_MONTHLY")} className="px-4 py-3 rounded-xl border shadow"
          disabled={busy!==null}>{busy==="VIP_MONTHLY"?"..." :"VIP (Monthly)"}</button>
        <button onClick={()=>checkout("ELITE_YEARLY")} className="px-4 py-3 rounded-xl border shadow"
          disabled={busy!==null}>{busy==="ELITE_YEARLY"?"..." :"Elite (Yearly)"}</button>
      </div>

      <div className="text-sm pt-4">
        <a href="/account" className="underline">/account</a> — <a href="/api/auth/signin" className="underline">Sign in</a>
      </div>
    </main>
  );
}
