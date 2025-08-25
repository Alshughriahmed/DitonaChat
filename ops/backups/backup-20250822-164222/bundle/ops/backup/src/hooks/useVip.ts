"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Me = {
  ok: boolean;
  isVip: boolean;
  freeAll: boolean;
  subscription?: { status?: string | null } | null;
};

type Args = { userId?: string; email?: string; customerId?: string; ttlSec?: number };

const mem = new Map<string, { at: number; data: Me }>();

function keyOf(a?: Args) {
  const u = a?.userId || "";
  const e = (a?.email || "").toLowerCase();
  const c = a?.customerId || "";
  return `me:${u}:${e}:${c}` || "me:anon";
}

async function fetchMe(a?: Args): Promise<Me> {
  const u = new URL("/api/me", window.location.origin);
  if (a?.userId) u.searchParams.set("userId", a.userId);
  if (a?.email) u.searchParams.set("email", a.email);
  if (a?.customerId) u.searchParams.set("customerId", a.customerId);
  const r = await fetch(u.toString(), { cache: "no-store" });
  if (!r.ok) throw new Error("ME_FAILED");
  return (await r.json()) as Me;
}

/**
 * useVip(): يرجع { isVip, loading, refresh, data }
 * - يراعي فلاغ freeAll من الخادم.
 * - كاش بالذاكرة على مستوى الموديول (TTL افتراضي 60s).
 */
export function useVip(a?: Args) {
  const ttl = Math.max(15, a?.ttlSec ?? 60);
  const k = keyOf(a);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Me | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const me = await fetchMe(a);
      if (mounted.current) {
        setData(me);
        mem.set(k, { at: Date.now(), data: me });
      }
    } finally {
      mounted.current && setLoading(false);
    }
  }, [k]);

  useEffect(() => {
    mounted.current = true;
    // كاش
    const hit = mem.get(k);
    if (hit && Date.now() - hit.at < ttl * 1000) {
      setData(hit.data);
      setLoading(false);
    } else {
      refresh();
    }
    return () => { mounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);

  const isVip = !!data?.isVip;
  return { isVip, loading, refresh, data };
}

export default useVip;
