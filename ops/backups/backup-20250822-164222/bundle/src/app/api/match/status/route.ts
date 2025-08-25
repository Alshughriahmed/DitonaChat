import { NextResponse } from "next/server";
import { cfg } from "@/lib/config";
import { xfetch } from "@/lib/net/http";
import { mockMatcher } from "@/lib/matcher/mock";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!cfg.MATCHER_BASE_URL || cfg.USE_MOCK) {
    return NextResponse.json({ configured:false, mock:true, ...mockMatcher.status() }, { status: 200 });
  }
  const url = `${cfg.MATCHER_BASE_URL.replace(/\/+$/,"")}/match/status`;
  const r = await xfetch(url, { method: "GET" });
  return NextResponse.json({ configured:true, upstream:r.body, status:r.status }, { status: 200 });
}
