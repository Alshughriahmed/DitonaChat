import { NextResponse } from "next/server";
import limiter from "@/server/limit-middleware";
export async function GET() {
  const s = limiter.stats || {};
  return NextResponse.json({ ok:true, allowed:s.allowed??0, dropped:s.dropped??0, byEvent:s.byEvent??{} });
}
export async function DELETE() {
  limiter.reset();
  return NextResponse.json({ ok:true, reset:true });
}
