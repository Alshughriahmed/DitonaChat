'use client';
import React, { useEffect, useState } from 'react';
import { loadPrefs } from '@/utils/prefs';

type Plan = { id: 'day'|'week'|'month'|'year'; label: string; price: string; best?: boolean };

const DEFAULT_PLANS: Plan[] = [
  { id: 'day',   label: 'Boost Me — 1 Day Access', price: '€1.49' },
  { id: 'week',  label: 'Pro Weekly',              price: '€5.99' },
  { id: 'month', label: 'VIP Monthly',             price: '€16.99', best: true },
  { id: 'year',  label: 'Elite Yearly',            price: '€99.99' },
];

export function VipModal({
  open, onClose, feature
}: { open: boolean; onClose: () => void; feature: string }) {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  useEffect(()=> {
    // يمكن لاحقًا قراءة الأسعار من window.__VIP_PLANS__ أو localStorage
    const raw = (globalThis as any).__VIP_PLANS__;
    if (Array.isArray(raw)) setPlans(raw);
  }, []);
  if (!open) return null;
  return (
    <div className="vip-backdrop" role="dialog" aria-modal="true">
      <div className="vip-card">
        <h3>VIP required</h3>
        <p>This feature is for VIP members: <b>{feature}</b>.</p>
        <ul className="plans">
          {plans.map(p=>(
            <li key={p.id} className={p.best?'best':''}>
              <span>{p.label}</span><b>{p.price}</b>
            </li>
          ))}
        </ul>
        <div className="actions">
          <a className="primary" href="/subscribe">Get VIP</a>
          <button onClick={onClose}>Maybe later</button>
        </div>
      </div>
      <style jsx>{`
        .vip-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:9999}
        .vip-card{width:min(92vw,440px);background:#0f1115;border:1px solid rgba(255,255,255,.12);
          border-radius:16px;padding:16px;color:#fff}
        h3{margin:0 0 6px;font-size:18px}
        p{opacity:.9}
        .plans{list-style:none;margin:12px 0;padding:0;display:grid;gap:8px}
        .plans li{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:12px;
          border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04)}
        .plans li.best{outline:2px solid #ffd400}
        .actions{display:flex;gap:8px;justify-content:flex-end}
        .primary{background:#e01d1d;color:#fff;border-radius:10px;padding:8px 12px;border:1px solid rgba(255,255,255,.15);text-decoration:none}
        button{background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:10px;color:#fff;padding:8px 12px}
      `}</style>
    </div>
  );
}

/** hook: gate VIP — ينفّذ الإجراء إن كان VIP، وإلا يفتح الـModal */
export function useVipGate() {
  const isVip = !!(typeof window!=='undefined' && localStorage.getItem('dev:vip'));
  const [modal, setModal] = useState<{open:boolean; feature:string}>({open:false, feature:''});
  const gate = (feature: string, cb: () => void) => {
    if (isVip) cb();
    else setModal({open:true, feature});
  };
  const modalEl = <VipModal open={modal.open} feature={modal.feature} onClose={()=>setModal({open:false, feature:''})}/>;
  return { isVip, gate, modalEl };
}
