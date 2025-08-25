import fs from "fs";
import path from "path";

export type OtpRecord = { hash: string; expiresAt: number; attempts: number };

const MEM = new Map<string, OtpRecord>();
const FILE = "/tmp/otp_store.json";

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";
const REDIS_DISABLED = process.env.DISABLE_REDIS === "1" || !REST_URL || !REST_TOKEN;

function readFileStore(): Record<string, OtpRecord> {
  try {
    const s = fs.readFileSync(FILE, "utf8");
    return JSON.parse(s || "{}");
  } catch { return {}; }
}
function writeFileStore(data: Record<string, OtpRecord>) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data), "utf8");
  } catch {}
}

async function redisGet(key: string): Promise<OtpRecord | null> {
  if (REDIS_DISABLED) return null;
  try {
    const url = `${REST_URL}/get/${encodeURIComponent(key)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${REST_TOKEN}` }, cache: "no-store" });
    if (!res.ok) return null;
    const j = await res.json().catch(() => null) as any;
    if (!j || typeof j.result !== "string") return null;
    const val = JSON.parse(j.result);
    if (!val || typeof val !== "object") return null;
    return val as OtpRecord;
  } catch { return null; }
}
async function redisSet(key: string, val: OtpRecord, ttlSec: number): Promise<boolean> {
  if (REDIS_DISABLED) return false;
  try {
    // Upstash REST: PSETEX with ms TTL via pipeline API
    const body = [{ command: ["SET", key, JSON.stringify(val), "EX", String(ttlSec)] }];
    const res = await fetch(REST_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch { return false; }
}
async function redisDel(key: string): Promise<void> {
  if (REDIS_DISABLED) return;
  try {
    const body = [{ command: ["DEL", key] }];
    await fetch(REST_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {}
}

export async function otpGet(key: string): Promise<OtpRecord | null> {
  // Prefer Redis
  const r = await redisGet(key);
  const now = Date.now();
  if (r) {
    if (r.expiresAt <= now) { await otpDel(key); return null; }
    return r;
  }
  // File fallback
  const data = readFileStore();
  let rec: OtpRecord | null = (data[key] as OtpRecord) || null;
  if (rec) {
    if (rec.expiresAt <= now) { delete data[key]; writeFileStore(data); rec = null; }
    else return rec;
  }
  // Memory fallback
  const m = MEM.get(key) || null;
  if (m && m.expiresAt > now) return m;
  if (m && m.expiresAt <= now) MEM.delete(key);
  return null;
}

export async function otpSet(key: string, rec: OtpRecord, ttlSec: number): Promise<boolean> {
  const okRedis = await redisSet(key, rec, ttlSec);
  if (okRedis) return true;
  // File
  const data = readFileStore();
  data[key] = rec;
  writeFileStore(data);
  // Memory
  MEM.set(key, rec);
  return true;
}

export async function otpDel(key: string): Promise<void> {
  await redisDel(key).catch(()=>{});
  const data = readFileStore();
  if (data[key]) { delete data[key]; writeFileStore(data); }
  MEM.delete(key);
}

// Aliases for compatibility
export const get = otpGet;
export const set = otpSet;
export const del = otpDel;
