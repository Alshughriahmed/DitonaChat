const BASE = process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";
const DISABLE = (process.env.DISABLE_REDIS || "0") === "1";

// ذاكرة محلية fallback (للتطوير فقط)
const memory = new Map<string, string>();

function enc(x: string){ return encodeURIComponent(x); }

export async function kvSet(key: string, value: any, ttlSec?: number): Promise<boolean> {
  const val = JSON.stringify(value ?? null);
  if (!DISABLE && BASE && TOKEN) {
    // set
    await fetch(`${BASE}/set/${enc(key)}/${enc(val)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` }
    }).catch(() => {});
    // TTL إن طُلِب
    if (ttlSec && ttlSec > 0) {
      await fetch(`${BASE}/expire/${enc(key)}/${Math.floor(ttlSec)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` }
      }).catch(() => {});
    }
    return true;
  } else {
    memory.set(key, val);
    if (ttlSec && ttlSec > 0) setTimeout(() => memory.delete(key), ttlSec * 1000);
    return true;
  }
}

export async function kvGet<T = any>(key: string): Promise<T | null> {
  if (!DISABLE && BASE && TOKEN) {
    const r = await fetch(`${BASE}/get/${enc(key)}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }).catch(() => null);
    if (!r || !r.ok) return null;
    const j = await r.json().catch(() => null) as any;
    const raw = (j && (j.result ?? j.value)) ?? null;
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return raw as T; }
  } else {
    const raw = memory.get(key);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return raw as T; }
  }
}
