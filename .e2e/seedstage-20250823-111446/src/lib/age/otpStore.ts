type Rec = { code: string; expires: number; attempts: number };

// ثبّت التخزين على globalThis ليصمد ضد Hot Reload في dev
const g = globalThis as any;
if (!g.__OTP_STORE__) g.__OTP_STORE__ = new Map<string, Rec>();
const mem: Map<string, Rec> = g.__OTP_STORE__;

export function put(id: string, code: string, ttlMs = 5 * 60_000) {
  mem.set(id, { code, expires: Date.now() + ttlMs, attempts: 0 });
}
export function check(id: string, code: string, maxAttempts = 5):
  "OK"|"EXPIRED"|"INVALID"|"LOCKED"|"MISSING" {
  const r = mem.get(id); if (!r) return "MISSING";
  if (Date.now() > r.expires) { mem.delete(id); return "EXPIRED"; }
  if (r.attempts >= maxAttempts) return "LOCKED";
  r.attempts++;
  if (r.code === code) { mem.delete(id); return "OK"; }
  return "INVALID";
}
