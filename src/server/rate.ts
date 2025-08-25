import { NextResponse } from "next/server";

type Bucket = { tokens: number; updatedAt: number };
const GLOBAL: any = globalThis as any;
GLOBAL.__RATE__ ||= new Map<string, Bucket>();

function keyFromReq(req: Request, scope: string) {
  const xf = req.headers.get("x-forwarded-for") || "";
  const ip = (req.headers.get("x-real-ip") || xf.split(",")[0] || "local").trim();
  return `${ip}::${scope}`;
}

export function withRateLimit<T extends (req: Request) => Promise<Response>>(handler: T, opts?: {
  limit?: number;            // عدد الطلبات
  windowMs?: number;         // نافذة الزمن
  scope?: string;            // نطاق مستقل لكل مسار
}) {
  const limit   = Math.max(1, Number(opts?.limit ?? process.env.RATE_LIMIT_DEFAULT ?? 60));
  const windowMs= Math.max(1000, Number(opts?.windowMs ?? process.env.RATE_WINDOW_MS ?? 60_000));
  const scope   = String(opts?.scope ?? "global");

  return async (req: Request) => {
    const key = keyFromReq(req, scope);
    const now = Date.now();

    let b = GLOBAL.__RATE__.get(key) as Bucket | undefined;
    if (!b) { b = { tokens: limit, updatedAt: now }; GLOBAL.__RATE__.set(key, b); }

    // أعِد تعبئة الدلو خطيًا
    const elapsed = now - b.updatedAt;
    const refill  = Math.floor(elapsed / windowMs) * limit;
    if (refill > 0) {
      b.tokens = Math.min(limit, b.tokens + refill);
      b.updatedAt = now;
    }

    if (b.tokens <= 0) {
      const retryAfter = Math.ceil((b.updatedAt + windowMs - now) / 1000);
      return NextResponse.json(
        { ok:false, error:"Too Many Requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    b.tokens -= 1;
    return handler(req);
  };
}
