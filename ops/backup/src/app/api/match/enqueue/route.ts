import { NextResponse } from "next/server";
import { cfg } from "@/lib/config";
import { xfetch } from "@/lib/net/http";
import { mockMatcher } from "@/lib/matcher/mock";

export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const data = await req.json().catch(()=>({}));
  if (!cfg.MATCHER_BASE_URL || cfg.USE_MOCK) {
    const resp = mockMatcher.put({ ...data, userId: data?.userId || Math.random().toString(36).slice(2) });
    return NextResponse.json(resp, { status: 200 });
  }
  const url = `${cfg.MATCHER_BASE_URL.replace(/\/+$/,"")}/match/enqueue`;
  const r = await xfetch(url, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(data) });
  return NextResponse.json(r.body, { status: r.status });
}
