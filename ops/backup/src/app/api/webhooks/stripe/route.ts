import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, stub: true, route: "/api/webhooks/stripe" });
}
export async function POST() {
  return NextResponse.json({ ok: true, stub: true, route: "/api/webhooks/stripe" });
}
