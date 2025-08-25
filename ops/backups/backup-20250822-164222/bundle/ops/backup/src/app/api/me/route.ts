import { NextResponse } from "next/server";
import { kvGet } from "@/lib/kv";
import { freeAllActive } from "@/lib/vip";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url || "http://localhost");
  const userId = url.searchParams.get("userId") || undefined;
  const email = url.searchParams.get("email")?.toLowerCase() || undefined;
  const customerId = url.searchParams.get("customerId") || undefined;

  let sub = null;
  if (userId) sub = await kvGet(`sub:user:${userId}`);
  if (!sub && email) sub = await kvGet(`sub:email:${email}`);
  if (!sub && customerId) sub = await kvGet(`sub:customer:${customerId}`);

  const free = freeAllActive();
  const active = !!sub && (sub.status === "active" || sub.status === "trialing");
  const isVip = free || active;

  return NextResponse.json({
    ok: true,
    isVip,
    freeAll: free,
    subscription: sub || null,
  });
}
