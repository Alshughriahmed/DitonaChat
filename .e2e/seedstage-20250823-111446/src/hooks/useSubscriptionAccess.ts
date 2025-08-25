'use client';
import { makeSocket, type SocketT } from '@/utils/socket';

import { useEffect, useState } from "react";
type SubResp = { active: boolean; status: string | null; plan: string | null };
export function useSubscriptionAccess() {
  const [data, setData] = useState<SubResp>({ active: false, status: null, plan: null });
  useEffect(() => { (async () => {
    try { const r = await fetch("/api/subscription/status", { cache: "no-store" });
      const j = (await r.json()) as SubResp; setData(j); }
    catch { setData({ active: false, status: null, plan: null }); }
  })(); }, []);
  return { canUsePremium: data.active, subscriptionStatus: data.status, plan: data.plan };
}
export default useSubscriptionAccess;
