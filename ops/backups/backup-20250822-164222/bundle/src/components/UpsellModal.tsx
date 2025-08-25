"use client";
import React from "react";

type Plan = { code:string; label:string; price?:string };
const FALLBACK_PLANS: Plan[] = [
  { code:"daily",  label:"Daily",  price: undefined },
  { code:"weekly", label:"Weekly", price: undefined },
  { code:"monthly",label:"Monthly",price: undefined },
  { code:"yearly", label:"Yearly", price: undefined },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectPlan?: (code:string) => void;
  plans?: Plan[];
  note?: string;
};

export default function UpsellModal({ open, onClose, onSelectPlan, plans, note }: Props){
  if(!open) return null;
  const items = plans && plans.length ? plans : FALLBACK_PLANS;
  return (
    <div role="dialog" aria-modal="true" className="vip_modal_root" onClick={onClose}>
      <div className="vip_modal_card" onClick={e=>e.stopPropagation()}>
        <div className="vip_modal_head">
          <div className="vip_tag">VIP</div>
          <h3>Unlock premium features</h3>
          <p>Choose a plan to enable all VIP-only options.</p>
          {note && <p className="vip_note">{note}</p>}
        </div>
        <div className="vip_plans">
          {items.map(p=>(
            <button key={p.code} className="vip_plan" onClick={()=> onSelectPlan?.(p.code)}>
              <div className="vip_plan_label">{p.label}</div>
              <div className="vip_plan_price">{p.price ?? "—"}</div>
            </button>
          ))}
        </div>
        <div className="vip_actions">
          <a href="/subscribe" className="vip_cta">Continue to Subscribe</a>
          <button className="vip_close" onClick={onClose}>Maybe later</button>
        </div>
      </div>
      <style jsx>{`
        .vip_modal_root{position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:9999}
        .vip_modal_card{width:min(520px,92vw);background:#111;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:18px;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.5)}
        .vip_modal_head{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
        .vip_tag{display:inline-flex;align-items:center;gap:6px;background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.35);color:#FFD700;border-radius:999px;padding:2px 10px;width:max-content;font-weight:700}
        .vip_note{opacity:.85}
        .vip_plans{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
        .vip_plan{display:flex;align-items:center;justify-content:space-between;background:#181818;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:12px}
        .vip_plan:hover{transform:translateY(-1px)}
        .vip_plan_label{font-weight:700}
        .vip_plan_price{opacity:.9}
        .vip_actions{display:flex;gap:10px;justify-content:flex-end;margin-top:8px}
        .vip_cta{background:#FFD700;color:#111;padding:8px 14px;border-radius:10px;border:1px solid rgba(255,215,0,.6);font-weight:800}
        .vip_close{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.2);padding:8px 12px;border-radius:10px}
        @media (max-width:480px){.vip_plans{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
