"use client";
import { useEffect, useState } from "react";

export type Plan = "free"|"pro_weekly"|"vip_monthly"|"elite_yearly"|"boost_daily"|"mock";
export function useSubscriptionAccess() {
  const [isVip, setVip] = useState(false);
  const [plan, setPlan] = useState<Plan>("free");
  useEffect(() => {
    let abort = false;
    const demo = (typeof window !== "undefined") && (localStorage.getItem("ditona.demo") === "1");
    if (demo) { setVip(true); setPlan("mock"); return; }
    (async () => {
      try {
        const r = await fetch("/api/subscription/status", { cache: "no-store" });
        if (!r.ok) throw new Error("status not ok");
        const j = await r.json();
        if (abort) return;
        setVip(!!j?.active); setPlan((j?.plan as Plan) || "free");
      } catch {
        setVip(false); setPlan("free");
      }
    })();
    return () => { abort = true; };
  }, []);
  return { isVip, plan, enableDemo: () => localStorage.setItem("ditona.demo","1"), disableDemo: () => localStorage.removeItem("ditona.demo") };
}
